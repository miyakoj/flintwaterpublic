<?php

/* HANDLES ADMIN SITE ACCOUNT MANAGEMENT */

if (@isset($_GET["mode"])) {
	$mode = $_GET["mode"];
	$actionCode = $_GET["oobCode"];
	$apiKey = $_GET["apiKey"];
	$genericError = "'<div class=\"alert alert-danger\" role=\"alert\">There was an error. Please try again later.</div>'";
	
	$loginCode = "auth.signInWithEmailAndPassword(email, password);
				\$('#mgmt_form').append('<div class=\"alert alert-success\" role=\"alert\">Your password has been reset and you have been automatically logged in.</div>');
				
				firebase.auth().onAuthStateChanged(function(user) {
					if (user) {
						db.ref('users/' + user.uid).once('value').then(function(snapshot) {
							var form = \$('<form></form>');
							\$(form).attr('method', 'post').attr('action', 'page.php');
							var pid_input = \$('<input type=\"hidden\" name=\"pid\" />').val('dashboard');
							var role_input = \$('<input type=\"hidden\" name=\"role\" />').val(snapshot.val().role);
							\$(form).append(pid_input, role_input);
							\$(form).appendTo('body').submit();
						}
					}
				}";
	
	switch($mode) {
		// password reset
		case "resetPassword":
			$pagetitle = "Reset Password";
			
			$function = "/* From: http://regexlib.com/REDetails.aspx?regexp_id=1111 */
						$.validator.addMethod('password', function(value, element) {
							return this.optional(element) || /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/.test(value);
						}, 'Your password is too simple.');
						$.validator.classRuleSettings.password = {password: true};
						
						$.validator.addMethod('password_confirm', function(value, element) {
							return this.optional(element) || value == \$('#password').val();
						}, 'Your passwords do not match.');
						$.validator.classRuleSettings.password_confirm = {password_confirm: true};
				
					auth.verifyPasswordResetCode('$actionCode').then(function(email) {
						\$('#mgmt_form h4 span').html(email);
						
						\$.ajax({
							type: 'GET',
							url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/jquery.validate.min.js',
							dataType: 'script',
							cache: true
						}).done(function() {
							$('#mgmt_form').validate({
								debug: false,
								errorPlacement: function(error, element) {
									element.parent().append(error);
								},
								rules: {
									password: {
										required: true,
										password: true,
										minlength: 6
										maxlength: 10
									}
									password_confirm: {
										required: true,
										password_confirm: true
									}
								},
								submitHandler: function(form) {
									// Save the new password.
									auth.confirmPasswordReset('$actionCode', newPassword).then(function(resp) {
										$loginCode
									}).catch(function(error) {
										\$('#mgmt_form').append($genericError);
									});
									
									return false;
								}
							);
						});
					  }).catch(function(error) {
							\$('#mgmt_form').append('<div class=\"alert alert-danger\" role=\"alert\">There was an error. A new password reset email has been sent.</div>');
							
							auth.sendPasswordResetEmail(email).then(function() {
							}, function(error) {
								\$('#mgmt_form').append(genericError);
							});
					  });";
						  
			$form = "<form id='#mgmt_form' method='post'>
					<div class='row'><div class='col-xs-12 col-md-3 col-md-offset-3'><h4>User: <span></span></h4></div></div>
			
					<div class='row'>
					<div class='col-xs-12 col-md-3 col-md-offset-3'>
					<label for='password'>Password:</label>
					<input id='password' class='form-control' type='password' name='password' size='10' />
					<span class='help-block hide'>Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character from ''. The length must be between 6-10 characters.</span>
					</div>
					<div class='col-xs-12 col-md-3'>
					<label for='password_confirm'>Confirm Password:</label>
					<input id='password_confirm' class='form-control' type='password' name='password_confirm' size='10' />
					</div>						
					</div>

					<div class='row'><div class='col-xs-12 col-md-6 col-md-offset-3'><button type='submit' class='btn btn-default pull-right'>Submit</button></div></div>
					</form>";
			
		break;
		
		// email recovery
		case "recoverEmail":
			$pagetitle = "Reset Email";
			
			$function = "var restoredEmail = null;
						auth.checkActionCode('$actionCode').then(function(info) {
							// Get the restored email address.
							restoredEmail = info['data']['email'];

							// Revert to the old email.
							return auth.applyActionCode('$actionCode');
						}).then(function() {
							// Account email reverted to restoredEmail
							\$('#mgmt_page section').append('<div class=\"alert alert-success\" role=\"alert\">Your previous email address has been restored.</div>');

							auth.sendPasswordResetEmail(restoredEmail).then(function() {
								\$('#mgmt_page section').append('<div class=\"alert alert-success\" role=\"alert\">A password reset email has been sent.</div>');
							}).catch(function(error) {
								\$('#mgmt_page section').append($genericError);
							});
						}).catch(function(error) {
							\$('#mgmt_page section').append($genericError);
						});";
			
			$form = "";
		break;
	
		// email confirmation
		case "verifyEmail":
			$pagetitle = "Verify Email";
			
			$function = "auth.applyActionCode('$actionCode').then(function(resp) {
							// Email address has been verified.
							\$('#mgmt_page section').append('<div class=\"alert alert-success\" role=\"alert\">Your email address has been confirmed. You will now be forwarded to the login page.</div>');
							window.location.href='login.php';
							
						}).catch(function(error) {
							\$('#mgmt_page section').append('<div class=\"alert alert-danger\" role=\"alert\">There was an error. A new verification email has been sent.</div>');
							firebase.auth().currentUser.sendEmailVerification();
						});";
			
			$form = "";
		break;
		
		default:
			header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
	}
	
	$script = "<script>
			\$(document).ready(function() {
				var config = {
					apiKey: '$apiKey',
					authDomain: 'uniteflint.firebaseapp.com',
					databaseURL: 'https://uniteflint.firebaseio.com',
					storageBucket: 'uniteflint.appspot.com',
					messagingSenderId: '402781339047'
				};
	
				var app = firebase.initializeApp(config);
				var auth = app.auth();
				var db = app.database();
				
				$function
			});
			</script>";
	
	echo header("Content-type: text/html");
	echo header("Accept-Encoding: gzip");

	echo "<!DOCTYPE html>
	<html>
	<head>
	<title>MyWater-Flint | Administrative Site</title>
	<meta name='viewport' content='width=device-width, initial-scale=1'>
	<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
	<link rel='shortcut icon' href='../images/favicon16.png' type='image/png' />
	<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>
	<!-- Custom Theme files -->
	<link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet'>
	<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
	<link href='css/template.css' rel='stylesheet' type='text/css' />
	<link href='css/font-awesome.css' rel='stylesheet' type='text/css' />
	<link href='css/custom_styles.css' rel='stylesheet' type='text/css' />
	<link href='css/style.css' rel='stylesheet' type='text/css' />
	<link href='css/alternate_styles.css' rel='stylesheet' type='text/css' />

	<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js'></script>
	<!-- Mainly scripts -->
	<!-- <script src='https://use.fontawesome.com/8bd2681a13.js'></script> -->
	<script src='js/jquery.metisMenu.js'></script>
	<script src='js/jquery.slimscroll.min.js'></script>
	<!-- Custom and plugin javascript -->
	<link href='css/custom.css' rel='stylesheet' rel='stylesheet' type='text/css' />
	<script src='js/custom.js'></script>
	<script src='js/screenfull.js'></script>

	<script src='https://www.gstatic.com/firebasejs/3.3.2/firebase.js'></script>

	<!----->
	<!--skycons-icons-->
	<script src='js/skycons.js'></script>
	<!--//skycons-icons-->
	
	$script
	</head>

	<body id='mgmt_page'>
	<div class='login'>
		<h3 class='text-center'>$pagetitle</h3>
		
		<div class='content-top'>
			<div class='col-xs-12 col-md-8 col-md-offset-2'>
			<div class='row'>
				<div class='content-top-1'>
				<section>
				$form
				</section>
				</div>
			</div>
			</div>
		</div>
	</div>
	
	<div class='clearfix'> </div>

	<footer class='copy'>
	<div id='copyright'>
		<span>MyWater-Flint &copy;2016</span>
		<a id='about_link' href='#'>About</a>
		<a id='disclaimer_link' href='#'>Disclaimer</a>
		<a id='privacy_link' href='#' class='hide'>Privacy</a>
		<a id='contact_us' href='#'>Contact</a>
	</div>
	</footer>

	<script src='js/jquery.nicescroll.js'></script>
	<!--<script src='js/custom_scripts.js'></script>-->
	<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js' integrity='sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa' crossorigin='anonymous'></script>
	<script type= 'text/javascript' src='https://www.google.com/jsapi'></script>
	<script src='../js/jquery.form.min.js' type='text/javascript'></script>
	</body>
	</html>";
}
else {
	/* 
	 * Redirect the user to the login page if they aren't logged in. 
	 * http://php.net/manual/en/function.headers-sent.php#60450
	 */
	$page = __ROOT__ . "login.php";
	
	if (!headers_sent())
        header("Location: " . $page);
    else {
        echo '<script type="text/javascript">';
        echo 'window.location.href="'.$page.'";';
        echo '</script>';
    }
}