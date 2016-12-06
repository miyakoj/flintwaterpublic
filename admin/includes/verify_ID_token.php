<?php

/* Check Firebase login JWT. */

@define("__ROOT__", dirname(dirname(dirname(__FILE__))));
require __ROOT__ . "/vendor/autoload.php";

use \Firebase\JWT\JWT;

if (@isset($_POST["token"]))
	check_token($_POST["token"]);

function check_token($jwt) {
	$certificate = json_decode(file_get_contents("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"));
	$valid_flag = 0;
	
	/* Check the web token against every public key in the certificate. */
	foreach ($certificate as $key) {
		$parsed_key = openssl_x509_read($key);
		
		try {
			/* Decode the user web token. */
			$decoded = JWT::decode($jwt, $parsed_key, array('RS256'));
			$valid_flag = 1;
			echo $valid_flag;
			//exit();
		}
		catch(DomainException $e) {
			continue;
		}
		catch(ExpiredException $e) {
			echo $valid_flag;
			//exit();
		}
		catch(UnexpectedValueException $e) {
			echo $valid_flag;
			//exit();
		}
		catch(SignatureInvalidException $e) {
			echo $valid_flag;
			//exit();
		}
	}
}