<?php
//require_once "database_config.php";

//global $mysqli;
//$mysqli->set_charset("utf8");

/* MongoDB connection info. */
$port = "27017";
$db = getenv('MONGODB_DATABASE');
$connection = new MongoClient("mongodb://" . getenv('MONGODB_USER') . ":" . getenv('MONGODB_PASSWORD') . "@" . getenv('MONGODB_IP') . ":" . $port . "/" .  $db);

//update_test_results();
update_predictions();
//update_fusion_table();


/* Retrieve new test results from UM-Ann Arbor's DB and insert them into Cloud SQL. */
function update_test_results() {
	global $db, $connection;
	$residential_data = $connection->$db->proc_geo_resi;
	$cursor = $residential_data->find()->sort(array('lat' => 1, 'lng' => 1)); //->limit(5)  ->skip(1487)
	
	$output = "latitude,longitude,leadLevel,copperLevel,dateUpdated,testID\n";
	
	while ($cursor->hasNext()) {
		$array = $cursor->getNext();
		
		if (((strpos($array["lat"], "42") !== false) || (strpos($array["lat"], "43") !== false)) 
			&& (stripos($array["google_add"], "Flint, MI") !== false)) { // && (is_numeric($array["google_add"][0]) === true)
			
			/*echo $array["google_add"] . "<br />";
			echo $array["lat"] . "<br />";
			echo $array["lng"] . "<br />";
			echo $array["Lead (ppb)"] . "<br />";
			echo $array["Copper (ppb)"] . "<br />";
			echo date("Y-m-d h:i:s", $array["Date Submitted"]->sec) . "<br />";
			echo $array["sample_num"] . "<br /><br />";*/
		
			$output .= sprintf("%f,%f,%d,%d,%s,%s\n", $array["lat"], $array["lng"], $array["Lead (ppb)"], $array["Copper (ppb)"], date("Y-m-d h:i:s", $array["Date Submitted"]->sec), $array["sample_num"]);
		}
		
		/*$query = sprintf("INSERT INTO waterCondition (latitude, longitude, leadLevel, copperLevel, dateUpdated, testID) VALUES ('%f', '%f', '%d', '%d', '%s', '%s');",
			$mysqli->real_escape_string($array["lat"]), $mysqli->real_escape_string($array["lng"]), $mysqli->real_escape_string($array["Lead (ppb)"]), $mysqli->real_escape_string($array["Copper (ppb)"]), $mysqli->real_escape_string(date("Y-m-d", $array["Date Submitted"]->sec)), $mysqli->real_escape_string($array["sample_num"]));
			
		$mysqli->query($query);*/
	}
	
	$options = ['gs' => ['Content-Type' => 'text/csv', 'read_cache_expiry_seconds' => '86400']];
	$context = stream_context_create($options);
	file_put_contents("gs://h2o-flint.appspot.com/lead_test_results.csv", $output, 0, $context);
}


/* Retrieve new test predictions from UM-Ann Arbor's DB and insert them into Cloud SQL. */
function update_predictions() {
	global $db, $connection;
	$predictions = $connection->$db->prediction;
	$cursor = $predictions->find()->sort(array('goog_address' => 1));
	
	$geolocation_output = "latitude,longitude,parcelID,StAddress,abandoned\n";
	$prediction_output = "latitude,longitude,prediction\n";
	
	while ($cursor->hasNext()) {
		$array = $cursor->getNext();
		
		if (((strpos($array["Latitude"], "42") !== false) || (strpos($array["Latitude"], "43") !== false)) 
			&& (is_numeric($array["goog_address"][0]) === true)) {
			
			$address = explode(", ", $array["goog_address"]);
		
			$geolocation_output .= sprintf("%f,%f,%s,%s,%s\n", $array["Latitude"], $array["Longitude"], $array["PID no Dash"], $address[0], $array["USPS Vacancy"]);
			$prediction_output .= sprintf("%f,%f,%f\n", $array["Latitude"], $array["Longitude"], $array["Probability"]);
		}
	}
	
	$options = ['gs' => ['Content-Type' => 'text/csv', 'read_cache_expiry_seconds' => '86400']];
	$context = stream_context_create($options);
	file_put_contents("gs://h2o-flint.appspot.com/geo_locations.csv", $geolocation_output, 0, $context);
	file_put_contents("gs://h2o-flint.appspot.com/lead_predictions.csv", $prediction_output, 0, $context);
}


/* Retrieve new test predictions and lead level values from UM-Ann Arbor's DB and insert them into the fusion table. */
function update_fusion_table() {
	global $db, $connection;
	$predictions = $connection->$db->prediction;
	$cursor = $predictions->find()->limit()->sort(array('Latitude' => 1));
	
	$output = "latitude,longitude,Address,Prediction,parcelID,testID,testDate,leadlevel,copperlevel\n";
	
	while ($cursor->hasNext()) {
		$array = $cursor->getNext();
		
		if ((strpos($array["Latitude"], "42") !== false) && (is_numeric($array["goog_address"][0]) === true)) {
			/*echo $array["Latitude"] . "<br />";
			echo $array["Longitude"] . "<br />";
			echo $array["PID no Dash"] . "<br />";
			echo $array["goog_address"] . "<br /><br />";*/
			
			//$output .= sprintf("%f,%f,%s,%f,%s,%s,\n", $array["Latitude"], $array["Longitude"], $address[0], $array["Probability"], $array["PID no Dash"], $array["sample_num"], date("Y-m-d h:i:s", $array["Date Submitted"]->sec), $array["Lead (ppb)"], $array["Copper (ppb)"]);
		}
		
		/*$address = explode(", ", $array["goog_address"]);
		
		if (strcmp($address[0], "Flint") === 0)
			$address[0] = "";*/
	}
	
	$options = ['gs' => ['Content-Type' => 'text/csv', 'read_cache_expiry_seconds' => '86400']];
	$context = stream_context_create($options);
	file_put_contents("gs://h2o-flint.appspot.com/fusion_table.csv", $output, 0, $context);
}

?>