<?php
/* Originally found on http://www.bitrepository.com/php-how-to-add-multi-language-support-to-a-website.html */

session_start();
header('Cache-control: private'); // IE 6 FIX

if(isset($_GET["lang"])) {
	$lang = $_GET["lang"];
	$_SESSION["lang"] = $lang;
	
	// set the cookie to expire in one year
	setcookie("lang", $lang, time() + (60 * 60 * 24 * 30 * 12));
 
	echo $_COOKIE["lang"];
}

switch ($lang) {
	case "es":
	$lang_file = "lang.es.php";
	break;

	/*case "ar":
	$lang_file = "lang.ar.php";
	break;*/
	
	case "en":
	$lang_file = "lang.en.php";
	break;

	default:
	$lang_file = "lang.en.php";
}
 
include_once "languages/" . $lang_file;
?>