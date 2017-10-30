<?php

/* Update the CSV used to record the results of the admin predictions report. */

@define("__ROOT__", dirname(dirname(__FILE__)));
require __ROOT__ . "/includes/database_config.php";

$query = "SELECT g.address, p.parcelID, p.prediction FROM PredictionLocations p JOIN Geolocation g ON p.parcelID = g.parcelID ORDER BY p.parcelID ASC;";
$result = $mysqli->query($query);

$csv_output = "parcelID,address,lead level above 15ppb prediction,avgLeadLevel\n";
$i = 0;
			
while ($row = $result->fetch_assoc()) {
	$query = sprintf("SELECT parcelID, address, AVG(leadLevel) AS avgLeadLevel FROM WaterCondition WHERE parcelID = '%s' GROUP BY parcelID;", $row["parcelID"]);
	$result2 = $mysqli->query($query);	
	$row2 = $result2->fetch_assoc();
				
	if ($row2)
		$csv_output .= sprintf("%s,%s,%s,%s\n", $row["parcelID"], $row["address"], $row["prediction"], $row2["avgLeadLevel"]);
	else
		$csv_output .= sprintf("%s,%s,%s,Unknown\n", $row["parcelID"], $row["address"], $row["prediction"]);
	
	$i++;
}

$options = ['gs' => ['Content-Type' => 'text/csv', 'read_cache_expiry_seconds' => '86400']];
$context = stream_context_create($options);
file_put_contents("gs://h2o-flint.appspot.com/predictions_report.csv", $csv_output, 0, $context);