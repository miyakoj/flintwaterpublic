<?php

if (strstr($_SERVER["PHP_SELF"], "/admin/") !== FALSE)
	@define("__ROOT__", dirname(dirname(dirname(__FILE__))));
else
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

/* Handles edit page queries. */
if (@isset($_POST["resource_form_type"])) {
	// get resource location info
	if (strcmp($_POST["resource_form_type"], "edit_resource_load") === 0) {
		$result = queries("edit_resource_load", $_POST["location"]);
		$row = $result->fetch_assoc();
			
		/* Generate an array out of the resource type. */
		$row["resType"] = explode(",", $row["resType"]);
			
		$output = "{ \"location\": [";
		$output .= json_encode($row, JSON_NUMERIC_CHECK);		
		$output .= "]}";
		
		echo $output;
	}
	// submit resource info updates
	else if (strcmp($_POST["resource_form_type"], "edit_resource_submit") === 0) {		
		$result = queries("edit_resource_submit", $_POST["address"], $_POST);
		echo $result;
	}
	else if (strcmp($_POST["resource_form_type"], "new") === 0) {
		//$result = queries("new_resource");
	}
	else if (strcmp($_POST["resource_form_type"], "delete") === 0) {
		$result = queries("delete_resource", $_POST["location"]);		
		echo $result;
	}
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

/* Returns a list of all available resource locations. */
function getResourceLocations() {
	$result = queries("resource_locations");
	
	$resourceList = "<option value=''></option>\n";
	
	while ($row = $result->fetch_assoc())
		$resourceList .= "<option value='" . $row["aidAddress"] . "'>" . $row["aidAddress"] . "</option>\n";
	
	return $resourceList;
}