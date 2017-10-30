<?php

@define("__ROOT__", dirname(dirname(__FILE__)));
require __ROOT__ . "/includes/database_config.php";

function queries($choice, $var = "", $var2 = array()) {
	global $mysqli;
	
	$choice = $mysqli->real_escape_string($choice);
	$var = $mysqli->real_escape_string($var);

	/* Dashboard Queries */
	if (strcmp($choice, "test_data") === 0) {
		$query = "SELECT Year(`dateUpdated`) AS year, Month(`dateUpdated`) AS month, Avg(`leadLevel`) AS avgLeadLevel, Avg(`copperLevel`) AS avgCopperLevel, Sum(`leadLevel`) AS totalTests FROM `WaterCondition` GROUP BY year ASC, month ASC;";
	}
	else if (strcmp($choice, "total_locations_tested") === 0) {
		$query = "SELECT DISTINCT `latitude`, `longitude`, COUNT(`latitude`) AS totalLocationsTested FROM WaterCondition;";
	}
	else if (strcmp($choice, "total_parcels") === 0) {
		$query = "SELECT COUNT(`parcelID`) AS total_parcels FROM Geolocation;";
	}
	else if (strcmp($choice, "abandoned_parcels") === 0) {
		$query = "SELECT COUNT(`parcelID`) AS total_parcels FROM Geolocation WHERE `abandoned` = 'Y';";
	}
	else if (strcmp($choice, "unknown_parcels") === 0) {
		$query = "SELECT COUNT(`parcelID`) AS total_parcels FROM Geolocation WHERE `abandoned` = 'U';";
	}
	else if (strcmp($choice, "total_approved_repairs") === 0) {
		$query = "SELECT COUNT(`address`) as totalApprovedRepairs FROM ConstructionInfo;";
	}
	else if (strcmp($choice, "time_period") === 0) {
		$query = "SELECT DISTINCT Year(`dateUpdated`) AS year, Month(`dateUpdated`) AS month FROM WaterCondition ORDER BY year ASC, month ASC;";
	}
	/* Report Queries */
	else if (strcmp($choice, "water_tests") === 0) {
		// group by
		/*if (strcmp($var2["group_by"], "") !== 0) {
			$groupby_clause = " GROUP BY ";
		
			switch($var2["group_by"]) {
				case "date":
					$groupby_clause .= "`dateUpdated`";
				break;
				
				case "address":
					$groupby_clause .= "`address`";
				break;
			}
		}
		else
			$groupby_clause = "";*/
		
		// order by
		if (strcmp($var2["order_by"], "") !== 0) {
			$orderby_clause = " ORDER BY ";
		
			switch($var2["order_by"]) {
				case "date_asc":
					$orderby_clause .= "`dateUpdated` ASC";
				break;
				
				case "date_desc":
					$orderby_clause .= "`dateUpdated` DESC";
				break;
				
				case "lead_asc":
					$orderby_clause .= "`leadLevel` ASC";
				break;
				
				case "lead_desc":
					$orderby_clause .= "`leadLevel` DESC";
				break;
				
				case "copper_asc":
					$orderby_clause .= "`copperLevel` ASC";
				break;
				
				case "copper_desc":
					$orderby_clause .= "`copperLevel` DESC";
				break;
				
				case "address_asc":
					$orderby_clause .= "`address` ASC";
				break;
				
				case "address_desc":
					$orderby_clause .= "`address` DESC";
			}
		}
		else
			$orderby_clause = "";
		
		// limits
		if (sizeof($var2["limit"]) > 0) {
			$limit_clause = "";
			
			if (strcmp($var2["limit"]["lead_greater"], "") !== 0) {
				$limit_clause .= sprintf(" && `leadLevel` > %s", $var2["limit"]["lead_greater"]);
			}
			if (strcmp($var2["limit"]["lead_less"], "") !== 0) {
				$limit_clause .= sprintf(" && `leadLevel` < %s", $var2["limit"]["lead_less"]);
			}
			if (strcmp($var2["limit"]["copper_greater"], "") !== 0) {
				$limit_clause .= sprintf(" && `copperLevel` > %s", $var2["limit"]["copper_greater"]);
			}
			if (strcmp($var2["limit"]["copper_less"], "") !== 0) {
				$limit_clause .= sprintf(" && `copperLevel` < %s", $var2["limit"]["copper_less"]);
			}			
		}
		else
			$limit_clause = "";
			
		$where_clause = "Month(`dateUpdated`) IN(" . implode(",", $var2["months"]) . ") && Year(`dateUpdated`) IN(" . implode(",", $var2["years"]) . ")"
						. $limit_clause;
		
		$query = sprintf("SELECT `address`, `leadLevel`, `copperLevel`, `dateUpdated` FROM `WaterCondition` WHERE %s%s;", $where_clause, $orderby_clause);
	}
	else if (strcmp($choice, "contact_form_resp") === 0) {
		$query = "SELECT * FROM `ContactForm` ORDER BY `dateAdded` DESC;";
	}
	/*else if (strcmp($choice, "all_water_tests2") === 0) {
		$query = "SELECT `address`, `leadLevel`, `copperLevel`, `dateUpdated` FROM `WaterCondition` GROUP BY `address` ORDER BY `dateUpdated` DESC;";
	}
	else if (strcmp($choice, "high_water_tests1") === 0) {
		$query = "SELECT `address`, `leadLevel`, `copperLevel`, `dateUpdated` FROM `WaterCondition` WHERE `leadLevel` > 15 ORDER BY `dateUpdated` DESC;";
	}
	else if (strcmp($choice, "high_water_tests2") === 0) {
		$query = "SELECT `address`, `leadLevel`, `copperLevel`, `dateUpdated` FROM `WaterCondition` WHERE `leadLevel` > 15 GROUP BY `address` ORDER BY `dateUpdated` DESC;";
	}*/
	/* Manage Alerts Queries */
	else if (strcmp($choice, "alerts_titles") === 0) {
		$query = "SELECT id, title FROM Alerts ORDER BY title ASC;";
	}
	else if (strcmp($choice, "edit_alert_load") === 0) {
		$query = sprintf("SELECT * FROM Alerts WHERE id = %d;", $var);
	}
	else if (strcmp($choice, "edit_alert_submit") === 0) {
		if ($_POST["expiration"] === "")
			$expiration = "0000-00-00 00:00:00";
		else
			$expiration = $_POST["expiration"];
		
		$query = sprintf("UPDATE Alerts SET title = '%s', body = '%s', url = '%s', expiration = '%s', priority = '%s' WHERE id = %d;", $mysqli->real_escape_string($_POST["title"]), $mysqli->real_escape_string($_POST["body"]), $mysqli->real_escape_string($_POST["url"]), $expiration, $_POST["priority"], $_POST["id"]);
	}
	else if (strcmp($choice, "new_alert") === 0) {
		if ($_POST["expiration"] === "")
			$expiration = "0000-00-00 00:00:00";
		else
			$expiration = $_POST["expiration"];
		
		$query = sprintf("INSERT INTO Alerts (title, body, url, expiration, priority) VALUES ('%s', '%s', '%s', '%s', '%s');", $mysqli->real_escape_string($_POST["title"]), $mysqli->real_escape_string($_POST["body"]), $mysqli->real_escape_string($_POST["url"]), $expiration, $_POST["priority"]);
	}
	else if (strcmp($choice, "delete_alert") === 0) {
		$query = sprintf("DELETE FROM Alerts WHERE id = %d;", $var);
	}
	else if (strcmp($choice, "get_alerts") === 0) {
		$date = new DateTime(); // get the current date and time
		
		$query = sprintf("SELECT priority, title, body, url, added, expiration FROM Alerts WHERE expiration >= '%s' || YEAR(expiration) = '0000' ORDER BY priority ASC, expiration DESC;", $date->format("Y-m-d H:i:s"));
	}
	/* Edit Page Queries */
	else if (strcmp($choice, "resource_locations") === 0) {
		$query = "SELECT aidAddress FROM AidLocation WHERE aidAddress != '' ORDER BY aidAddress+0<>0 DESC, aidAddress+0, aidAddress;";
	}
	else if (strcmp($choice, "edit_resource_load") === 0) {
		$query = sprintf("SELECT latitude, longitude, locationName, AidLocation.aidAddress, city, zipcode, hours, phone, notes, GROUP_CONCAT(resType) AS resType FROM AidLocation INNER JOIN ResourcesQuantity ON AidLocation.aidAddress = ResourcesQuantity.aidAddress WHERE AidLocation.aidAddress = '%s';", $var);
	}
	if (strcmp($choice, "edit_resource_submit") === 0) {
		$query = sprintf("UPDATE AidLocation SET latitude = '%s', longitude = '%s', locationName = '%s', city = '%s', state='MI', zipcode = '%s', hours = '%s', phone = '%s', notes = '%s' WHERE aidAddress = '%s';", $mysqli->real_escape_string($_POST["latitude"]), $mysqli->real_escape_string($_POST["longitude"]), $mysqli->real_escape_string($_POST["site"]), $mysqli->real_escape_string($_POST["city"]), $_POST["zipcode"], $mysqli->real_escape_string($_POST["hours"]), $_POST["phone"], $mysqli->real_escape_string($_POST["notes"]), $_POST["address"]);
		
		/* Deal with the resource types. */
		$query .= sprintf("DELETE FROM ResourcesQuantity WHERE aidAddress = '%s';", $_POST["address"]);
		
		foreach ($_POST["categories"] as $value)
			$query .= sprintf("INSERT INTO ResourcesQuantity (resType, aidAddress, quantity) VALUES ('%s', '%s', 1000);", $value, $_POST["address"]);
	}
	else if (strcmp($choice, "new_resource") === 0) {
		$query = sprintf("INSERT INTO AidLocation (latitude, longitude, locationName, aidAddress, city, state, zipcode, hours, phone, notes) VALUES ('%s', '%s', '%s', '%s', '%s', 'MI', '%s', '%s', '%s', '%s');", $_POST["latitude"], $_POST["longitude"], $_POST["site"], $_POST["address"], $_POST["city"], $_POST["zipcode"], $mysqli->real_escape_string($_POST["hours"]), $_POST["phone"], $mysqli->real_escape_string($_POST["notes"]));
		
		foreach ($_POST["categories"] as $value)
			$query .= sprintf("INSERT INTO ResourcesQuantity (resType, aidAddress, quantity) VALUES ('%s', '%s', 1000);", $value, $_POST["address"]);
	}
	else if (strcmp($choice, "delete_resource") === 0) {
		$query = sprintf("DELETE FROM AidLocation WHERE aidAddress = '%s';", $var);
		$query .= sprintf("DELETE FROM ResourcesQuantity WHERE aidAddress = '%s';", $var);
	}
	/* Misc Queries */
	else if (strcmp($choice, "contact_form") === 0) {
		$query = sprintf("INSERT INTO ContactForm (type, email, comments) VALUES ('%s', '%s', '%s');", $_POST["form_type"], $mysqli->real_escape_string($_POST["email"]), $mysqli->real_escape_string($_POST["comments"]));
	}
	/*else if (strcmp($choice, "") === 0) {
		
	}*/
	
	/* Use the multi-query function if there are multiple semi-colons. */
	if (substr_count($query, ";") > 1)
		return $mysqli->multi_query($query);
	else
		return $mysqli->query($query);
}