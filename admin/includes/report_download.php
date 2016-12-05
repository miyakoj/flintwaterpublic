<?php

if (strstr($_SERVER["PHP_SELF"], "/admin/") !== FALSE)
	@define("__ROOT__", dirname(dirname(dirname(__FILE__))));
else
	@define("__ROOT__", dirname(dirname(__FILE__)));

require_once __ROOT__ . "/vendor/autoload.php";

$memcache = new Memcache;
$csv_output = $memcache->get($_POST["uid"]);
	
$filename = $_POST["report_type"] . ".csv";

header('Content-Description: File Transfer');
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Length: ' . strlen($csv_output));
header('Cache-Control: max-age=0');
echo $csv_output;