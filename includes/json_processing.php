<?php

require_once "queries.php";

use google\appengine\api\cloud_storage\CloudStorageTools;

$type = $_GET['type'];
$result = queries($type);

$bucket = CloudStorageTools::getDefaultGoogleStorageBucketName();
$root_path = "gs://" . $bucket . "/";

if (strcmp($type, "lead") === 0) {
	$array_name = "leadLevels";
	$filename = "leadlevels.json";
}
	
$output = "{ \"" . $array_name . "\" : [";

while ($row = $result->fetch_assoc()) {
	$output .= json_encode($row);
}

$output .= " ]}";

file_put_contents($root_path.$filename, $output);