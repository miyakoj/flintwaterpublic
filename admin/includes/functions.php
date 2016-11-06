<?php

if (strstr($_SERVER["PHP_SELF"], "/admin/") !== FALSE)
	@define("__ROOT__", dirname(dirname(dirname(__FILE__))));
else
	@define("__ROOT__", dirname(dirname(__FILE__)));

require_once __ROOT__ . "/admin/includes/queries.php";
require_once __ROOT__ . "/vendor/autoload.php";
use google\appengine\api\mail\Message;

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
if (@isset($_POST["type"])) {
	// load all resource locations
	if (strcmp($_POST["type"], "load_resource_locations") === 0)
		echo getResourceLocations();
	
	// get resource location info
	if (strcmp($_POST["type"], "edit_resource_load") === 0) {
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
	else if (strcmp($_POST["type"], "edit_resource_submit") === 0) {
		$result = queries("edit_resource_submit", "", $_POST);

		echo $result;
	}
	else if (strcmp($_POST["type"], "new_resource") === 0) {
		$result = queries("new_resource", "", $_POST);
		
		echo $result;
	}
	else if (strcmp($_POST["type"], "delete_resource") === 0) {
		$result = queries("delete_resource", $_POST["location"]);

		echo $result;
	}
	else if ($_POST["type"] == "contact_form") {	
		email_user();
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
	else if (strcmp($type, "total_approved_repairs") === 0) {
		$row = $result->fetch_assoc();
		$array[] = $row["totalApprovedRepairs"];
		$array[] = 38;
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

/* Email some info to a user. */
function email_user() {
	if ($_POST["type"] == "contact_form") {
		$to = "umflinth2o@gmail.com";
		$from = "umflinth2o@gmail.com";
		$subject = "A Comment About MyWater-Flint (Admin Site)";
		
		$msg = sprintf("<p><strong>Email:</strong><br /> %s</p>
						<p><strong>Comments:</strong><br /> %s</p>", htmlspecialchars($_POST["email"]), htmlspecialchars($_POST["comments"]));
	}
	
	try {
		$message = new Message();
		$message->setSender($from);
		$message->addTo($to);
		$message->setSubject($subject);
		$message->setHtmlBody($msg);
		$message->send();
		
		echo 1;
	} catch (InvalidArgumentException $e) {
		echo $e;
	}
}