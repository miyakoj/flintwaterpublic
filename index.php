<?php

require_once "includes/template.php";
//require_once "includes/queries.php";

//$result = queries("lead");

/*while ($row = $result->fetch_assoc()) {
	print_r($row);
}*/

//$data = "<script></script>";

$page = new webpageTemplate("includes/template.html");
//$page->set("MAP_POPULATION", $data);
$page->create();