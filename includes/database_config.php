<?php

$mysqli = new mysqli(
	null, // host
	'root', // username
	'',     // password
	'waterdata', // database name
	null,
	'/cloudsql/flint-water-project:flint-water-project-db'
);

if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}