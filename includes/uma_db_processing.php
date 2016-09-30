<?php
//require_once "database_config.php";

//global $mysqli;
//$mysqli->set_charset("utf8");

/* MongoDB connection info. */
$port = "27017";
$db = getenv('MONGODB_DATABASE');
$connection = new MongoClient("mongodb://" . getenv('MONGODB_USER') . ":" . getenv('MONGODB_PASSWORD') . "@" . getenv('MONGODB_IP') . ":" . $port . "/" .  $db);

$location_filter = array(
	'Latitude' => array('$gte' => 42, '$lt' => 44)
);

//update_test_results();
//update_predictions();
update_fusion_table();


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
		
			$output .= sprintf("%.14f,%.14f,%.0d,%.0d,%s,%s\n", $array["lat"], $array["lng"], $array["Lead (ppb)"], $array["Copper (ppb)"], date("Y-m-d h:i:s", $array["Date Submitted"]->sec), $array["sample_num"]);
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
	global $db, $connection, $location_filter;
	$predictions = $connection->$db->prediction;
	$cursor = $predictions->find($location_filter)->sort(array('goog_address' => 1));
	
	$geolocation_output = "latitude,longitude,parcelID,StAddress,abandoned\n";
	$prediction_output = "latitude,longitude,prediction\n";
	
	while ($cursor->hasNext()) {
		$array = $cursor->getNext();
		
		if ((is_numeric($array["goog_address"][0]) === true)) { //(($array["Latitude"] >= 42) || ($array["Latitude"] < 44)) && 
			$address = explode(", ", $array["goog_address"]);
			
			if (strcmp($array["USPS Vacancy"], " ") === 0)
				$abandoned = "U";
			else
				$abandoned = $array["USPS Vacancy"];
		
			$geolocation_output .= sprintf("%.20f,%.20f,%s,%s,%s\n", $array["Latitude"], $array["Longitude"], $array["PID no Dash"], $address[0], $abandoned);
			$prediction_output .= sprintf("%.20f,%.20f,%.20f\n", $array["Latitude"], $array["Longitude"], $array["Probability"]);
		}
	}
	
	$options = ['gs' => ['Content-Type' => 'text/csv', 'read_cache_expiry_seconds' => '86400']];
	$context = stream_context_create($options);
	file_put_contents("gs://h2o-flint.appspot.com/geo_locations.csv", $geolocation_output, 0, $context);
	file_put_contents("gs://h2o-flint.appspot.com/lead_predictions.csv", $prediction_output, 0, $context);
}


/* Retrieve new test predictions and lead level values from UM-Ann Arbor's DB and insert them into the fusion table. */
function update_fusion_table() {
	global $db, $connection, $location_filter;
	$predictions = $connection->$db->prediction;
	$residential_data = $connection->$db->proc_geo_resi;
	
	/*$options = array(
		array(
			'$lookup' => array(
				'from' => 'proc_geo_resi',
				'localField' => 'latitude',
				'foreignField' => 'lat',
				'as' => 'proc_geo_resi_doc'
			)
		),
		array('$unwind' => '$proc_geo_resi_doc'),
		array(
			'$redact' => array(
				'$cond' => array(
					array(
						'$eq' => array('lng', '$proc_geo_resi_doc.longitude')
					),
					'$$KEEP',
					'$$PRUNE'
				),
			)
		),
		array('$project' => array(
				'latitude' => 1,
				'longitude' => 1,
				
			)
		)
	);*/
	
	//data_by_address
	/*{ "$lookup": { 
        "from": "collection2", 
        "localField": "user1", 
        "foreignField": "user1", 
        "as": "collection2_doc"
    }}, 
    { "$unwind": "$collection2_doc" },
    { "$redact": { 
        "$cond": [
            { "$eq": [ "$user2", "$collection2_doc.user2" ] }, 
            "$$KEEP", 
            "$$PRUNE"
        ]
    }}, 
    { "$project": { 
        "user1": 1, 
        "user2": 1, 
        "percent1": "$percent", 
        "percent2": "$collection2_doc.percent"
    }}*/
	
	$query = array(
		'lat' => array('$eq' => $array["Latitude"]),
		'lng' => array('$eq' => $array["Longitude"])
	);	
	
	$predictions_cursor = $predictions->find($location_filter)->sort(array('goog_address' => 1)); //->aggregate($options)
	
	$output = "latitude,longitude,address,parcelID,abandoned,prediction,testID,testDate,leadLevel,copperLevel\n";
	
	while ($predictions_cursor->hasNext()) {
		$array = $predictions_cursor->getNext();
		
		$test_data_cursor = $residential_data->find($query)->limit(500)->sort(array('lat' => 1, 'lng' => 1));
		
		while ($test_data_cursor->hasNext()) {
			$array2 = $test_data_cursor->getNext();
	
			echo $array["Latitude"] . "<br />";
			echo $array["Longitude"] . "<br />";
			echo $array["PID no Dash"] . "<br />";
			echo $array["USPS Vacancy"] . "<br />";
			echo $array["Probability"] . "<br />";
			echo $array2["sample_num"] . "<br />";
			echo date("Y-m-d h:i:s", $array2["Date Submitted"]->sec) . "<br />";
			echo $array2["Lead (ppb)"] . "<br />";
			echo $array2["Copper (ppb)"] . "<br />";
			echo $array2["google_add"] . "<br />";
			
			//$output .= sprintf("%.14f,%.14f,%s,%s,%.13f,%s,%s,%.0d,%.0d\n", $array["Latitude"], $array["Longitude"], $address[0], $array["PID no Dash"], $array["Probability"], $array2["sample_num"], date("Y-m-d h:i:s", $array2["Date Submitted"]->sec), $array2["Lead (ppb)"], $array2["Copper (ppb)"]);
			
			//printf("%.14f,%.14f,%s,%s,%.13f,%s,%s,%.0d,%.0d\n", $array["Latitude"], $array["Longitude"], $address[0], $array["PID no Dash"], $array["Probability"], $array2["sample_num"], date("Y-m-d h:i:s", $array2["Date Submitted"]->sec), $array2["Lead (ppb)"], $array2["Copper (ppb)"]);
			
			echo "<br /><br />";
		}
	}
	
	//$options = ['gs' => ['Content-Type' => 'text/csv', 'read_cache_expiry_seconds' => '86400']];
	//$context = stream_context_create($options);
	//file_put_contents("gs://h2o-flint.appspot.com/fusion_table1.csv", $output, 0, $context);
}

?>