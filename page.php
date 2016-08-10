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
			$content = "<div id='page_card'>
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
			</div>";
		break;
		
		case "test":
			$pagetitle = "Test Your Water";
			$content = "<div id='water_test' class='container-fluid'>
				<div class='row'>
					<div id='topbar' class='col-xs-12'></div>
				
					<div id='stepper_content' class='col-xs-12'>
						<div id='steppers' class='stepper-vert'>
									<h2>Test your water</h2>
									<div class='stepper-vert-inner'>
										<div id='water_step1' class='stepper active'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>check</span>
												<span class='stepper-step-num'>1</span>
											</div>
											<span class='stepper-text'>Get a water test kit</span>
										</div>
										<div id='water_step1_content' class='stepper-vert-content'>										
										  <ul>
											<li>Pick up a free test kit from a water resource location.</li>
											<li>Residents who need transportation or any other assistance can call 211.</li>
										  </ul>
										  <div class='btn_group'>
										  <a class='next_button btn btn-flat btn-primary' href='#'>Next</a>
										  <a class='cancel_button btn btn-flat' href='#'>Cancel</a>
										  </div>
										</div>
										
										<div id='water_step2' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>check</span>
												<span class='stepper-step-num'>2</span>
											</div>
											<span class='stepper-text'>Take the water sample</span>
										</div>
										<div id='water_step2_content' class='stepper-vert-content hide'>
											<div class='help_video embed-responsive embed-responsive-16by9 center-block'>
											<iframe class='embed-responsive-item' src='https://www.youtube.com/embed/KMaAZA1c3oA' allowfullscreen></iframe>
											</div>
										
										   <ul>
											 <li>Fill out the water test form that came with your water test kit.</li>
											 <li>The sample should be taken from either your kitchen(recommended) or bathroom sink.</li>
											 <li>Water must not have been used at all for more than 6 hours before taking the sample. A good time to do this is first thing in the morning.</li>
											 <li>Use cold water that has not been filtered.</li>
											 <li>Fill the water jug almost to the top, leave about 2 inches for air at the top.</li>
										   </ul>
										   <div class='btn_group'>
										  <a class='next_button btn btn-flat btn-primary' href='#'>Next</a>
										  <a class='cancel_button btn btn-flat' href='#'>Cancel</a>
										  </div>
										</div>
										
										<div id='water_step3' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>check</span>
												<span class='stepper-step-num'>3</span>
											</div>
											<span class='stepper-text'>Drop off test results</span>
										</div>
										<div id='water_step3_content' class='stepper-vert-content hide'>
										  <ul>
											 <li>Seal the water sample tightly and take it to a drop-off location.</li>
											 <li>Once your test has been processed, you can find your results under the \"Testing Results\" tab on the <a href='http://www.michigan.gov/flintwater'>Michigan.gov/flintwater</a> website.</li>
										  </ul>
										  <div class='btn_group'>
										 <a class='next_button btn btn-flat btn-primary' href='#'>Return to map</a>
										 </div>
										</div>
									</div>
								</div>
							</div>
							
							<div id='sidebar' class='col-sm-7'></div>
						</div>
					</div>";
		break;
		
		case "filter":
			$pagetitle = "Install a Water Filter";
			$content = "<div id='install_filter' class='container-fluid'>
				<div class='row'>
					<div id='topbar' class='col-xs-12'></div>
				
					<div id='stepper_content' class='col-xs-12'>
						<div id='steppers' class='stepper-vert'>
								<h2>Install a Water Filter</h2>
								<div class='stepper-vert-inner'>
									<div id='filter_step1' class='stepper active'>
										<div class='stepper-step'>
											<span class='icon stepper-step-icon'>check</span>
											<span class='stepper-step-num'>1</span>
										</div>
										<span class='stepper-text'>Choose your filter type</span>
									</div>
									
									<div id='allFilters_step1_content' class='stepper-vert-content'>
										<div id='Brita_card' class='next_button card'>
											<div class='card-main'>
												<div class='card-img'><img src='images/Brita.jpg' /></div>
												<div class='card-inner'><h5>Brita</h5></div>
											</div>
										</div>
										
										<div id='PUR_card' class='next_button card'>
											<div class='card-main'>
												<div class='card-img'><img src='images/PUR.jpg' /></div>
												<div class='card-inner'><h5>PUR</h5></div>
											</div>
										</div>
										
										<div id='ZeroWater_card' class='next_button card'>
											<div class='card-main'>
												<div class='card-img'><img src='images/ZeroWater.jpg' /></div>
												<div class='card-inner'><h5>ZeroWater</h5></div>
											</div>
										</div>
									</div>
										
								<div id='filter_step2' class='stepper'>
									<div class='stepper-step'>
										<span class='icon stepper-step-icon'>check</span>
										<span class='stepper-step-num'>2</span>
									</div>
									<span class='stepper-text'>Install your adapter</span>
								</div>
								
								<div id='Brita_step2_content' class='stepper-vert-content hide'>
									<div id='Brita_video' class='help_video embed-responsive embed-responsive-16by9 center-block'>
										<iframe class='embed-responsive-item' src='https://www.youtube.com/embed/Y0hfK6E8R18' allowfullscreen></iframe>
									</div>
									
								   <ul>
										<li>Remove your aerator.</li>
										<li>See if you have threads sticking out of the faucet head.</li>
										<li>If you have threads sticking out you don't need an adapter.</li>
										<li>If you don't have threads sticking out, choose one of the adapters in the box that fit you faucet.</li>
										<li>Screw in the adapter.</li>
								   </ul>
								   <div class='btn_group'>
								  <a id='Brita_step2_button' class='next_button btn btn-primary btn-flat'>Next</a>
								  <a class='cancel_button btn btn-flat'>Cancel</a>
								  </div>
								</div>
								
								<div id='PUR_step2_content' class='stepper-vert-content hide'>									
									<div id='PUR_video' class='help_video embed-responsive embed-responsive-16by9 center-block'>
										<iframe class='embed-responsive-item' src='https://www.youtube.com/embed/r3Xm34EkQLY' allowfullscreen></iframe>
									</div>
								
								   <ul>
									 <li>Remove your aerator.</li>
									 <li>Choose an adapter from the PUR filter box that fits the missing aerator location.</li>
									 <li>Put the rubber gasket that matches your adapter over the threads.</li>
									 <li>Next, screw the adapter on.</li>
								   </ul>
								   <div class='btn_group'>
								  <a id='PUR_step2_button' class='next_button btn btn-primary btn-flat'>Next</a>
								  <a class='cancel_button btn btn-flat'>Cancel</a>
								  </div>
								</div>
								
								<div id='ZeroWater_step2_content' class='stepper-vert-content hide'>
								   <p>ZeroWater pitchers do not require an adapter. No installation video is available.</p>
								   
								   <div class='btn_group'>
								  <a id='ZeroWater_step2_button' class='next_button btn btn-primary btn-flat'>Next</a>
								  <a class='cancel_button btn btn-flat'>Cancel</a>
								  </div>
								</div>
										
								<div id='filter_step3' class='stepper hide'>
									<div class='stepper-step'>
										<span class='icon stepper-step-icon'>check</span>
										<span class='stepper-step-num'>3</span>
									</div>
									<span class='stepper-text'>Install your filter</span>
								</div>
								
								<div id='Brita_step3_content' class='stepper-vert-content hide'>
								  <ul>
									<li>Line up the hole in the filter base.</li>
									<li>Twist the mounting collar to secure it to the faucet.</li>
									<li>Line up the peg on the bottom of the filter cartridge with the hole in the filter base.</li>
									<li>Place your hand under the base and push down on the top of the filter cartridge until you here a click.</li>
								  </ul>
								  <div class='btn_group'>
								 <a class='next_button btn btn-primary btn-flat'>Return to map</a>
								 </div>
								</div>
								
								<div id='PUR_step3_content' class='stepper-vert-content hide'>
								  <ul>
										<li>Remove filter from packaging.</li>
										<li>Remove the cap from the filter unit by unscrewing the top half of the cylindrical shape.</li>
										<li>Place the filter in the bottom half of the unit with the arrow pointing at the center of the PUR logo.</li>
										<li>Screw the cap back on.</li>
										<li>Push the filter unit onto the adapter until you hear a click.</li>
								  </ul>
								  <div class='btn_group'>
								 <a class='next_button btn btn-primary btn-flat'>Return to map</a>
								 </div>
								</div>
								
								<div id='ZeroWater_step3_content' class='stepper-vert-content hide'>
								  <ul>
										<li>Remove lid from the pitcher</li>
										<li>Remove water reservoir from the pitcher.</li>
										<li>Remove filter from packaging.</li>
										<li>Screw the filter into the bottom of the reservoir.</li>
								  </ul>
								  <div class='btn_group'>
								 <a class='next_button btn btn-primary btn-flat'>Return to map</a>
								 </div>
								</div>
										</div>
									</div>
								</div>
								
								<div id='sidebar' class='col-sm-7'></div>
							</div>
						</div>";
		break;
		
		case "aerator":
			$pagetitle = "Clean My Aerator";
			$content = "<div id='clean_aerator' class='container-fluid'>
				<div class='row'>
					<div id='topbar' class='col-xs-12'></div>
				
					<div id='stepper_content' class='col-xs-12'>
						<div id='steppers' class='stepper-vert'>
									<h2>Clean My Aerator</h2>
									<div class='stepper-vert-inner'>
										<div id='aerator_step1' class='stepper active'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>check</span>
												<span class='stepper-step-num'>1</span>
											</div>
											<span class='stepper-text'>Remove the aerator</span>
										</div>
										<div id='aerator_step1_content' class='stepper-vert-content'>										
										  <ul>
											<li>Get a cloth or tape to wrap around the aerator.</li>
											<li>Get a pair of pliers.</li>
											<li>Place the plier jaws around the aerator gently.</li>
											<li>Grip the faucet arm.</li>
											<li>Turn the aerator clockwise without crushing aerator.</li>
										  </ul>
										  <div class='btn_group'>
										  <a class='next_button btn btn-flat btn-primary' href='#'>Next</a>
										  <a class='cancel_button btn btn-flat' href='#'>Cancel</a>
										  </div>
										</div>
										
										<div id='aerator_step2' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>check</span>
												<span class='stepper-step-num'>2</span>
											</div>
											<span class='stepper-text'>Clean the aerator</span>
										</div>
										<div id='aerator_step2_content' class='stepper-vert-content hide'>
											<div class='help_video embed-responsive embed-responsive-16by9 center-block'>
											<iframe class='embed-responsive-item' src='https://www.youtube.com/embed/7P9L2b8v5VM' allowfullscreen></iframe>
											</div>
										
										   <ul>
											<li>Move the aerator over a flat surface.</li>
											<li>Remove the parts inside the aerator by pushing them. If stuck, place in a solution that can remove lime. Remember the order in which you removed the parts.</li>
											<li>Clean aerator by gently scrubbing with a toothbrush.</li>
										  </ul>
										   <div class='btn_group'>
										  <a class='next_button btn btn-flat btn-primary' href='#'>Next</a>
										  <a class='cancel_button btn btn-flat' href='#'>Cancel</a>
										  </div>
										</div>
										
										<div id='aerator_step3' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>check</span>
												<span class='stepper-step-num'>3</span>
											</div>
											<span class='stepper-text'>Reinstall the aerator</span>
										</div>
										<div id='aerator_step3_content' class='stepper-vert-content hide'>
										  <ul>
											<li>Put the aerator back together in reverse order.</li>
											<li>Screw the aerator back into the faucet counterclockwise.</li>
											<li>Tighten with pliers, but not too tightly.</li>
										  </ul>
										  <div class='btn_group'>
										 <a class='next_button btn btn-flat btn-primary' href='#'>Return to map</a>
										 </div>
										</div>
									</div>
								</div>
							</div>
							
							<div id='sidebar' class='col-sm-7'></div>
						</div>
					</div>";
		break;
		
		case "submit":
			$pagetitle = "Submit Location Information";
			$content ="<div id='submit_info' class='stepper-vert'><h2>Submit Location Information</h2>
							<div class='stepper-vert-inner'>
								<div id='submit_step1' class='stepper active'>
									<div class='stepper-step'>
										<span class='icon stepper-step-icon'>check</span>
										<span class='stepper-step-num'>1</span>
									</div>
									<span class='stepper-text'>Introduction</span>
								</div>
								<div id='submit_step1_content' class='stepper-vert-content'>								
								  <p></p>Submitting more information about a location helps make lead level predictions more accurate for the entire community.</p>
								  
								  <h6>Thank you for doing your part!</h6>
								  
								  <div class='btn_group'>
								  <a id='step1_click' href='#' class='btn btn-flat btn-primary'>Continue</a>
								  <a class='cancel_button btn btn-flat btn-primary'>Cancel</a>
								  </div>
								</div>
								
								<div id='submit_step2' class='stepper'>
									<div class='stepper-step'>
										<span class='icon stepper-step-icon'>check</span>
										<span class='stepper-step-num'>2</span>
									</div>
									<span class='stepper-text'>Enter your location</span>
								</div>
								<div id='submit_step2_content' class='stepper-vert-content hide'>
									<label for='locationTextField' style='display:none;'>Enter Your Location: </label><br />
									<input class='form-control' id='locationTextField' style='width=100%;'>
									<script>
										function init() {
											var input = document.getElementById('locationTextField');
											var autocomplete = new google.maps.places.Autocomplete(input);
										}
										google.maps.event.addDomListener(window, 'load', init);
									</script>
									
								   <div class='btn_group'>
								  <a id='step2_click' class='btn btn-flat btn-primary disabled'>Continue</a>
								  <a class='cancel_button btn btn-flat btn-primary'>Cancel</a>
								  </div>
								</div>
							</div>
						</div>";
		break;
		case "report":
			$pagetitle = "Report a Problem";
			$content = "<div id='report_problem' class='stepper-vert'><h2>Report a Problem</h2>
							<form action='includes/functions.php' method='post'>
								<div class='stepper-vert-inner'>
									<div id='report_step1' class='stepper active'>
										<div class='stepper-step'>
											<span class='icon stepper-step-icon'>check</span>
											<span class='stepper-step-num'>1</span>
										</div>
										<span class='stepper-text'>Enter your location</span>
									</div>
								<div id='report_step1_content' class='stepper-vert-content'>								
								  <label for='locationTextField' style='display:none;'>Enter Your Location: </label><br />
									<input class='form-control' id='locationTextField' style='width=100%;' name='location' />
									<script>
										function init() {
											var input = document.getElementById('locationTextField');
											var autocomplete = new google.maps.places.Autocomplete(input);
										}
										google.maps.event.addDomListener(window, 'load', init);
									</script>
								  <div class='btn_group'>
								  <a id='step1_click' href='#' class='btn btn-flat btn-primary'>Continue</a>
								  <a class='cancel_button btn btn-flat btn-primary'>Cancel</a>
								  </div>
								</div>
								
								<div id='report_step2' class='stepper'>
									<div class='stepper-step'>
										<span class='icon stepper-step-icon'>check</span>
										<span class='stepper-step-num'>2</span>
									</div>
									<span class='stepper-text'>Select the problem</span>
								</div>
								<div id='report_step2_content' class='stepper-vert-content hide'>
									<div id='step2_stuff' class='form-group form-group-label'>
                                    <label for='ProblemSelector' style='display:none;'> Select The Problem: </label>
                                    <select title='Please Choose One' class='form-control' id='ProblemSelector' style='width:100%;' name='problemType' >
										<option value=''> </option> 
                                        <option value='Discolored Water'> Discolored Water </option>
                                        <option value='Water Main Break'> Water Main Break </option>
                                        <option value='Other Infrastructure Issue'> Other Infrastructure Issue </option>
                                    </select>
                                    </div>
								   <div class='btn_group'>
								  <a id='step2_click' class='btn btn-flat btn-primary'>Continue</a>
								  <a class='cancel_button btn btn-flat btn-primary'>Cancel</a>
								  </div>
								</div>
								
								<div id='report_step3' class='stepper'>
									<div class='stepper-step'>
										<span class='icon stepper-step-icon'>check</span>
										<span class='stepper-step-num'>3</span>
									</div>
									<span class='stepper-text'>Describe the problem</span>
								</div>
								<div id='report_step3_content' class='stepper-vert-content hide'>
								  <div id='step3_stuff' class='form-group form-group-label'>
                                    <label for='GrowBox' style='display:none;'> Describe Problem: (500 Character Limit) </label><br>
                                    <textarea class='form-control textarea-autosize' id='GrowBox' rows='3' maxlength='500' style='width:100%;' name='description' ></textarea>						
									</div>
								  <div class='btn_group'>
								 <button id='submit_button' type:'submit' class='btn btn-flat btn-primary'>Submit</button>
								 <a class='cancel_button btn btn-flat btn-primary'>Cancel</a>
								 </div>
								</div>
							</div>
						</form>
						</div>";
		break;
		
		case "about":
			$pagetitle = "About This Site";
			$content = "<p>This website is a joint project between University of Michigan-Flint, University of Michigan-Ann Arbor, and Google.</p>";
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