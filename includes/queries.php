<?php

require_once "database_config.php";

function queries($choice) {
	global $mysqli;
	$choice = $mysqli->real_escape_string($choice);
	
	if (strcmp($choice, "lead") === 0)
		$query = "SELECT * FROM waterCondition ORDER BY leadLevel ASC LIMIT 100";
	
	// Return results
	return $mysqli->query($query);
}