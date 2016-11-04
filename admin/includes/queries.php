<?php

@define("__ROOT__", dirname(dirname(__FILE__)));
require_once __ROOT__ . "/includes/database_config.php";

function queries($choice, $var = "", $var2 = array()) {
	global $mysqli;
	
	$mysqli->set_charset("utf8");
	
	$choice = $mysqli->real_escape_string($choice);
	$var = $mysqli->real_escape_string($var);

	/* Dashboard Queries */
	if (strcmp($choice, "test_data") === 0) {
		$query = "SELECT Year(`dateUpdated`) AS year, Month(`dateUpdated`) AS month, Avg(`leadLevel`) AS avgLeadLevel, Avg(`copperLevel`) AS avgCopperLevel, Sum(`leadLevel`) AS totalTests FROM `waterCondition` GROUP BY year ASC, month ASC;";
	}
	else if (strcmp($choice, "total_locations") === 0) {
		$query = "SELECT DISTINCT `latitude`, `longitude`, COUNT(`latitude`) AS totalLocationsTested FROM waterCondition;";
	}
	else if (strcmp($choice, "time_period") === 0) {
		$query = "SELECT DISTINCT Year(`dateUpdated`) AS year, Month(`dateUpdated`) AS month FROM waterCondition ORDER BY year ASC, month ASC;";
	}
	/* Report Queries */
	else if (strcmp($choice, "all_water_tests1") === 0) {
		$query = "SELECT `address`, `leadLevel`, `copperLevel`, `dateUpdated` FROM `waterCondition` ORDER BY `dateUpdated` DESC LIMIT 10;";
	}
	else if (strcmp($choice, "all_water_tests2") === 0) {
		$query = "SELECT `address`, `leadLevel`, `copperLevel`, `dateUpdated` FROM `waterCondition` GROUP BY `address` ORDER BY `dateUpdated` DESC;";
	}
	else if (strcmp($choice, "high_water_tests1") === 0) {
		$query = "SELECT `address`, `leadLevel`, `copperLevel`, `dateUpdated` FROM `waterCondition` WHERE `leadLevel` > 15 ORDER BY `dateUpdated` DESC;";
	}
	else if (strcmp($choice, "high_water_tests2") === 0) {
		$query = "SELECT `address`, `leadLevel`, `copperLevel`, `dateUpdated` FROM `waterCondition` WHERE `leadLevel` > 15 GROUP BY `address` ORDER BY `dateUpdated` DESC;";
	}
	/* Edit Page Queries */
	else if (strcmp($choice, "resource_locations") === 0) {
		$query = "SELECT aidAddress FROM AidLocation ORDER BY aidAddress+0<>0 DESC, aidAddress+0, aidAddress;";
	}
	else if (strcmp($choice, "edit_resource_load") === 0) {
		$query = sprintf("SELECT latitude, longitude, locationName, AidLocation.aidAddress, city, zipcode, hours, phone, notes, GROUP_CONCAT(resType) AS resType FROM AidLocation INNER JOIN ResourcesQuantity ON AidLocation.aidAddress = ResourcesQuantity.aidAddress WHERE AidLocation.aidAddress = '%s';", $var);
	}
	if (strcmp($choice, "edit_resource_submit") === 0) {
		//$query = sprintf("", $var, );
		$query = sprintf("UPDATE AidLocation SET latitude = '%s', longitude = '%s', locationName = '%s', aidAddress = '%s', city = '%s', state='MI', zipcode = '%s', hours = '%s', phone = '%s', notes = '%s' WHERE aidAddress = '%s';", $var2["latitude"], $var2["longitude"], $var2["site"], $var2["address"], $var2["city"], $var2["zipcode"], $var2["hours"], $var2["phone"], $var2["notes"], $var);
		
		/* Deal with the resource types. */
		$query .= sprintf("DELETE FROM ResourcesQuantity WHERE aidAddress = '%s';", $var);
		
		foreach ($var2["categories"] as $value)
			$query .= sprintf("INSERT INTO ResourcesQuantity (resType, aidAddress, quantity) VALUES ('%s', '%s', 1000);", $value, $var);
	}
	else if (strcmp($choice, "new_resource") === 0) {
		
	}
	else if (strcmp($choice, "delete_resource") === 0) {
		$query = sprintf("DELETE FROM AidLocation WHERE aidAddress = '%s';", $var);
		$query .= sprintf("DELETE FROM ResourcesQuantity WHERE aidAddress = '%s';", $var);
	}
	/*else if (strcmp($choice, "") === 0) {
		
	}*/
	
	/* Use the multi-query function if there are multiple semi-colons. */
	if (substr_count($query, ";") > 1)
		return $mysqli->multi_query($query);
	else
		return $mysqli->query($query);
}
