<?php

/*$mysqli = new mysqli(
	null, // host
	getenv('MYSQL_USER'), // username
	getenv('MYSQL_PASSWORD'), // password
	'waterdata', // database name
	null,
	getenv('MYSQL_INSTANCE') // database instance
);*/

$mysqli = new mysqli("localhost", "root", "k1ch1r1K4ch1r1", "waterdata");

if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}