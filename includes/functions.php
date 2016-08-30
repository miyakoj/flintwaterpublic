<?php

require_once "queries.php";
require_once "google/appengine/api/mail/Message.php";
use google\appengine\api\mail\Message;

$reportId = mt_rand(0,9999999999);
$paddedId = sprintf("%010d", $reportId);	// Pad the number with zeros.

if ($_POST["type"] == "resource") {
    $result = queries("inaccuracy", "" , $paddedId);
    echo $result;
}
else if ($_POST["type"] == "report") {
    //$result = queries("report", "" , $paddedId);
	
	$result = TRUE;
	
	if ($result)
		email_user();
	else
		echo 0;
}

function email_user() {	
	$to = sprintf("%s", $_POST["email"]);
	$from = "umflinth20@google.com";
	$subject = "A Message from Unite Flint";
	
	if ($_POST["type"] == "report") {
		$msg = sprintf("<p>Thank you for your submission. Someone will be in contact with you to follow up on your report.</p>
			<p>Here is a copy of your report for your records:</p>
			<p><strong>Location:</strong> %s</p>
			<p><strong>Problem Type:</strong> %s</p>
			<p><strong>Problem Description:</strong> %s</p>", $_POST['location'], $_POST['problemType'], htmlspecialchars($_POST['description']));
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