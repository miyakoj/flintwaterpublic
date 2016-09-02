<?php

require_once "queries.php";
require_once "google/appengine/api/mail/Message.php";
use google\appengine\api\mail\Message;

$reportId = mt_rand(0,9999999999);
$paddedId = sprintf("%010d", $reportId);	// Pad the number with zeros.

$json = file_get_contents("php://input");
$obj = json_decode($json);

if ($obj) {
	$result = queries("problem_report", "" , $paddedId, $obj);
}
else {
	if ($_POST["type"] == "resource_report") {	
		$result = queries("resource_report", "" , $paddedId);
		echo $result;
	}
	else if ($_POST["type"] == "problem_report") {
		$result = queries("problem_report", "" , $paddedId);
		
		if ($result)
			email_user();
		else
			echo 0;
	}
	else if ($_POST["type"] == "site_report") {	
		email_user();
	}
}

function email_user() {
	$to = sprintf("%s", $_POST["email"]);
	$from = "umflintH2O@gmail.com";
	$subject = "A Message from Unite Flint";
	$msg = "";
	
	if ($_POST["type"] == "problem_report") {
		$msg = sprintf("<p>Thank you for your submission. Someone will be in contact with you to follow up on your report.</p>
			<p>Here is a copy of your report for your records:</p>
			<p><strong>Location:</strong><br />%s</p>
			<p><strong>Problem Type:</strong><br /> %s</p>
			<p><strong>Problem Description:</strong><br /> %s</p>", $_POST["location"], $_POST["problemType"], htmlspecialchars($_POST["description"]));
	}
	else if ($_POST["type"] == "site_report") {
		$msg = sprintf("<p><strong>Site Problem Description:</strong><br /> %s</p>", htmlspecialchars($_POST["description"]));
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