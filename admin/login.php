<?php

echo header("Content-type: text/html");
echo header("Accept-Encoding: gzip");

?>

<!DOCTYPE html>
<html>
<head>
<title>MyWater-Flint | Administrative Site</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" href="../images/favicon16.png" type="image/png" />
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<!-- Custom Theme files -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
<link href="css/template.css" rel="stylesheet" type="text/css" />
<link href="css/font-awesome.css" rel="stylesheet" type="text/css" />
<link href="css/custom_styles.css" rel="stylesheet" type="text/css" />
<link href="css/style.css" rel="stylesheet" type="text/css" />
<link href="css/alternate_styles.css" rel="stylesheet" type="text/css" />

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
<!-- Mainly scripts -->
<!-- <script src="https://use.fontawesome.com/8bd2681a13.js"></script> -->
<script src="js/jquery.metisMenu.js"></script>
<script src="js/jquery.slimscroll.min.js"></script>
<!-- Custom and plugin javascript -->
<link href="css/custom.css" rel="stylesheet" rel="stylesheet" type="text/css" />
<script src="js/custom.js"></script>
<script src="js/screenfull.js"></script>

<script src="https://www.gstatic.com/firebasejs/3.3.2/firebase.js"></script>

<!----->
<!--skycons-icons-->
<script src="js/skycons.js"></script>
<!--//skycons-icons-->

<script>
	$(document).ready(function() {		
		/* If the user is logged in and they load the login page, forward them to the dashboard page. */
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				app = firebase.auth().app;
				db = app.database();
			
				db.ref("users/" + user.uid).once("value").then(function(snapshot) {
					var form = $("<form></form>");
					$(form).attr("method", "post").attr("action", "page.php");
					var pid_input = $("<input type=\"hidden\" name=\"pid\" />").val("dashboard");
					var role_input = $("<input type=\"hidden\" name=\"role\" />").val(snapshot.val().role);
					$(form).append(pid_input, role_input);
					$(form).appendTo("body").submit();
				});
			}
			else {
				$("#loading_screen").addClass("hide");
				$("#wrapper").removeClass("hide");
			}
		});
	});
	
	function decodeIDToken(uid, status) {
		firebase.auth().currentUser.getToken().then(function(token) {
			$.ajax({
				type: "POST",
				url: "includes/verify_ID_token.php",
				data: {"uid": uid, "token": token}
			}).done(function(data) {				
				if (data === "1") {					
					db.ref("users/" + uid).once("value").then(function(snapshot) {
						// load the dashboard page
						var form = $("<form></form>");
						$(form).attr("method", "post").attr("action", "page.php");
						var pid_input = $("<input type=\"hidden\" name=\"pid\" />").val("dashboard");
						var role_input = $("<input type=\"hidden\" name=\"role\" />").val(snapshot.val().role);
						$(form).append(pid_input, role_input);
						$(form).appendTo("body").submit();
						
						$("#loading_screen").addClass("hide");
					},
					function(error) {
						$("#loading_screen, .alert-danger").addClass("hide");
						$("#login_form").append(genericError);
					});
				}
				// ask the user to sign in again if invalid
				else {
					$("#loading_screen, .alert-danger").addClass("hide");
					$("#login_form").append(genericError);
				}
			});
		}).catch(function(error) {
			$("#loading_screen, .alert-danger").addClass("hide");
			$("#login_form").append(genericError);
		});
	}
</script>
</head>

<body id="login_page">
<div id="loading_screen" class="hide"><div class="loader"></div></div>

<div id="wrapper" class="hide">
<div class="login">
	<h2 class="page_title">MyWater-Flint Administration Site</h2>
		
	<div class="login-bottom">
		<h3>Login</h3>
	
		<form id="login_form" method="post">
		<div>
			<div id="login_email" class="login-mail">
				<input type="text" placeholder="Email" name="email" required />
				<i class="fa fa-envelope"></i>
			</div>
			<div id="login_password" class="login-mail">
				<input type="password" placeholder="Password" name="password" />
				<i class="fa fa-lock"></i>
			</div>
				<a id="forgot_password" class="news-letter" href="#">
				<label class="checkbox1"><input type="checkbox" name="forgot_password" /><i> </i> Forgot Password</label>
				</a>
				   
			<div class="login-do">
				<label class="hvr-shutter-in-horizontal login-sub">
				<input type="submit" value="login" />
				</label>
			</div>
		</div>
		</form>
	</div>
</div>

<div id="contact_form" class="modal fade" tabindex="-1" role="dialog">
	<div class="modal-dialog" role="document">
		<form>
		<div class="modal-content">
			<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span class="icon" aria-hidden="true">close</span></button>
			<h4 class="modal-title">Contact Us</h4>
			</div>
			
			<div class="modal-body">
				<div class="form-group">
				<label for="email">Email:</label>
				<input id="email" class="form-control" type="text" name="email" placeholder="Enter your email address if you would like a response." tabindex="1" />
				</div>
				
				<div class="form-group">
				<label for="comments">Comments:</label>
				<textarea id="comments" class="form-control textarea-autosize" rows="5" name="comments" placeholder="Please enter at least 20 characters." tabindex="2" character limit required></textarea>
				</div>
			</div>
			
			<div class="modal-footer">
			<button type="button" class="btn btn-flat" data-dismiss="modal" tabindex="4">Cancel</button>
			<button type="submit" class="submit_button btn btn-default" tabindex="3">Submit</button>
			</div>
		</div>
		</form>
	</div>
</div>

<footer class="copy">
<div id="copyright">
	<span>MyWater-Flint &copy;2016</span>
	<a id="about_link" href="#">About</a>
	<a id="disclaimer_link" href="#">Disclaimer</a>
	<a id="privacy_link" href="#" class="hide">Privacy</a>
	<a id="contact_link" href="#" data-toggle="modal" data-target="#contact_form">Contact</a>
</div>
</footer>
</div>

<!--scrolling js-->
<script src="js/jquery.nicescroll.js"></script>
<script src="js/custom_scripts.js"></script>
<!--//scrolling js-->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script type= "text/javascript" src="https://www.google.com/jsapi"></script>
</body>
</html>