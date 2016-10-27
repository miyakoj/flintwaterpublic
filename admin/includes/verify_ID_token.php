<?php

	require_once "../../vendor/autoload.php";
	use \Firebase\JWT\JWT;
	
	$jwt = $_POST["token"];
	$keys = json_decode(file_get_contents("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"));
	$valid_flag = 0;
	
	foreach ($keys as $key) {
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
	}
	
	echo $valid_flag;