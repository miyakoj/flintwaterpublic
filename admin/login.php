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
	$("#loading_screen").addClass("hide");
		
		if (firebase.auth().currentUser) {
			app = firebase.auth().app;
			db = app.database();
			
			/* If the user is logged in and they load the login page, forward them to the dashboard page. */
			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					db.ref("users/" + user.uid).once("value").then(function(snapshot) {
						var form = $("<form></form>");
						$(form).attr("method", "post").attr("action", "page.php");
						var pid_input = $("<input type=\"hidden\" name=\"pid\" />").val("dashboard");
						var role_input = $("<input type=\"hidden\" name=\"role\" />").val(snapshot.val().role);
						$(form).append(pid_input, role_input);
						$(form).appendTo("body").submit();
					});
				}
			});
		}
		else {
			/* Position the spinner based upon the size of the screen. */
			$(".loader").css("margin-top", windowHeight/2 - $(".loader").height()/2 + "px");
	
			var config = {
				apiKey: "AIzaSyAphuqStHEGm66EUi4fsdaU8OtOwuUnOrY",
				authDomain: "uniteflint.firebaseapp.com",
				databaseURL: "https://uniteflint.firebaseio.com",
				storageBucket: "uniteflint.appspot.com",
				messagingSenderId: "402781339047"
			};
			
			if (!firebase.auth().app)
				app = firebase.initializeApp(config);
			
			auth = firebase.auth();
			db = app.database();
		
			$("#login_form").on("submit", function(event) {
				$("#loading_screen").removeClass("hide");				
				var email = $("#login_email input").val();
				var password = $("#login_password input").val();
			
				// if reset password is unchecked, do normal sign in
				if ($("#forgot_password input").prop("checked") == false) {
					firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
						$(".alert").addClass("hide");

						decodeIDToken(firebase.auth().currentUser.uid, "login");
					},
					function(error) {
						if (error) {
							var errorCode = error.code;
							var errorMsg;
							
							$(".alert-danger").addClass("hide");

							if (errorCode === "auth/wrong-password")
								errorMsg = "<div class=\"alert alert-danger\" role=\"alert\">Your password is incorrect.</div>";			
							else if (errorCode === "auth/invalid-email")
								errorMsg = "<div class=\"alert alert-danger\" role=\"alert\">Your email address is invalid.</div>";
							else if (errorCode === "auth/user-not-found")
								errorMsg = "<div class=\"alert alert-danger\" role=\"alert\">There is no user account associated with this email address.</div>";
							else if (errorCode  === "auth/too-many-requests") {
								$("#login_email input").addClass("disable");
								$("#login_password input").addClass("disable");
								$("#forgot_password input").addClass("disable");
								$(".login-do input").addClass("disable");
								
								errorMsg = "<div class=\"alert alert-danger\" role=\"alert\">You have run out of login attempts. Please try again later.</div>";
							}
							else
								errorMsg = genericError;
							
							$("#login_form").append(errorMsg);

							console.log(error);
						}
					});
				}
				else {
					auth.sendPasswordResetEmail(email).then(function() {
						$("#login_form").append("<div class=\"alert alert-success\" role=\"alert\">A password reset email has been sent.</div>");
					}, function(error) {
						$("#login_form").append(genericError);
					});
				}
				
				event.preventDefault();
			});
		}
	});
	
	function decodeIDToken(uid, requestType) {
		firebase.auth().currentUser.getToken(true).then(function(token) {
			$.ajax({
				type: "POST",
				url: "includes/verify_ID_token.php",
				data: {"uid": uid, "token": token}
			}).done(function(data) {
				// store the token in a global user object if it"s valid
				if (data.indexOf("1") != -1) {
					// store the token in local storage along with the current time
					//if (typeof(Storage) !== "undefined")
						//localStorage.setItem("ID_token", token);
					
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
						$(".alert-danger").addClass("hide");
						$("#login_form").append(genericError);
					});
				}
				// ask the user to sign in again if invalid
				else {
					$(".alert-danger").addClass("hide");
					$("#login_form").append(genericError);
				}
			});
		}).catch(function(error) {
			$(".alert-danger").addClass("hide");
			$("#login_form").append(genericError);
		});
	}
</script>
</head>

<body id="login_page">
<div id="loading_screen" class="hide"><div class="loader"></div></div>

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
				<input type="password" placeholder="Password" name="password" required />
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

<footer class="copy hide">
<div id="copyright">
	<span>MyWater-Flint &copy;2016</span>
	<a id="about_link" href="#">About</a>
	<a id="disclaimer_link" href="#">Disclaimer</a>
	<a id="privacy_link" href="#" class="hide">Privacy</a>
	<a id="contact_us" href="#">Contact</a>
</div>
</footer>

<!--scrolling js-->
<script src="js/jquery.nicescroll.js"></script>
<script src="js/custom_scripts.js"></script>
<!--//scrolling js-->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script type= "text/javascript" src="https://www.google.com/jsapi"></script>
</body>
</html>