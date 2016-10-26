<?php

require_once "database_config.php";

function queries($choice, $var = "", $var2 = "", $obj = null) {
	global $mysqli;
	
	$mysqli->set_charset("utf8");
	
	$choice = $mysqli->real_escape_string($choice);
	$var = $mysqli->real_escape_string($var);
	$var2 = $mysqli->real_escape_string($var2);

	if (strcmp($choice, "lead") === 0) {
		$query = "SELECT Geo.latitude, Geo.longitude, leadlevel, testID, REPLACE(StAddress,'\r','') AS StAddress FROM waterCondition, (SELECT * FROM GeoLocation) Geo WHERE propertyID = locationID ORDER BY leadLevel ASC;";
	}
	else if (strcmp($choice, "providers") === 0) {
		if (strcmp($var, "") === 0)
			$query = "SELECT locationName, REPLACE(AidLocation.aidAddress,'\r','') AS aidAddress, hours, REPLACE(phone,'\r','') AS phone, city, zipcode, resType, notes, latitude, longitude FROM AidLocation, ResourcesQuantity  JOIN GeoLocation ON aidAddress = REPLACE(StAddress,'\r','') WHERE AidLocation.aidAddress = ResourcesQuantity.aidAddress;";
		else {
			$query = "SELECT resType FROM `ResourcesQuantity` WHERE REPLACE(aidAddress,'\\r','') = '" . $var . "';";
		}
	}
	else if(strcmp($choice, "problem_report") === 0) {
		if ($obj != null) {
			$query = sprintf("INSERT INTO ReportProblem (location, problem, notes, email, reportTicket) VALUES ('%s', '%s', '%s', '%s', '%s');",
					$mysqli->real_escape_string($obj->{"location"}), $mysqli->real_escape_string($obj->{"problemType"}), $mysqli->real_escape_string($obj->{"description"}), $mysqli->real_escape_string($obj->{"email"}), $var2);
		}
		else {
			$query = sprintf("INSERT INTO ReportProblem (location, problem, notes, email, reportTicket) VALUES ('%s', '%s', '%s', '%s', '%s');",
					$mysqli->real_escape_string($_POST["location"]), $mysqli->real_escape_string($_POST["problemType"]), $mysqli->real_escape_string($_POST["description"]), $mysqli->real_escape_string($_POST["email"]), $var2);
		}
	}
	else if(strcmp($choice, "resource_report") === 0) {
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

	return $mysqli->query($query);
}
