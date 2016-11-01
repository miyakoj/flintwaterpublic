<?php

use \Firebase\JWT\JWT;

if (@isset($_POST["token"])) {
	@define("__ROOT__", dirname(dirname(dirname(__FILE__))));
	require __ROOT__ . "/vendor/autoload.php";
	
	check_token($_POST["token"]);
}
else {
	@define("__ROOT__", dirname(dirname(__FILE__)));
	require __ROOT__ . "/vendor/autoload.php";
}

function check_token($jwt) {
	$certificate = json_decode(file_get_contents("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"));
	$valid_flag = 0;
	
	/* Check the web token against every key in the certificate. */
	foreach ($certificate as $key) {
		$parsed_key = openssl_x509_read($key);
		
		try {
			/* Decode the user web token. */
			$decoded = JWT::decode($jwt, $parsed_key, array('RS256'));
			$valid_flag = 1;
			break;
		}
		catch(DomainException $e) {
			continue;
		}
		catch(ExpiredException $e) {
			$valid_flag = 2;
			echo $valid_flag;
			exit();
		}
	}
	
	// the request came via AJAX
	if (@isset($_POST["token"]))
		echo $valid_flag;
	// the request came via PHP
	else
		return (array)$decoded;
}