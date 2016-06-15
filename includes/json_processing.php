<?php

require_once "queries.php";

/* Process lead level data. */
//json_output(queries("lead"), "leadLevels", "leadlevels.json");
json_output(queries("providers"), "providers", "providers.json");

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

