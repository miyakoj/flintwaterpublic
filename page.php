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
			$content .="<div id='test_my_water'>
						<div class='card'>
					       <div class='card-main'><h3>Step 1: Get a water test kit</h3>
					             <div class='card-inner'><p>Pick up a free water test kit from a water resource location.</p></div>
					           <div class='card-action'><a class='btn btn-flat' href='index.php'>VIEW PICK-UP LOCATIONS</a></div>
					       </div>
					   </div>
					   <div><!--This button goes at the bottom of the screen-->
					       <button id='test_water_step1' type='button' class='btn btn-primary btn-lg btn-block btn-bottom'><!--<a href='Step 2'-->I ALREADY HAVE A TEST KIT<!--</a>--></button>
   						</div>";
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
			$content .="<div class='stpper-vert'>
						    <div class='stpper-vert-inner'>
						        <div class='stepper done'>
						            <div class='stepper-step'>
						                <i class='icon stepper-step-icon'>check</i>
						                <span class='stepper-step-num'>1</span>
						            </div>
						            <span class='stepper-text'>Step 1</span>
						        </div>
								<div class='stepper-vert-content'>
								<!--- Step One Contents Here! ---> 
									<label for='locationTextField'>Enter Your Location: </label><br>
						        <input id='locationTextField' type='text' size='50'>
						        <script>
						            function init() {
						                var input = document.getElementById('locationTextField');
						                var autocomplete = new google.maps.places.Autocomplete(input);
						            }

						            google.maps.event.addDomListener(window, 'load', init);
						        </script>
						        </div>
						        <div class='stepper active'>
						            <div class='stepper-step'>
						                <i class='icon stepper-step-icon'>check</i>
						                <span class='stepper-step-num'>2</span>
						            </div>
						            <span class='stepper-text'>Step 2</span>
						        </div>
						        <div class='stepper-vert-content'>
									<!-- Step Two Contents Here! --->
									<div class='form-group form-group-label'>
									<label for='ProblemSelector'> Select The Problem: </label>
									<select class='form-control' id='ProblemSelector' style='max-width:250px;'>
										<option value='...'> Discolored Water </option>
										<option value='...'> Water Main Break </option>
										<option value='...'> Other Infrastructure Issue </option>
										...
									</select>
									</div>
						        </div>
						        <div class='stepper'>
						            <div class='stepper-step'>
						                <i class='icon stepper-step-icon'>check</i>
						                <span class='stepper-step-num'>3</span>
						            </div>
						            <span class='stepper-text'>Step 3</span>
						        </div>
						        <div class='stepper-vert-content'>
								<!--- Step 3 Contents Here! --->
						            <div class='form-group form-group-label'>
									<label for='GrowBox'> Describe Problem: </label><br>
									<textarea class='form-control textarea-autosize' id='GrowBox' rows='3' style='max-width:500px;'></textarea>
									</div>
						        </div>
						    </div>
						</div>

						<br><a class='btn'> Submit </a><br>";
		break;
		
		case "submit":
			$pagetitle = "Submit Location Information";
			$content = "<div class='page-header'><h1>" . $pagetitle . "</h1></div>";
			$content .="<div class='stpper-horiz stepper_group_width'>
						    <div class='stepper-horiz-inner '>
						        <div class='stepper active'>
						            <div class='stepper-step'>
						                <i class='icon stepper-step-icon'>check</i>
						                <span class='stepper-step-num'>1</span>
						            </div>
						        </div>
						        <div class='stepper'>
						            <div class='stepper-step'>
						                <i class='icon stepper-step-icon'>check</i>
						                <span class='stepper-step-num'>2</span>
						            </div>
						        </div>
						        <div class='stepper'>
						            <div class='stepper-step'>
						                <i class='icon stepper-step-icon'>check</i>
						                <span class='stepper-step-num'>3</span>
						            </div>
						        </div>
						    </div>
						</div>
						<div class='card' id='index_page'>
						    <div class='card-main'>
						        <div class='card-inner'> 
						        	<p>Submitting more information about a location helps make lead level predictions more accurate for the entire community.</p>
						        	<h6>Thank you for doing your part!</h6>
						        </div>
						    </div>
						</div>
						<div id='survey-get-started' >
						<a class='btn btn-brand'> <span>GET STARTED</span> </a>
						</div>";
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
$page->set("PAGE_TITLE", " | " . $pagetitle);
$page->set("PAGE_ID", $pid . "_page");
$page->set("TOGGLES", "");
$page->set("CONTENT", $content);
$page->create();