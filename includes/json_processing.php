<?php

require_once "queries.php";

/* Process lead level data. */
//json_output(queries("lead"), "leadLevels", "leadlevels.json");
//json_output(queries("providers"), "providers", "providers.json");

// array processing for providers
$result = queries("providers");

$providers = array();

while ($row = $result->fetch_assoc())
	$providers[] = $row;

$providers = unique_multidim_array($providers, "aidAddress");

foreach ($providers as $key => $value) {
	$result = queries("providers", $value["aidAddress"]);
	
	$resources = array();
	
	while ($row = $result->fetch_assoc())
		$resources[] = $row["resType"];
	
	$providers[$key]["resType"] = $resources;
}

print_r($providers);

/* From: https://php.net/manual/en/function.array-unique.php#116302 */
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

function json_output($result, $array_name, $filename) {
	$output = "{ \"" . $array_name . "\": [\n";

	for ($i=0; $i<$result->num_rows; $i++) {
		$row = $result->fetch_assoc();
		$output .= json_encode($row, JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT);
		
		if ($i < $result->num_rows-1)
			$output .= ",";
			
		$output .= "\n";
	}

	$output .= "]}";

	$fp = fopen("gs://flint-water-project.appspot.com/".$filename, 'w');
	fwrite($fp, $output);
	fclose($fp);
}

