<?php

/*
 * Update the database if new water tests are found.
 */
@define("__ROOT__", dirname(dirname(__FILE__)));
require_once __ROOT__ . "/includes/database_config.php";

/* MongoDB connection info. */
$port = "27017";
$db = getenv('MONGODB_DATABASE');
$connection = new MongoClient("mongodb://" . getenv('MONGODB_USER') . ":" . getenv('MONGODB_PASSWORD') . "@" . getenv('MONGODB_IP') . ":" . $port . "/" .  $db);

// the data retrieved from the MongoDB db
$new_data = array();

getNewTestData();
updateSQLDB();

/* Retrieve new water test results from Ann Arbor's DB */
function getNewTestData() {
	global $mysqli, $db, $connection, $new_data;
	
	// get the date of the most recent test from Cloud SQL
	$query = "SELECT dateUpdated FROM WaterCondition ORDER BY dateUpdated DESC LIMIT 1;";
	$result = $mysqli->query($query);
	$row = $result->fetch_assoc();
	
	// convert a standard MySQL date into a MongoDB ISO date
	$most_recent_date = new MongoDate(strtotime($row["dateUpdated"]));	
	
	// only retrieve proper Flint, MI addresses newer than the newest test in the SQL database
	$address_filter = array(
		'Date Submitted' => array('$gt' => $most_recent_date),
		'goog_address' => array('$regex' => '^((G-)?[0-9]+\s)+([NSEW]\s)?([A-Za-z]+\s){1,}[A-Za-z]{2,4}, Flint, MI')
	);
	
	// retrieve all tests more recent than the retrieved data from Ann Arbor's DB
	$residential_data = $connection->$db->proc_parcel_resi;
	$cursor = $residential_data->find($address_filter)->sort(array('Date Submitted' => 1));
	
	if ($cursor->count() > 0) {
		while ($cursor->hasNext()) {
			$new_data[] = $cursor->getNext();			
			$i = count($new_data)-1;
			
			$address = explode(", ", $new_data[$i]["goog_address"]);
			$new_data[$i]["new_address"] = $address[0];
		}
	}
	else
		exit();
}

/* Update the Cloud SQL database. */
function updateSQLDB() {
	global $mysqli, $new_data;
	
	$stmt = $mysqli->prepare("INSERT INTO WaterCondition (latitude, longitude, parcelID, address, leadLevel, copperLevel, dateUpdated, testID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
	
	// insert each new test result into the DB
	foreach ($new_data as $key => $test_result) {		
		$stmt->bind_param("ssssssss", $test_result["lat"], $test_result["lng"], $test_result["PID no Dash"], $test_result["new_address"], $test_result["Lead (ppb)"], $test_result["Copper (ppb)"], date("Y-m-d h:i:s", $test_result["Date Submitted"]->sec), $test_result["sample_num"]);
		$stmt->execute();
	}
	
	$stmt->close();
	
	// fix abandonment status (sometimes necessary)
	$abandoned_query = "UPDATE `Geolocation` g JOIN `WaterCondition` w ON g.parcelID = w.parcelID SET g.abandoned = 'N';";
	$result = $mysqli->query($abandoned_query);
}