<?php

require_once "includes/template.php";

/*$content = "<div class='login'>
		<h1><a href='index.html'>Minimal</a></h1>
		<div class='login-bottom'>
			<h2>Login</h2>
			<form>
			<div class='col-md-6'>
				<div class='login-mail'>
					<input type='text' placeholder='Email' required=''>
					<i class='fa fa-envelope'></i>
				</div>
				<div class='login-mail'>
					<input type='password' placeholder='Password' required=''>
					<i class='fa fa-lock'></i>
				</div>
				   <a class='news-letter ' href='#'>
						 <label class='checkbox1'><input type='checkbox' name='checkbox' ><i> </i>Forget Password</label>
					   </a>
			</div>
			
			<div class='col-md-6 login-do'>
				<label class='hvr-shutter-in-horizontal login-sub'>
					<input type='submit' value='login'>
					</label>
					<p>Do not have an account?</p>
				<a href='signup.html' class='hvr-shutter-in-horizontal'>Signup</a>
			</div>
			
			<div class='clearfix'> </div>
			</form>
		</div>
	</div>";*/
	
$content = "testing";

$page = new webpageTemplate("includes/template.html");
$page->set("PAGE_TITLE", "");
$page->set("PAGE_ID", "index_page");
$page->set("CONTENT", $content);
$page->create();