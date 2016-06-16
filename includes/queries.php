<?php

require_once "database_config.php";

function queries($choice, $var = "") {
	global $mysqli;
	$choice = $mysqli->real_escape_string($choice);
	
	if (strcmp($choice, "lead") === 0)
		$query = "SELECT * FROM `waterCondition` ORDER BY `leadLevel` ASC";
	else if (strcmp($choice, "providers") === 0)
		if (strcmp($var, "") === 0)		
			$query = "SELECT locationName, AidLocation.aidAddress, hours, phone, city, zipcode, resType, notes, latitude, longitude FROM AidLocation, ResourcesQuantity JOIN GeoLocation ON REPLACE(aidAddress,'\r','') = REPLACE(StAddress,'\r','') WHERE AidLocation.aidAddress = ResourcesQuantity.aidAddress";
		else
			$query = "SELECT resType FROM `resourcesquantity` WHERE aidAddress = '" . $var . "'";
		
		//$query = "SELECT locationName, AidLocation.aidAddress, hours, phone, city, zipcode, resType, notes, latitude, longitude FROM AidLocation, ResourcesQuantity JOIN GeoLocation ON aidAddress = REPLACE(StAddress,'\r','') WHERE AidLocation.aidAddress = ResourcesQuantity.aidAddress";
		//$query = "SELECT locationName, AidLocation.aidAddress, hours, phone, city, zipcode, resType, notes, latitude, longitude FROM AidLocation, ResourcesQuantity JOIN GeoLocation ON REPLACE(aidAddress,'\r','') = REPLACE(StAddress,'\r','') WHERE AidLocation.aidAddress = ResourcesQuantity.aidAddress AND AidLocation.aidAddress = " . $var;
		//else


	
	return $mysqli->query($query);
}