<?php

/*
 * Update the database, fusion tables, predictions report CSV, and lead area JSON if new water tests are found.
 */
@define("__ROOT__", dirname(dirname(__FILE__)));
require_once __ROOT__ . "/includes/database_config.php";
require_once __ROOT__ . "/vendor/autoload.php";

/* MongoDB connection info. */
/*$port = "27017";
$db = getenv('MONGODB_DATABASE');
$connection = new MongoClient("mongodb://" . getenv('MONGODB_USER') . ":" . getenv('MONGODB_PASSWORD') . "@" . getenv('MONGODB_IP') . ":" . $port . "/" .  $db);

$api_key = getenv('API_KEY');
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

//getNewTestData();

/* Retrieve new water test results from Ann Arbor's DB */
function getNewTestData() {
	global $mysqli, $db, $connection;
	
	// get the date of the most recent test from Cloud SQL
	$query = "SELECT dateUpdated FROM watercondition ORDER BY dateUpdated DESC LIMIT 1;";
	
	$result = $mysqli->query($query);
	$row = $result->fetch_assoc();
	
	// convert a standard MySQL date into an ISODate
	$isoDate = new DateTime($row["dateUpdated"]);
	
	var_dump();
	
	$residential_filter = array(
		'google_add' => array('$regex'=> '^[G]*[-]*[0-9]+[A-Za-z\s]+, Flint, MI'),
		'Date Submitted' => array('$gt' => $isoDate->format(DateTime::ATOM))
	);
	
	/*{
	  Date Submitted: {$gt: "2016-10-13T08:56:39-04:00"}
	}*/
	
	// retrieve all tests more recent than the retrieved data from Ann Arbor's DB
	$residential_data = $connection->$db->proc_parcel_resi;
	$cursor = $residential_data->find($residential_filter)->sort(array('lat' => 1, 'lng' => 1));
	
	while ($cursor->hasNext()) {
		$array = $cursor->getNext();
		
		var_dump($array);
	}
}

/* Update the Cloud SQL database. */
function updateLocalDB() {
	
}

/* Update the most recent tests fusion table. */
function updateFTRecent() {
	
}

/* Update the all tests fusion table. */
function updateFTAll() {
	$result = $service->query->sql("SELECT * FROM " . $fusion_table_all . " LIMIT 10");

	var_dump($result);
}

?>