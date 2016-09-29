<?php

include "includes/template.php";

if (@isset($_GET["pid"])) {
	$pid = $_GET["pid"];
	
	switch($pid) {
		case "dashboard":
			$content = "<div class='content-top'>
				<div class='col-md-4'>
				<div class='row'>	
					<div class='content-top-1'>
					<canvas id='water_tests_chart'></canvas>
					</div>
					
					<div class='content-top-1'>
					<canvas id='repairs_chart'></canvas>
					</div>
					
					<div class='clearfix'></div>
				</div>
				</div>

				<div class='col-md-8'>
				<div class='row'>
					<div class='content-top-1'>
					<canvas id='levels_trend'></canvas>
					</div>
					
					<div class='content-top-1'>
					<canvas id='water_tests_trend'></canvas>
					</div>
				</div>
				</div>

				<!--<div class='col-md-8 map-1'>
				<div id='map' class='large'></div>
				</div>-->
				<div class='clearfix'> </div>
				</div>

				<!----->

				<div class='content-mid'>
				<div class='col-md-4'>

				</div>

				<div class='col-md-8 mid-content-top'>

				</div>
				<div class='clearfix'> </div>
				</div>

				<!----->

				<div class='content-bottom'>
				<div class='col-md-6'>

				</div>

				<div class='col-md-6'>

				</div>
				<div class='clearfix'> </div>
				</div>";
		break;
		
		case "reports":
		break;
		
		case "edit":
		break;
	}
}
else {
	header("Location: index.php");
	exit();
}

$page = new webpageTemplate("includes/template.html");
$page->set("PAGE_TITLE", " | " . $pagetitle);
$page->set("PAGE_ID", $pid . "_page");
$page->set("CONTENT", $content);
$page->create();