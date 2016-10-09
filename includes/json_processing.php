<?php

require_once "queries.php";

/* Process lead level data. */
//query_json_output(queries("leadLevels"), "leadLevels", "leadlevels.json");

/* Process provider data. */
//provider_processing();

/* Array processing for providers. */
function provider_processing() {
	global $mysqli;
	
	$result = queries("providers");

	$providers = array();

	while ($row = $result->fetch_assoc())
		$providers[] = $row;

	// remove duplicate providers
	$providers = unique_multidim_array($providers, "aidAddress");
	
	// reindex the array to fix the missing indices problem
	$providers = array_values($providers);

	/* Get all available resources for each provider address. */
	foreach ($providers as $key => $value) {
		$result = queries("providers", $value["aidAddress"]);
		
		$resources = array();
		
		while ($row = $result->fetch_assoc()) {
			$resources[] = $row["resType"];
		}
		
		$providers[$key]["resType"] = $resources;
	}
	
	$mysqli->close();

	json_output($providers, "providers", "providers.json");
}

/* Remove duplicate provider addresses from the array.
From: https://php.net/manual/en/function.array-unique.php#116302 */
function unique_multidim_array($array, $key) {
    $temp_array = array();
    $i = 0;
    $key_array = array();
   
    foreach($array as $val) {
        if (!in_array($val[$key], $key_array)) {
            $key_array[$i] = $val[$key];
            $temp_array[$i] = $val;
        }
        $i++;
    }
    return $temp_array;
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

/* Output JSON for data that was retrieved directly from the database. */
function query_json_output($result, $array_name, $filename) {
	global $mysqli;
	
	$output = "{ \"" . $array_name . "\": [\n";

	for ($i=0; $i<$result->num_rows; $i++) {
		$row = $result->fetch_assoc();
		$output .= json_encode($row, JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT);
		
		if ($i < $result->num_rows-1)
			$output .= ",";
			
		$output .= "\n";
	}

	$output .= "]}";
	
	$mysqli->close();
	
	/*$filename = tempnam(sys_get_temp_dir(), $array_name) . ".gz";
	$zp = gzopen($filename, "w9");
	gzwrite($zp, $output);
	gzclose($zp);*/
	
	//print_r($output);

	//write_file($output, $zp);
	write_file($output, $filename);
}

/* Save the JSON file to the bucket in Google Cloud. */
function write_file($output, $filename) {
	$options = ['gs' => ['Content-Type' => 'application/json', 'read_cache_expiry_seconds' => '86400']];
	$context = stream_context_create($options);
	file_put_contents("gs://h2o-flint.appspot.com/".$filename, $output, 0, $context);
}

