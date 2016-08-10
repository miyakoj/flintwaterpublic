<?php

require_once "queries.php";

header("Location: /index.php");
$reportId = mt_rand(0,9999999999);
$paddedId = sprintf("%010d", $reportId);	// Pad the number with zeros.
$result = queries("report","" ,$paddedId);
var_dump($result);

?>