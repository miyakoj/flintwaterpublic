<?php

/*
 * Update the fusion tables if new water tests are found.
 */

include_once "vendor/autoload.php";

$api_key = getenv('API_KEY');
$scopes = array(
        'https://www.googleapis.com/auth/fusiontables',
        'https://www.googleapis.com/auth/fusiontables.readonly',
        );
$fusion_table_all = "17nXjYNo-XHrHiJm9oohgxBSyIXsYeXqlnVHnVrrX";
$fusion_table_recent = "11sVcd8gCuqrM3H3UFViwXthNir3bUFc0BDwSJgoy";
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
$service = new Google_Service_Fusiontables($client);

$result = $service->query->sql("SELECT * FROM " . $fusion_table_all . " LIMIT 10");

var_dump($result);

?>