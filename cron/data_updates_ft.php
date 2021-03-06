<?php

/*
 * Update the database and fusion tables if new water tests are found.
 */
@define("__ROOT__", dirname(dirname(__FILE__)));
require_once __ROOT__ . "/includes/database_config.php";
require_once __ROOT__ . "/vendor/autoload.php";

/* MongoDB connection info. */
$port = "27017";
$db = getenv('MONGODB_DATABASE');
//$connection = new MongoClient("mongodb://" . getenv('MONGODB_USER') . ":" . getenv('MONGODB_PASSWORD') . "@" . getenv('MONGODB_IP') . ":" . $port . "/" .  $db);
$connection = new MongoClient("mongodb://" . getenv('MONGODB_USER') . ":" . getenv('MONGODB_PASSWORD') . "@" . getenv('MONGODB_IP') . "/" .  $db);

// the data retrieved from the MongoDB db
$new_data = array();

/* The fusion tables used are publically accessible. */
$fusion_table_all = "17nXjYNo-XHrHiJm9oohgxBSyIXsYeXqlnVHnVrrX";
$fusion_table_recent = "1Kxo2QvMVHbNFPJQ9c9L3wbKrWQJPkbr_Gy90E2MZ";
//$fusion_table_test = "1j0C_amm3F6Tz0AEi47Poduus8ecoT389JCcmCIVP";

$client = new Google_Client();
$client->setHttpClient(new GuzzleHttp\Client(['verify' => __ROOT__ . '/vendor/ca-bundle.crt', 'timeout' => 0]));
$client->setApplicationName('MyWater-Flint');
$client->setDeveloperKey(getenv('GOOGLE_SERVER_KEY'));
$client->useApplicationDefaultCredentials(getenv('APP_ID'));
$client->addScope(array('https://www.googleapis.com/auth/fusiontables'));

$redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
$client->setRedirectUri($redirect_uri);

/* Get a reference to the Fusion Table Service. */
//$service = new Google_Service_Fusiontables($client);

//updateFTRecent();
updateFTAll();

/* Retrieve new water test results from the remote DB */
function getNewTestData($table) {
	global $service, $mysqli, $db, $connection, $new_data;
	
	// get the date of the most recent test from the fusion table
	//$query = "SELECT testDate FROM " . $table . " ORDER BY testDate DESC LIMIT 1;";
	//$testDate = $service->query->sql($query)->rows[0][0];
	
	$query = "SELECT dateUpdated FROM WaterCondition ORDER BY dateUpdated DESC LIMIT 1";
	$result = $mysqli->query($query);
	$row = $result->fetch_assoc();
	$testDate = $row["dateUpdated"];
	$testDate = "2017-01-27 08:59:08";
	
	// convert a standard MySQL date into a MongoDB ISO date
	$most_recent_date = new MongoDate(strtotime($testDate)); // 2017-01-27 08:59:08
	
	// if the newest date in the "all" fusion table matches the date in the "recent" fusion table then don't query the MongoDB again
	/*if (@isset($most_recent_date) && $most_recent_date == $most_recent_table_date)
		return;
	else
		$most_recent_table_date = $most_recent_date;*/
	
	//echo "Newest Date: " . $testDate . "<br />";
	//echo "MongoDate: " . $most_recent_date->sec . "<br /><br />";
	
	/*{
		"Date Submitted": {"$gt": new Date("2016-10-13T08:56:34Z")}
	}*/
	
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
			
			/*echo "MongoID: " . $new_data[$i]["_id"] . "<br />";
			echo "Address: " . $new_data[$i]["goog_address"] . "<br />";
			echo "MongoDate: " . $new_data[$i]["Date Submitted"]->sec . "<br />";
			echo "Date: " . date("Y-m-d h:i:s", $new_data[$i]["Date Submitted"]->sec) . "<br /><br />";*/
		}
	}
	else
		exit();
}

/* Insert a new property into the SQL database if a test is found that has no corresponding prediction value. */
function insertNewPropertySQL($property) {
	global $mysqli;
	
	$geolocation_query = sprintf("INSERT INTO Geolocation (latitude, longitude, parcelID, address, abandoned) VALUES ('%s', '%s', '%s', '%s', '%s');", $property["lat"], $property["lng"], $property["PID no Dash"], $property["new_address"], $property["USPS Vacancy"]);
	$mysqli->query($geolocation_query);
	
	$prediction_query = sprintf("INSERT INTO PredictionLocations (latitude, longitude, prediction, parcelID) VALUES ('%s', '%s', '-1', '%s');", $property["lat"], $property["lng"], $property["PID no Dash"]);
	$mysqli->query($prediction_query);
}

/* Update the most recent data fusion table. */
function updateFTRecent() {
	global $service, $mysqli, $new_data, $fusion_table_recent;
	//$table_resource = $service->table->get($fusion_table_recent);
	
	getNewTestData($fusion_table_recent);
	
	//var_dump($new_data);
	
	foreach ($new_data as $test_result) {
		//$query = sprintf("SELECT ROWID FROM %s WHERE address = '%s';", $fusion_table_recent, $test_result["new_address"]);
		//$rowid = $service->query->sql($query)->rows[0][0];
		
		$query = sprintf("SELECT * FROM WaterCondition WHERE address = '%s';", $test_result["new_address"]);
		$result = $mysqli->query($query);
		$row_count = $result->num_rows;
		
		//echo $query . "<br />";
		//echo $rowid . "<br />";
		
		// update the most recent test date, lead value, and copper value in the row corresponding to the address
		//if (strcmp($rowid, "") !== 0) {
		if ($row_count > 0) {
			// update the existing row's abandoned status, lead, copper, and test date values
			//$query = sprintf("UPDATE %s SET abandoned = '%s', testDate = '%s', leadLevel = '%s', copperLevel = '%s' WHERE ROWID = '%s';", $fusion_table_recent, $test_result["USPS Vacancy"], date("Y-m-d h:i:s", $test_result["Date Submitted"]->sec), $test_result["Lead (ppb)"], $test_result["Copper (ppb)"], $rowid);
			
			//echo $query . "<br />";
		
			//$result = $service->query->sql($query);
			
			$kml = generateKML($test_result["lat"], $test_result["lng"]);
			
			$csv_data = sprintf("%s; %s; %s; %s; %s; -1; %s; %s; %s; %s\n", $test_result["lat"], $test_result["lng"], $test_result["new_address"], $test_result["USPS Vacancy"], $test_result["PID no Dash"], date("Y-m-d h:i:s", $test_result["Date Submitted"]->sec), $test_result["Lead (ppb)"], $test_result["Copper (ppb)"], $kml);
		}
		// if $rowid is null, the address doesn't exist in the fusion table so insert a new row and use -1 for the prediction
		else {			
			$kml = generateKML($test_result["lat"], $test_result["lng"]);
			
			$csv_data = sprintf("%s; %s; %s; %s; %s; -1; %s; %s; %s; %s\n", $test_result["lat"], $test_result["lng"], $test_result["new_address"], $test_result["USPS Vacancy"], $test_result["PID no Dash"], date("Y-m-d h:i:s", $test_result["Date Submitted"]->sec), $test_result["Lead (ppb)"], $test_result["Copper (ppb)"], $kml);
			
			//echo $csv_data . "<br /><br />";
			
			//$result = $service->table->importRows($fusion_table_recent, array('delimiter' => ';', 'postBody' => $table_resource, 'data' => $csv_data));
			
			// insert new rows into the SQL database
			//insertNewPropertySQL($test_result);
		}
		
		//file_put_contents("fusion_table_recent.csv", $csv_data, FILE_APPEND);
	}
}

/* Update the all data fusion table. */
function updateFTAll() {
	global $service, $mysqli, $new_data, $fusion_table_all, $fusion_table_test;
	//$table_resource = $service->table->get($fusion_table_all);
	
	getNewTestData($fusion_table_all);
	
	//echo "<br />";
	
	foreach ($new_data as $test_result) {
		// check to see if the row has already been entered due to a previous transaction that was interrupted due to Guzzle timeout
		//$query = sprintf("SELECT ROWID FROM %s WHERE address = '%s' AND testDate = '%s';", $fusion_table_all, $test_result["new_address"], date("Y-m-d h:i:s", $test_result["Date Submitted"]->sec));
		//$rowid = $service->query->sql($query)->rows[0][0];
		
		//if (strcmp($rowid, "") === 0) {
			//$query = sprintf("SELECT prediction FROM %s WHERE address = '%s';", $fusion_table_all, $test_result["new_address"]);
			//$prediction = $service->query->sql($query)->rows[0][0];
			
			$query = sprintf("SELECT prediction, w.parcelID, p.parcelID FROM WaterCondition w JOIN PredictionLocations p ON w.parcelID = p.parcelID WHERE address = '%s' LIMIT 1;", $test_result["new_address"]);
			$result = $mysqli->query($query);
			$row = $result->fetch_assoc();
			$prediction = $row["prediction"];
			
			// insert the new test result into the fusion table		
			$csv_data = sprintf("%s, %s, %s, %s, %s, %s, %s, %s, %s\n", $test_result["lat"], $test_result["lng"], $test_result["new_address"], $test_result["USPS Vacancy"], $test_result["PID no Dash"], $prediction, date("Y-m-d h:i:s", $test_result["Date Submitted"]->sec), $test_result["Lead (ppb)"], $test_result["Copper (ppb)"]);
			
			//echo $csv_data . "<br />";

			//$result = $service->table->importRows($fusion_table_all, array('postBody' => $table_resource, 'data' => $csv_data, 'isStrict' => false));
		//}
		
		file_put_contents("fusion_table_all.csv", $csv_data, FILE_APPEND);
	}
}

/* 
 * Generates a KML polygon location marker for a specific latitude/longitude coordinate to be used in the "most recent data" fusion table.
 * Original code created in Java by Philip Boyd (https://www.github.com/phboyd).
 */
function generateKML($lat, $lng) {
	$size = 0.00003;
	$half = 0.5 * $size;
	$sqrtThreeDiv2  = 0.86602540378 * $size;
	
	$point1Lat = $lat + $size;
	$point1Lng = $lng;
	$point2Lat = $lat + $sqrtThreeDiv2;
	$point2Lng = $lng + $half;
	$point3Lat = $lat + $half;
	$point3Lng = $lng + $sqrtThreeDiv2;
	$point4Lat = $lat;
	$point4Lng = $lng + $size;
	$point5Lat = $lat - $half;
	$point5Lng = $lng + $sqrtThreeDiv2;
	$point6Lat = $lat - $sqrtThreeDiv2;
	$point6Lng = $lng + $half;
	$point7Lat = $lat - $size;
	$point7Lng = $lng;
	$point8Lat = $lat - $sqrtThreeDiv2;
	$point8Lng = $lng - $half;
	$point9Lat = $lat - $half;
	$point9Lng = $lng - $sqrtThreeDiv2;
	$point10Lat = $lat;
	$point10Lng = $lng - $size;
	$point11Lat = $lat + $half;
	$point11Lng = $lng - $sqrtThreeDiv2;
	$point12Lat = $lat + $sqrtThreeDiv2;
	$point12Lng = $lng - $half;
	
	$kml = "<Polygon><outerBoundaryIs><LinearRing>" .
	"<coordinates>" .
		$point1Lng . "," . $point1Lat . ",0.0 " .
		$point12Lng . "," . $point12Lat . ",0.0 " .
		$point11Lng . "," . $point11Lat . ",0.0 " .
		$point10Lng . "," . $point10Lat . ",0.0 " .
		$point9Lng . "," . $point9Lat . ",0.0 " .
		$point8Lng . "," . $point8Lat . ",0.0 " .
		$point7Lng . "," . $point7Lat . ",0.0 " .
		$point6Lng . "," . $point6Lat . ",0.0 " .
		$point5Lng . "," . $point5Lat . ",0.0 " .
		$point4Lng . "," . $point4Lat . ",0.0 " .
		$point3Lng . "," . $point3Lat . ",0.0 " .
		$point2Lng . "," . $point2Lat . ",0.0 " .
		$point1Lng . "," . $point1Lat . ",0.0 " .
	"</coordinates></LinearRing></outerBoundaryIs>" .
	"</Polygon>";
	
	return $kml;
}