<?php

require_once "queries.php";
use google\appengine\api\cloud_storage\CloudStorageTools;

$type = $_POST['type'];
$result = queries($type);

if (strcmp($type, "lead") === 0) {
	$array_name = "leadLevels";
	$filename = "leadlevels.json";
}
else if (strcmp($type, "providers") === 0) {
	$array_name = "providers";
	$filename = "providers.json";
}
	
$output = "{ \"" . $array_name . "\": [\n";

for ($i=0; $i<$result->num_rows; $i++) {
	$row = $result->fetch_assoc();
	$output .= json_encode($row, JSON_NUMERIC_CHECK);
	
	if ($i < $result->num_rows-1)
		$output .= ",";
		
	$output .= "\n";
}

$output .= "]}";

$default_bucket = CloudStorageTools::getDefaultGoogleStorageBucketName();
$fp = fopen("gs://${default_bucket}/".$filename, 'w');
fwrite($fp, $output);
fclose($fp);

