<?php

require_once "database_config.php";

function queries($choice) {
	global $mysqli;
	$choice = $mysqli->real_escape_string($choice);
	
	if (strcmp($choice, "lead") === 0)
		$query = "SELECT * FROM `waterCondition` ORDER BY `leadLevel` ASC";
	else if (strcmp($choice, "providers") === 0)
		$query = "SELECT * FROM `ResourcesQuantity` ORDER BY `aidAddress` ASC LIMIT 5";
	
	return $mysqli->query($query);
}