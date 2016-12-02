<?php

/*
 * Update the database, fusion tables, predictions report CSV, and lead area JSON if new water tests are found.
 */
@define("__ROOT__", dirname(dirname(__FILE__)));
require __ROOT__ . "/includes/database_config.php";
include_once __ROOT__ . "/vendor/autoload.php";

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
updatePredictionsReport();

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

/* Update the CSV used to display the results of the admin predictions report. */
function updatePredictionsReport() {
	global $mysqli;
	
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
			$json_output .= json_encode(array($row["parcelID"], $row["address"], $row["prediction"], $row2["avgLeadLevel"]), JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT);
		}
		else {
			$csv_output .= sprintf("%s,%s,%s,-1\n", $row["parcelID"], $row["address"], $row["prediction"]);
			$json_output .= json_encode(array($row["parcelID"], $row["address"], $row["prediction"], -1), JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT);
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
}

?>