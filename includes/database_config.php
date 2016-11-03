<?php

@define("__ROOT__", dirname(dirname(__FILE__)));

if (file_exists(__ROOT__ . "/includes/local_db_config.php"))
	require __ROOT__ . "/includes/local_db_config.php";

$mysqli = new mysqli(
	getenv('MYSQL_HOST'), // host
	getenv('MYSQL_USER'), // username
	getenv('MYSQL_PASSWORD'), // password
	getenv('MYSQL_DATABASE'), // database name
	null,
	getenv('MYSQL_INSTANCE') // database instance
);

if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}