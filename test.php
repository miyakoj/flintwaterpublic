<?php

$sql = new mysqli(
	null, // host
	'root', // username
	'adminpass',     // password
	'flint-water-project-db', // database name
	null,
	'/cloudsql/flint-water-project:flint-water-project-db'
);

if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}

$query = "SELECT * FROM `AidLocation` ORDER BY `locationName` ASC";
$result = $mysqli->query($query);

while ($row = $result->fetch_assoc()) {
	print_r($row);
}