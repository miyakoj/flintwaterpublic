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
$connection = new MongoClient("mongodb://" . getenv('MONGODB_USER') . ":" . getenv('MONGODB_PASSWORD') . "@" . getenv('MONGODB_IP') . ":" . $port . "/" .  $db);

$new_data = array();

$scopes = array(
			'https://www.googleapis.com/auth/fusiontables'/*,
			'https://www.googleapis.com/auth/fusiontables.readonly'*/
		);

/* The fusion tables used are publically accessible. */
$fusion_table_all = "17nXjYNo-XHrHiJm9oohgxBSyIXsYeXqlnVHnVrrX";
$fusion_table_recent = "11sVcd8gCuqrM3H3UFViwXthNir3bUFc0BDwSJgoy";
$fusion_table_test = "1hzW6T-v5Ak3KsAPrtXWfblTYd6tr4tt_FUxGCCiL";

$client = new Google_Client();
//$client->setHttpClient(new GuzzleHttp\Client(['verify' => '../vendor/ca-bundle.crt']));
$client->setHttpClient(new GuzzleHttp\Client(['verify' => false]));
$client->setApplicationName();
$client->setDeveloperKey(getenv('API_KEY'));
$client->useApplicationDefaultCredentials(getenv('APP_ID'));
$client->addScope($scopes);

$redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
$client->setRedirectUri($redirect_uri);

/* Get a reference to the Fusion Table service. */
$service = new Google_Service_Fusiontables($client);

getNewTestData();
//updateSQLDB();
updateFTRecent();
//updateFTAll();

/* Retrieve new water test results from Ann Arbor's DB */
function getNewTestData() {
	global $mysqli, $db, $connection, $new_data;
	
	// get the date of the most recent test from Cloud SQL
	$query = "SELECT dateUpdated FROM WaterCondition ORDER BY dateUpdated DESC LIMIT 1;";
	$result = $mysqli->query($query);
	$row = $result->fetch_assoc();
	
	// convert a standard MySQL date into a MongoDB ISO date
	$iso_date = new MongoDate(strtotime($row["dateUpdated"]));
	
	//2016-10-13 08:56:39
	
	// only retrieve Flint, MI addresses newer than the newest test in the SQL database
	$residential_filter = array(
		'google_add' => array('$regex'=> '^[G]*[-]*[0-9]+[A-Za-z\s]+, Flint, MI'),
		'Date Submitted' => array('$gt' => $iso_date)
	);
	
	// retrieve all tests more recent than the retrieved data from Ann Arbor's DB
	$residential_data = $connection->$db->proc_parcel_resi;
	$cursor = $residential_data->find($residential_filter)->sort(array('Date Submitted' => -1))->limit(1);
	
	while ($cursor->hasNext()) {
		$array = $cursor->getNext();		
		$new_data[] = $array;
	}
}

/* Update the Cloud SQL database. */
function updateSQLDB() {
	global $mysqli, $new_data;
	
	$stmt = $mysqli->prepare("INSERT INTO WaterCondition (latitude, longitude, parcelID, address, leadLevel, copperLevel, dateUpdated, testID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
	
	// insert each new test result into the DB
	foreach ($new_data as $key => $test_result) {
		$address = explode(", ", $test_result["goog_address"]);
		
		$stmt->bind_param("ssssssss", $test_result["lat"], $test_result["lng"], $test_result["PID no Dash"], $address[0], $test_result["Lead (ppb)"], $test_result["Copper (ppb)"], date("Y-m-d h:i:s", $test_result["Date Submitted"]->sec), $test_result["sample_num"]);
		$stmt->execute();
		
		// check abandoned status, change from Y or U to N if necessary
		$abandoned_query = sprintf("SELECT abandoned FROM GeoLocation WHERE address = '%s';", $address[0]);
		$result = $mysqli->query($abandoned_query);
		$row = $result->fetch_assoc();
		
		if (strcmp($row["USPS Vacancy"], "N") !== 0) {
			$abandoned = "N";
			$new_data[$key]["USPS Vacancy"] = $abandoned;
			$update_abandoned_query = sprintf("UPDATE GeoLocation SET abandoned = '%s' WHERE address = '%s';", $abandoned, $address[0]);
			$mysqli->query($update_abandoned_query);
		}
	}
	
	$stmt->close();
}

/* Update the most recent tests fusion table. */
function updateFTRecent() {
	global $client, $new_data;
	
	foreach ($new_data as $test_result) {
		// update the existing row's abandoned status, lead, copper, and test date values
		$query = sprintf("UPDATE %s SET abandoned = '%s', leadLevel = '%s', copperLevel = '%s', testDate = '%s' WHERE address = '%s';", $fusion_table_test, $test_result["abandoned"], $test_result["Lead (ppb)"], $test_result["Copper (ppb)"], date("Y-m-d h:i:s", $test_result["Date Submitted"]->sec), $address[0]);
		echo $query;
		//$result = $service->query->sql($query);
	}
}

/* 
 * Generates KML for a specific location marker. NOT USED
 * Original code created in Java by Philip Boyd (https://github.com/phboyd).
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

/* Update the all tests fusion table. */
function updateFTAll() {
	global $client, $new_data;
	
	//$fusion_table_test
	
	$result = $service->query->sql("SELECT * FROM " . $fusion_table_all . " LIMIT 10");

	var_dump($result);
}