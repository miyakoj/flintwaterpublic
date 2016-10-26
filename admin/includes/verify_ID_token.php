<?php

	require_once "../../vendor/autoload.php";
	use \Firebase\JWT\JWT;
	
	$jwt = $_POST["token"];
	$keys = json_decode(file_get_contents("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"));
	
	foreach ($keys as $key) {
		$parsed_key = openssl_x509_read($key);
		
		/* Decode the user web token. */
		$decoded = JWT::decode($jwt, $parsed_key, array('RS256'));
		echo $decoded;
	}
	
	/* Decode the user web token. */
	//$decoded = JWT::decode($jwt, $keys, array('RS256'));
	
	//var_dump($decoded);
	
	/*
	$key = array(
		"alg" => "RS256",
		"kid" => "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com",
		"iss" => "https://securetoken.google.com/uniteflint",
		"aud" => "uniteflint",
		"sub" => $_POST["uid"],
		"iat" => 1452000000,
		"exp" => 1477000000
	);
	
	$decoded_array = (array)$decoded;*/