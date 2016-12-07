<?php

@define("__ROOT__", dirname(dirname(__FILE__)));

require_once __ROOT__ . "/includes/queries.php";

/* Process provider data. */
provider_processing();

/* Array processing for providers. */
function provider_processing() {
	global $mysqli;
	
	$result = queries("providers");

	$providers = array();

	while ($row = $result->fetch_assoc())
		$providers[] = $row;
	
	/* Generate an array out of the resource type. */
	foreach ($providers as $key => $value)
		$providers[$key]["resType"] = explode(",", $providers[$key]["resType"]);

	json_output($providers, "providers", "providers.json");
}

/* Output JSON for data that has been processed after it was retrieved from the database. */
function json_output($array, $array_name, $filename) {
	$output = "{ \"" . $array_name . "\": [\n";
	
	for ($i=0; $i<count($array); $i++) {		
		$output .= json_encode($array[$i], JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT);
		
		if ($i < count($array)-1)
			$output .= ",";
		
		$output .= "\n";
	}
	
	$output .= "]}";
	
	//print_r($output);
	
	write_file($output, $filename);
}

/* Save the JSON file to the bucket in Google Cloud. */
function write_file($output, $filename) {
	$options = ['gs' => ['Content-Type' => 'application/json', 'read_cache_expiry_seconds' => '86400']];
	$context = stream_context_create($options);
	file_put_contents("gs://h2o-flint.appspot.com/".$filename, $output, 0, $context);
}