<?php

@define("__ROOT__", dirname(dirname(__FILE__)));
include __ROOT__ . "/admin/includes/queries.php";

/* Handles report page queries. */
if (@isset($_POST["report_type"])) {
	$i = 0;
	$result = queries($_POST["report_type"]);
	
	$output = "{ \"" . $_POST["report_type"] . "\": [\n";
	
	while ($row = $result->fetch_assoc()) {		
		$output .= json_encode($row, JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT);
		
		if ($i < $result->num_rows-1)
			$output .= ",";
		
		$output .= "\n";
		
		$i++;
	}
	
	$output .= "]}";
	
	print_r($output);
}

/* Start a secure PHP session.
 *  From: http://www.wikihow.com/Create-a-Secure-Login-Script-in-PHP-and-MySQL
 */
function sec_session_start() {
    $session_name = 'sec_session_id';   // Set a custom session name
    /*Sets the session name. 
     *This must come before session_set_cookie_params due to an undocumented bug/feature in PHP. 
     */
    session_name($session_name);
 
    $secure = true;
    // This stops JavaScript being able to access the session id.
    $httponly = true;
    // Forces sessions to only use cookies.
    if (ini_set('session.use_only_cookies', 1) === FALSE)
        exit();
	
    // Gets current cookies params.
    $cookieParams = session_get_cookie_params();
    session_set_cookie_params($cookieParams["lifetime"],
        $cookieParams["path"], 
        $cookieParams["domain"], 
        $secure,
        $httponly
	);
 
    session_start();            // Start the PHP session 
    session_regenerate_id(true);    // regenerated the session, delete the old one. 
}

/* Returns a JavaScript array as a string used to generate a chart. */
function generateChartData($type) {
	$result = queries($type);
	$array = array();
	
	if (strcmp($type, "test_data") === 0) {
		$avgLeadLevels = array();
		$avgCopperLevels = array();
		$totalTests = array();
		
		while ($row = $result->fetch_assoc()) {
			$avgLeadLevels[] = $row["avgLeadLevel"];
			$avgCopperLevels[] = $row["avgCopperLevel"];
			$totalTests[] = $row["totalTests"];
		}
		
		$avgLeadLevels = implode("', '", $avgLeadLevels);
		$avgLeadLevels = "['" . $avgLeadLevels . "']";
		
		$avgCopperLevels = implode("', '", $avgCopperLevels);
		$avgCopperLevels = "['" . $avgCopperLevels . "']";
		
		$array[] = $avgLeadLevels;
		$array[] = $avgCopperLevels;
		$array[] = $totalTests;
	}
	else if (strcmp($type, "total_locations") === 0) {
		$row = $result->fetch_assoc();
		$array[] = $row["totalLocationsTested"];
	}
	
	return $array;
}

/* Returns two JavaScript arrays as strings used to generate a chart. */
function arrayAccumulation($array) {
	$newArray = array();
	$accumulationArray = array();
	$total = 0;
	
	foreach ($array as $val) {
		$total += (int)$val;
		$accumulationArray[] = $total;
	}
	
	$array = implode("', '", $array);
	$array = "['" . $array . "']";
	
	$accumulationArray = implode("', '", $accumulationArray);
	$accumulationArray = "['" . $accumulationArray . "']";
	
	$newArray[] = $array;
	$newArray[] = $accumulationArray;
	
	return $newArray;
}

/* Returns the time period of available test data. */
function getTimePeriod() {
	$result = queries("time_period");
	
	$timePeriod = array();
	
	while ($row = $result->fetch_assoc()) {
		if ($row["month"] == 1)
			$month = "January";
		else if ($row["month"] == 2)
			$month = "February";
		else if ($row["month"] == 3)
			$month = "March";
		else if ($row["month"] == 4)
			$month = "April";
		else if ($row["month"] == 5)
			$month = "May";
		else if ($row["month"] == 6)
			$month = "June";
		else if ($row["month"] == 7)
			$month = "July";
		else if ($row["month"] == 8)
			$month = "August";
		else if ($row["month"] == 9)
			$month = "September";
		else if ($row["month"] == 10)
			$month = "October";
		else if ($row["month"] == 11)
			$month = "November";
		else if ($row["month"] == 12)
			$month = "December";
		
		$timePeriod[] = $month . " " . $row["year"];
	}
	
	return $timePeriod;
}