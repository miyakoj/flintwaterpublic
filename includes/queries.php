<?php

require_once "database_config.php";

function queries($choice, $var = "", $var2 = "", $obj = null) {
	global $mysqli;
	
	$mysqli->set_charset("utf8");
	
	$choice = $mysqli->real_escape_string($choice);
	$var = $mysqli->real_escape_string($var);
	$var2 = $mysqli->real_escape_string($var2);

	/* Data file update queries. */
	if (strcmp($choice, "providers") === 0) {
		$query = "SELECT latitude, longitude, locationName, AidLocation.aidAddress, city, zipcode, hours, phone, notes, GROUP_CONCAT(resType) AS resType FROM AidLocation INNER JOIN ResourcesQuantity ON AidLocation.aidAddress = ResourcesQuantity.aidAddress GROUP BY AidLocation.aidAddress ORDER BY locationName ASC;";
	}
	else if (strcmp($choice, "leadArea") === 0) {
		$query = "SELECT latitude, longitude, leadLevel, MAX(dateUpdated) FROM WaterCondition GROUP BY (address) ORDER BY latitude ASC, longitude ASC;";
	}
	/* Updates from Ann Arbor's DB queries. */
	else if(strcmp($choice, "max_date") === 0) {
		$query = "SELECT MAX(dateUpdated) as newestDate FROM WaterCondition;";
	}
	/* Website-related queries. */
	else if(strcmp($choice, "problem_report") === 0) {
		if ($obj != null) {
			$query = sprintf("INSERT INTO ReportProblem (location, latitude, longitude, problem, notes, email, reportTicket) VALUES ('%s', '%f', '%f', '%s', '%s', '%s', '%s');",
				$mysqli->real_escape_string($obj->{"location"}), $mysqli->real_escape_string($obj->{"lat"}), $mysqli->real_escape_string($obj->{"lng"}), $mysqli->real_escape_string($obj->{"problemType"}), $mysqli->real_escape_string($obj->{"description"}), $mysqli->real_escape_string($obj->{"email"}), $var2);
		}
		else {
			$query = sprintf("INSERT INTO ReportProblem (location, latitude, longitude, problem, notes, email, reportTicket) VALUES ('%s', '%f', '%f', '%s', '%s', '%s', '%s');",
				$mysqli->real_escape_string($_POST["location"]), $mysqli->real_escape_string($_POST["lat"]), $mysqli->real_escape_string($_POST["lng"]), $mysqli->real_escape_string($_POST["problemType"]), $mysqli->real_escape_string($_POST["description"]), $mysqli->real_escape_string($_POST["email"]), $var2);
		}
	}
	else if (strcmp($choice, "resource_report") === 0) {
		if ($obj != null) {
			$query = sprintf("INSERT INTO AidInaccuracy (address, reason, reportTicket) VALUES ('%s', '%s', '%s');",
				$mysqli->real_escape_string($obj->{"address"}), $mysqli->real_escape_string($obj->{"reason"}), $var2);
		}
		else {
			$query = sprintf("INSERT INTO AidInaccuracy (address, reason, reportTicket) VALUES ('%s', '%s', '%s');",
				$mysqli->real_escape_string($_POST["address"]), $mysqli->real_escape_string($_POST["reason"]), $var2);
		}
	}
	else if (strcmp($choice, "survey") === 0) {
		if ($obj) {
			if (strcmp($obj->{"type"}, "survey1") === 0) {
				$query = sprintf("INSERT INTO survey1 (address, usingWaterFilter, date) VALUES ('%s', '%s', '%s');",
					$mysqli->real_escape_string($obj->{"address"}), $mysqli->real_escape_string($obj->{"usingWaterFilter"}), $mysqli->real_escape_string($obj->{"date"}));
			}
			else if (strcmp($obj->{"type"}, "survey2") === 0) {
				$query = sprintf("INSERT INTO survey2 (address, usingTapWater, cooking, drinking, washing, flushingCampaigns, other) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s');",
					$mysqli->real_escape_string($obj->{"address"}), $mysqli->real_escape_string($obj->{"usingTapWater"}), $mysqli->real_escape_string($obj->{"cooking"}), $mysqli->real_escape_string($obj->{"drinking"}), $mysqli->real_escape_string($obj->{"washing"}), $mysqli->real_escape_string($obj->{"flushingCampaigns"}), $mysqli->real_escape_string($obj->{"other"}));
			}
			else if (strcmp($obj->{"type"}, "survey3") === 0) {
				$query = sprintf("INSERT INTO survey3 (address, notTested, testedWithFilter, testedWithoutFilter, other) VALUES ('%s', '%s', '%s', '%s', '%s');",
					$mysqli->real_escape_string($obj->{"address"}), $mysqli->real_escape_string($obj->{"notTested"}), $mysqli->real_escape_string($obj->{"testedWithFilter"}), $mysqli->real_escape_string($obj->{"testedWithoutFilter"}), $mysqli->real_escape_string($obj->{"other"}));
			}
			else if (strcmp($obj->{"type"}, "survey4") === 0) {
				$query = sprintf("INSERT INTO survey4 (address, knowServiceLineType, serviceLineType, email) VALUES ('%s', '%s', '%s', '%s');",
					$mysqli->real_escape_string($obj->{"address"}), $mysqli->real_escape_string($obj->{"knowServiceLineType"}), $mysqli->real_escape_string($obj->{"serviceLineType"}), $mysqli->real_escape_string($obj->{"email"}));
			}
		}
		else {
			//web app stuff
		}
	}
	/* Misc Queries */
	else if (strcmp($choice, "alerts") === 0) {
		$query = sprintf("SELECT * FROM Alerts WHERE exp > '%s';", new DateTime(time())->format("Y-m-d H:i:s"));
		echo $query;
	}
	else if (strcmp($choice, "contact_form") === 0) {
		$query = sprintf("INSERT INTO ContactForm (type, email, comments) VALUES ('%s', '%s', '%s');", $_POST["form_type"], $mysqli->real_escape_string($_POST["email"]), $mysqli->real_escape_string($_POST["comments"]));
	}

	return $mysqli->query($query);
}