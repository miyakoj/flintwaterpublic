<?php

if (strstr($_SERVER["PHP_SELF"], "/admin/") !== FALSE)
	@define("__ROOT__", dirname(dirname(dirname(__FILE__))));
else
	@define("__ROOT__", dirname(dirname(__FILE__)));

require_once __ROOT__ . "/admin/includes/queries.php";
require_once __ROOT__ . "/vendor/autoload.php";

use GuzzleHttp\Psr7;
use GuzzleHttp\Exception\RequestException;
use google\appengine\api\mail\Message;

/* Handles report page queries. */
if (@isset($_POST["report_type"])) {
	if (strcmp($_POST["report_type"], "water_tests") === 0) {
		$options = array(
			"months" => $_POST["months"],
			"years" => $_POST["years"],
			//"aggregation" => $_POST["aggregation"],
			//"group_by" => $_POST["group_by"],
			"order_by" => $_POST["order_by"],
			"limit" => array(
				"lead_less" => $_POST["lead_less"],
				"lead_greater" => $_POST["lead_greater"],
				"copper_less" => $_POST["copper_less"],
				"copper_greater" => $_POST["copper_greater"]
			)
		);
		
		$result = queries($_POST["report_type"], "", $options);
		
		$csv_output = "address,leadLevel,copperLevel,dateUpdated\n";
	}
	else if (strcmp($_POST["report_type"], "contact_form_resp") === 0) {
		$result = queries($_POST["report_type"]);
		$csv_output = "type;email;comments;dateAdded\n";
	}
		
	$json_output = "{ \"" . $_POST["report_type"] . "\": [\n";
	
	$i = 0;
	
	while ($row = $result->fetch_assoc()) {
		if (strcmp($_POST["report_type"], "water_tests") === 0)
			$csv_output .= sprintf("%s,%s,%s,%s\n", $row["address"], $row["leadLevel"], $row["copperLevel"], $row["dateUpdated"]);
		else if (strcmp($_POST["report_type"], "contact_form_resp") === 0)
			$csv_output .= sprintf("%s;%s,%s;%s\n", $row["type"], $row["email"], $row["comments"], $row["dateAdded"]);
		
		$json_output .= json_encode($row, JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT);
		
		if ($i < $result->num_rows-1)
			$json_output .= ",";
		
		$json_output .= "\n";
		
		$i++;
	}
	
	$json_output .= "]}";
	
	$memcache = new Memcache;
	$memcache->set($_POST["uid"], $csv_output);
	
	print_r($json_output);
}


/* Handles AJAX requests. */	
if (@isset($_POST["type"])) {
	/* RESOURCES */
	// load all resource locations
	if (strcmp($_POST["type"], "load_resource_locations") === 0) {
		echo getResourceLocations();
	}
	// get resource location info
	else if (strcmp($_POST["type"], "edit_resource_load") === 0) {
		$result = queries($_POST["type"], $_POST["location"]);
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
		$result = queries($_POST["type"]);

		echo $result;
	}
	else if (strcmp($_POST["type"], "new_resource") === 0) {
		$result = queries($_POST["type"]);
		
		echo $result;
	}
	else if (strcmp($_POST["type"], "delete_resource") === 0) {
		$result = queries($_POST["type"], $_POST["location"]);

		echo $result;
	}
	
	/* ALERTS */
	// load all alert titles and ids
	else if (strcmp($_POST["type"], "load_alerts") === 0) {
		echo getAlerts();
	}
	// get alerts
	else if (strcmp($_POST["type"], "edit_alert_load") === 0) {
		$result = queries($_POST["type"], $_POST["id"]);
		$row = $result->fetch_assoc();
			
		$output = "{ \"alerts\": [";
		$output .= json_encode($row, JSON_NUMERIC_CHECK);		
		$output .= "]}";
		
		echo $output;
	}
	// submit alert updates
	else if (strcmp($_POST["type"], "edit_alert_submit") === 0) {
		$result = queries($_POST["type"]);

		echo $result;
		
		// update alerts JSON
		
		ob_start();
		sendFirebaseNotification();
		ob_end_clean();
	}
	else if (strcmp($_POST["type"], "new_alert") === 0) {
		$result = queries($_POST["type"]);
		
		echo $result;
		
		// update alerts JSON
		
		ob_start();
		sendFirebaseNotification();
		ob_end_clean();
	}
	else if (strcmp($_POST["type"], "delete_alert") === 0) {
		$result = queries($_POST["type"], $_POST["id"]);

		echo $result;
	}
	
	/* MISC */
	// the site admin contact form
	else if (strcmp($_POST["type"], "contact_form") === 0) {
		// insert contact form data into the database
		$result = queries($_POST["type"]);
		
		email_user();
	}
	// user page new user email
	else if (strcmp($_POST["type"], "new_user_email") === 0) {
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
	else if (strcmp($type, "total_locations_tested") === 0) {
		$row = $result->fetch_assoc();
		$array[] = $row["totalLocationsTested"];
	}
	else if (strcmp($type, "total_approved_repairs") === 0) {
		$row = $result->fetch_assoc();
		$array[] = $row["totalApprovedRepairs"];
		$array[] = 38;
	}
	else if ((strcmp($type, "total_parcels") === 0) || (strcmp($type, "abandoned_parcels") === 0) || (strcmp($type, "unknown_parcels") === 0)) {
		$row = $result->fetch_assoc();
		$array[] = $row["total_parcels"];
	}
	
	return $array;
}

/* Returns two JavaScript arrays as strings used to generate a chart. */
function arrayAccumulation($array) {
	$monthlyArray = array(); // monthly totals
	$accumulationArray = array(); // grand totals
	$total = 0;
	
	foreach ($array as $val) {
		$total += (int)$val;
		$accumulationArray[] = $total;
	}
	
	$array = implode("', '", $array);
	$array = "['" . $array . "']";
	
	$accumulationArray = implode("', '", $accumulationArray);
	$accumulationArray = "['" . $accumulationArray . "']";
	
	$monthlyArray[] = $array;
	$monthlyArray[] = $accumulationArray;
	
	return $monthlyArray;
}

/* Returns the text time period of available water test data. */
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

function createAlertsJSON() {
	$filename = "alerts.json";	
	$i = 0;
	
	$result = queries("get_alerts");
	
	$output = "{ \"alerts\": [\n";
	
	while ($row = $result->fetch_assoc()) {
		$output .= json_encode($row, JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
		
		if ($i < $result->num_rows-1)
			$output .= ",";
		
		$output .= "\n";
		
		$i++;
	}
	
	$output .= "]}";
	
	/* Write the file to the bucket. */
	$options = ['gs' => ['Content-Type' => 'application/json', 'read_cache_expiry_seconds' => '86400']];
	$context = stream_context_create($options);
	file_put_contents("gs://h2o-flint.appspot.com/".$filename, $output, 0, $context);
}

/* Returns a list of all alerts. */
function getAlerts() {
	$result = queries("alerts_titles");
	
	$alertsList = "<option value=''></option>\n";
	
	while ($row = $result->fetch_assoc())
		$alertsList .= "<option value='" . $row["id"] . "'>" . $row["title"] . "</option>\n";
	
	return $alertsList;
}

/* Sends out a Firebase notification when an alert is created or edited. */
function sendFirebaseNotification() {
	$priority = $_POST["priority"];
	$title = $_POST["title"];
	$body = $_POST["body"];
	$url = $_POST["url"];
	
	// if the expiration isn't set, set ttl to the default of 4 weeks
	if (strcmp($_POST["expiration"], "") === 0)
		$ttl = 2419000;
	else
		$ttl = strtotime($_POST["expiration"]) - time();
	
	$notification_array = array(
		"to" => "/topics/flint-water-updates",
		"priority" => $priority,
		"data" => array(
			"title" => $title,
			"body" => $body,
			"click_action" => $url
		),
		"time_to_live" => $ttl,
		"dry_run" => true
	);
	
	$notification_json = json_encode($notification_array, JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
	
	$client = new GuzzleHttp\Client(["verify" => __ROOT__ . "/vendor/ca-bundle.crt"]);
	
	try {
		$response = $client->request("POST", "https://fcm.googleapis.com/fcm/send", [
			"debug" => true,
			"headers" => [
				"Content-Type" => "application/json",
				"Authorization" => "key=" . getenv("FIREBASE_SERVER_KEY")
			],
			"body" => $notification_json
		]);
	}
	catch (ClientException $e) {}
}

/* Email some info to a user. */
function email_user() {
	if ($_POST["type"] == "contact_form") {
		$to = getenv('APP_EMAIL');
		$from = getenv('APP_EMAIL');
		$subject = "A Comment About MyWater-Flint (Admin Site)";
		
		$msg = sprintf("<p><strong>Email:</strong><br /> %s</p>
						<p><strong>Comments:</strong><br /> %s</p>", htmlspecialchars($_POST["email"]), htmlspecialchars($_POST["comments"]));
	}
	else if (strcmp($_POST["type"], "new_user_email") === 0) {
		$to = $_POST["email"];
		$from = getenv('APP_EMAIL');
		$subject = "An account has been created for you on MyWater-Flint";
		
		$msg = "Hello,\n\n

				Follow this link to activate your new account on MyWater-Flint. Please enter your email address and check \"Forgot Password\" to gain access.\n
				<a href=\"https://www.mywater-flint.com/admin\">https://www.mywater-flint.com/admin</a>\n\n

				Thanks,\n
				Your MyWater-Flint team";
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