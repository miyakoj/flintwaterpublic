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

/*$api_key = getenv('API_KEY');
$scopes = array(
        'https://www.googleapis.com/auth/fusiontables',
        'https://www.googleapis.com/auth/fusiontables.readonly',
        );
//$fusion_table_all = "17nXjYNo-XHrHiJm9oohgxBSyIXsYeXqlnVHnVrrX";
//$fusion_table_recent = "11sVcd8gCuqrM3H3UFViwXthNir3bUFc0BDwSJgoy";
$fusion_table_test = "1hzW6T-v5Ak3KsAPrtXWfblTYd6tr4tt_FUxGCCiL";

$client = new Google_Client();
//$client->setHttpClient(new GuzzleHttp\Client(['verify' => '../vendor/ca-bundle.crt']));
$client->setHttpClient(new GuzzleHttp\Client(['verify' => false]));
$client->setApplicationName("h2o-flint");
$client->setDeveloperKey($api_key);
$client->useApplicationDefaultCredentials();
$client->addScope($scopes);

$redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
$client->setRedirectUri($redirect_uri);

/* Call the Fusion Table service. */
//$service = new Google_Service_Fusiontables($client);

getNewTestData();
updateLocalDB();

/* Retrieve new water test results from Ann Arbor's DB */
function getNewTestData() {
	global $mysqli, $db, $connection, $new_data;
	
	// get the date of the most recent test from Cloud SQL
	$query = "SELECT dateUpdated FROM WaterCondition ORDER BY dateUpdated DESC LIMIT 1;";
	$result = $mysqli->query($query);
	$row = $result->fetch_assoc();
	
	// convert a standard MySQL date into a MongoDB date
	$iso_date = new MongoDate(strtotime($row["dateUpdated"]));
	
	//2016-10-13 08:56:39
	
	// only retrieve Flint, MI addresses newer than the newest test in the SQL database
	$residential_filter = array(
		'google_add' => array('$regex'=> '^[G]*[-]*[0-9]+[A-Za-z\s]+, Flint, MI'),
		'Date Submitted' => array('$gt' => $iso_date)
	);
	
	// retrieve all tests more recent than the retrieved data from Ann Arbor's DB
	$residential_data = $connection->$db->proc_parcel_resi;
	$cursor = $residential_data->find($residential_filter)->sort(array('lat' => 1, 'lng' => 1))->limit(1);
	
	while ($cursor->hasNext()) {
		$array = $cursor->getNext();		
		$new_data[] = $array;
	}
}

/* Update the Cloud SQL database. */
function updateLocalDB() {
	global $mysqli, $new_data;
	
	$stmt = $mysqli->prepare("INSERT INTO WaterCondition (latitude, longitude, parcelID, address, leadLevel, copperLevel, dateUpdated, testID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
	
	foreach ($new_data as $test_result) {
		// insert each new test result into the DB
		//$stmt->bind_param("", );
		//$stmt->execute();
		
		var_dump($test_result);
		
		$address = explode(", ", $test_result["goog_address"]);
		
		// check abandoned status, change from Y or U to N if necessary
		$abandoned_query = sprintf("SELECT abandoned FROM GeoLocation WHERE address = '%s';", $address[0]);
		
		if (strcmp($test_result["USPS Vacancy"], "N") !== 0) {
			$abandoned = "N";
			$update_abandoned_query = sprintf("UPDATE GeoLocation SET abandoned = '%s' WHERE address = '%s';", $abandoned, $address[0]);
		}
	}	
}

function prepared_statements($choice, $array = null) {
	global $mysqli, $stmt;
	
	/* Updates from Ann Arbor's DB statements. */
	if (strcmp($choice, "new_tests") === 0) {
		$stmt = "INSERT INTO WaterCondition (latitude, longitude, parcelID, address, leadLevel, copperLevel, dateUpdated, testID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
	}
	else if (strcmp($choice, "abandoned_update") === 0) {
		$stmt = "";
	}
	
	$stmt->prepare();
}

/* Update the most recent tests fusion table. */
function updateFTRecent() {
	global $new_data;
}

/* Update the all tests fusion table. */
function updateFTAll() {
	global $new_data;
	
	$result = $service->query->sql("SELECT * FROM " . $fusion_table_all . " LIMIT 10");

	var_dump($result);
}