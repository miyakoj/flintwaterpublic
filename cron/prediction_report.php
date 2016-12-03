<?php

/* Update the CSV used to display the results of the admin predictions report. */

@define("__ROOT__", dirname(dirname(__FILE__)));
require __ROOT__ . "/includes/database_config.php";

$query = "SELECT g.address, p.parcelID, p.prediction FROM PredictionLocations p JOIN Geolocation g ON p.parcelID = g.parcelID ORDER BY p.parcelID ASC;";
$result = $mysqli->query($query);

$csv_output = "parcelID,address,prediction,avgLeadLevel\n";
$json_output = "{ \"predictions_report\": [\n";
$i = 0;
			
while ($row = $result->fetch_assoc()) {
	$query = sprintf("SELECT parcelID, address, AVG(leadLevel) AS avgLeadLevel FROM WaterCondition WHERE parcelID = '%s' GROUP BY parcelID;", $row["parcelID"]);
	$result2 = $mysqli->query($query);	
	$row2 = $result2->fetch_assoc();
				
	if ($row2) {
		$csv_output .= sprintf("%s,%s,%s,%s\n", $row["parcelID"], $row["address"], $row["prediction"], $row2["avgLeadLevel"]);
		$json_output .= json_encode(array("parcelID" => $row["parcelID"], "address" => $row["address"], "prediction" => $row["prediction"], "avgLeadLevel" => $row2["avgLeadLevel"]), JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT);
	}
	else {
		$csv_output .= sprintf("%s,%s,%s,-1\n", $row["parcelID"], $row["address"], $row["prediction"]);
		$json_output .= json_encode(array("parcelID" => $row["parcelID"], "address" => $row["address"], "prediction" => $row["prediction"], "avgLeadLevel" => -1), JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT);
	}
	
	if ($i < $result->num_rows-1)
		$json_output .= ",";
	
	$json_output .= "\n";
	
	$i++;
}

$json_output .= "]}";

$options = ['gs' => ['Content-Type' => 'text/csv', 'read_cache_expiry_seconds' => '86400']];
$context = stream_context_create($options);
file_put_contents("gs://h2o-flint.appspot.com/predictions_report.csv", $csv_output, 0, $context);

$options = ['gs' => ['Content-Type' => 'application/json', 'read_cache_expiry_seconds' => '86400']];
$context = stream_context_create($options);
file_put_contents("gs://h2o-flint.appspot.com/predictions_report.json", $json_output, 0, $context);