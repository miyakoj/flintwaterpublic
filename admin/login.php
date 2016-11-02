<?php

echo header("Content-type: text/html");
echo header("Accept-Encoding: gzip");

echo '<!DOCTYPE html>
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
</head>

<body id="login_page">
<div class="login">
	<h2 class="page_title">MyWater-Flint Administration Site</h2>
		
	<div class="login-bottom">
		<h3>Login</h3>
	
		<form>
		<div>
			<div id="login_email" class="login-mail">
				<input type="text" placeholder="Email" required="required" />
				<i class="fa fa-envelope"></i>
			</div>
			<div id="login_password" class="login-mail">
				<input type="password" placeholder="Password" required="required" />
				<i class="fa fa-lock"></i>
			</div>
				<a id="forgot_password" class="news-letter" href="#">
				<label class="checkbox1"><input type="checkbox" name="checkbox" /><i> </i> Forgot Password</label>
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

<footer class="copy">
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
</html>';
