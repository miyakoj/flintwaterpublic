<?php

require_once "queries.php";

$reportId = mt_rand(0,9999999999);
$paddedId = sprintf("%010d", $reportId);	// Pad the number with zeros.

if ($_POST["type"] == "resource") {
    $result = queries("inaccuracy", "" , $paddedId);
    var_dump($result);
}
else if ($_POST["type"] == "report") {
	var_dump($_POST);
    //$result = queries("report", "" , $paddedId);
    //var_dump($result);
}

?>