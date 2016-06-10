<?php

include "includes/template.php";

if (@isset($_GET["pid"])) {
	$pid = $_GET["pid"];
	
	switch($pid) {
		case "map":
			header("Location: index.php");
			exit();
		break;
		
		case "news":
			$pagetitle = "News and Alerts";
			$content = "<div class='page-header'><h1>" . $pagetitle . "</h1></div>";
			$content .= "<div id='page_card' class='card'>
			<div class='card-main'>
				<nav class='tab-nav'>
				  <ul class='nav nav-justified' role='tablist'>
					<li role='presentation' class='active tab-nav-brand'><a href='#news' aria-controls='news' role='tab' data-toggle='tab'>News</a></li>
					<li role='presentation' class='tab-nav-brand'><a href='#alerts' aria-controls='alerts' role='tab' data-toggle='tab'>Alerts</a></li>
				  </ul>
				</nav>
				
				<div class='card-inner'>
				  <div class='tab-content'>
					<div class='row'>
					<div id='news' role='tabpanel' class='tab-pane fade in active'></div>
					<div id='alerts' role='tabpanel' class='tab-pane fade'></div>
					</div>
				  </div>
				</div>
			</div>
			</div>";
			
			/*hidden-md hidden-lg col-md-6 
			<h2 class='hidden-xs hidden-sm'>News</h2>
			<h2 class='hidden-xs hidden-sm'>Alerts</h2>*/
		break;
		
		case "test":
			$pagetitle = "Test My Water";
			$content = "<div class='page-header'><h1>" . $pagetitle . "</h1></div>";
		break;
		
		case "filter":
			$pagetitle = "Install a Water Filter";
			$content = "<div class='page-header'><h1>" . $pagetitle . "</h1></div>";
		break;
		
		case "aerator":
			$pagetitle = "Clean My Aerator";
			$content = "<div class='page-header'><h1>" . $pagetitle . "</h1></div>";
		break;
		
		case "report":
			$pagetitle = "Report a Problem";
			$content = "<div class='page-header'><h1>" . $pagetitle . "</h1></div>";
		break;
		
		case "submit":
			$pagetitle = "Submit Location Information";
			$content = "<div class='page-header'><h1>" . $pagetitle . "</h1></div>";
		break;
		
		case "about":
			$pagetitle = "About This Site";
			$content = "<div class='page-header'><h1>" . $pagetitle . "</h1></div>";
			$content .= "<p>This website is a joint project between University of Michigan-Flint, University of Michigan-Ann Arbor, and Google.</p>";
		break;
	}
}
else {
	header("Location: index.php");
	exit();
}

$page = new webpageTemplate("includes/template.html");
$page->set("PAGE_TITLE", " |" . $pagetitle);
$page->set("PAGE_ID", $pid . "_page");
$page->set("TOGGLES", "");
$page->set("CONTENT", $content);
$page->create();