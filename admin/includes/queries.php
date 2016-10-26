<?php

$folder = explode("/", $_SERVER["PHP_SELF"]);

if (strcmp($folder[2], "includes") === 0)
	$prefix = "../../";
else
	$prefix = "../";

require_once $prefix . "/includes/database_config.php";

function queries($choice, $var = "", $var2 = "") {
	global $mysqli;
	
	$mysqli->set_charset("utf8");
	
	$choice = $mysqli->real_escape_string($choice);
	$var = $mysqli->real_escape_string($var);
	$var2 = $mysqli->real_escape_string($var2);

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
	/*else if (strcmp($choice, "") === 0) {
		
	}*/

	return $mysqli->query($query);
}
