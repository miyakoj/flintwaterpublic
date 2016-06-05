<?php

$mysqli = new mysqli(
	null, // host
	getenv('MYSQL_USER'), // username
	getenv('MYSQL_PASSWORD'), // password
	'waterdata', // database name
	null,
	getenv('MYSQL_INSTANCE')
);

if ($mysqli->connect_errno) {
	print "error";
}