<?php

require_once "queries.php";
require_once "vendor/autoload.php";

use google\appengine\api\mail\Message;

$reportId = mt_rand(0,9999999999);
$paddedId = sprintf("%010d", $reportId);	// Pad the number with zeros.

$json = file_get_contents("php://input");
$obj = json_decode($json);

/* The data came from the Android app. */
if ($obj) {
	if ($obj->{"type"} == "problem_report") {
		$result = queries("problem_report", "" , $paddedId, $obj);
		
		if ($result)
			email_user();
	}
	else if (stripos($obj->{"type"}, "survey") !== false)
		$result = queries("survey", "" , "", $obj);
}
/* The data came from the website. */
else {
	if ($_POST["type"] == "resource_report") {	
		$result = queries($_POST["type"], "" , $paddedId);
		echo $result;
	}
	else if ($_POST["type"] == "problem_report") {
		$result = queries($_POST["type"], "" , $paddedId);
		
		if ($result)
			email_user();
		else
			echo 0;
	}
	else if ($_POST["type"] == "contact_form") {
		// insert contact form data into the database
		$result = queries($_POST["type"]);
	
		email_user($result);
	}
}

function email_user() {
	if (($_POST["type"] == "problem_report") || ($obj->{"type"} == "problem_report")) {
		$from = getenv('APP_EMAIL');
		$subject = "A Message from MyWater-Flint";
		
		// comes from the Android app
		if ($obj) {
			$to = sprintf("%s", $obj->{"email"});
			$msg = sprintf("<p>Thank you for your submission. Someone will be in contact with you to follow up on your report.</p>
				<p>Here is a copy of your report for your records:</p>
				<p><strong>Location:</strong><br />%s</p>
				<p><strong>Problem Type:</strong><br /> %s</p>
				<p><strong>Problem Description:</strong><br /> %s</p>", $obj->{"location"}, $obj->{"problemType"}, htmlspecialchars($obj->{"description"}));
		}
		// comes from the website
		else {
			$to = sprintf("%s", $_POST["email"]);
			$msg = sprintf("<p>Thank you for your submission. Someone will be in contact with you to follow up on your report.</p>
				<p>Here is a copy of your report for your records:</p>
				<p><strong>Location:</strong><br />%s</p>
				<p><strong>Problem Type:</strong><br /> %s</p>
				<p><strong>Problem Description:</strong><br /> %s</p>", $_POST["location"], $_POST["problemType"], htmlspecialchars($_POST["description"]));
		}
	}
	else if ($_POST["type"] == "contact_form") {
		$to = getenv('APP_EMAIL');
		$from = getenv('APP_EMAIL');
		$subject = "A Comment About MyWater-Flint";
		
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
		echo 0;
	}
}

?>