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
			$pagetitle = "News";
			$content = "<section class='container'><h2>News</h2>
				<nav class='tab-nav'>
				  <ul class='nav nav-justified' role='tablist'>
					<li id='alerts_tab' role='presentation' class='tab-nav-brand'><a href='#alerts' aria-controls='alerts' role='tab' data-toggle='tab'>Alerts</a></li>
					<li id='news_tab' role='presentation' class='tab-nav-brand active'><a href='#news' aria-controls='news' role='tab' data-toggle='tab'>News</a></li>
				  </ul>
				</nav>
				
				<div class='card-inner'>
				  <div class='tab-content'>
					<div class='row'>
					<div id='alerts' role='tabpanel' class='tab-pane fade'><div id='alerts_content'></div></div>
					<div id='news' role='tabpanel' class='tab-pane fade in active'></div>
					</div>
				  </div>
				</div>
			</section>";
		break;
		
		case "test":
			$pagetitle = "Test Your Water";
			$content = "<div id='water_test' class='container-fluid'>
				<h2>Test your water</h2>
				<div class='row'>
					<div id='topbar' class='col-xs-12'></div>
				
					<div id='stepper_content' class='col-xs-12'>
						<div id='steppers' class='stepper-vert'>
									<div class='stepper-vert-inner'>
										<div id='water_step1' class='stepper active'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
												<span class='stepper-step-num'>1</span>
											</div>
											<span class='stepper-text'>Get a water test kit</span>
										</div>
										<div id='water_step1_content' class='stepper-vert-content'>										
										  <ul>
											<li>Pick up a free test kit from a water resource location.</li>
											<li>Residents who need transportation or any other assistance can call <a href='http://www.centralmichigan211.org'>211</a>.</li>
										  </ul>
										  <div class='btn_group'>
										  <button class='next_button btn btn-flat btn-primary' href='#'>Next</a>
										  <button class='cancel_button btn btn-flat' href='#'>Cancel</a>
										  </div>
										</div>
										
										<div id='water_step2' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
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
										   <button class='back_button btn btn-flat btn-primary hide' href='#'>Back</button>
										   <button class='next_button btn btn-flat btn-primary' href='#'>Next</button>
										   <button class='cancel_button btn btn-flat' href='#'>Cancel</button>
										  </div>
										</div>
										
										<div id='water_step3' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
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
										  <button class='back_button btn btn-flat btn-primary hide' href='#'>Back</button>
										  <button class='next_button btn btn-flat btn-primary' href='#'>Return to map</button>
										 </div>
										</div>
									</div>
								</div>
							</div>
							
							<div id='sidebar' class='col-sm-7'></div>
						</div>
					</div>
					
					<div id='resource_card' class='card'>
						<button type='button' class='close' aria-label='Close'><span class='icon' aria-hidden='true'>close</span></button>
						
						<div class='card-main'>				
							<div class='card-inner'></div>
							
							<div class='card-action'>
								<button id='card_save' class='btn btn-flat pull-left' data-toggle='tooltip' data-placement='top' title='Save Location'><span class='icon icon-lg'>star_border</span> Save</button>
								
								<ul id='card_report_menu' class='btn btn-flat pull-left' data-toggle='tooltip' data-placement='top' title='Report an Inaccuracy'>
									<li>
										<div class='dropdown'>
										<a id='report_button' class='btn btn-flat dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
										<span class='icon icon-lg'>error</span> Report</a>
										
										<ul class='dropdown-menu dropdown-menu-right' aria-labelledby='report_button'>
											<li><a href='#'>Temporarily Closed</a></li>
											<li><a href='#'>Permanently Closed</a></li>
											<li><a href='#'>Doesn't Have Water Pickup</a></li>
											<li><a href='#'>Doesn't Have Water Filters</a></li>
											<li><a href='#'>Doesn't Have Test Kits</a></li>
											<li><a href='#'>Doesn't Accept Recycling</a></li>
											<li><a href='#'>Doesn't Perform Blood Testing</a></li>
										</ul>
										</div>
									</li>
								</ul>
								
								<button id='card_directions' class='btn btn-flat pull-right' title='Get Directions'>Get Directions</button>
							</div>
						</div>
					</div>";
		break;
		
		case "filter":
			$pagetitle = "Install a Water Filter";
			$content = "<div id='install_filter' class='container-fluid'>
				<h2>Install a Water Filter</h2>
				<div class='row'>
					<div id='topbar' class='col-xs-12'></div>
				
					<div id='stepper_content' class='col-xs-12'>
						<div id='steppers' class='stepper-vert'>
								<div class='stepper-vert-inner'>
									<div id='filter_step1' class='stepper active'>
										<div class='stepper-step'>
											<span class='icon stepper-step-icon'>done</span>
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
										<span class='icon stepper-step-icon'>done</span>
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
								  <button id='Brita_step2_button' class='next_button btn btn-primary btn-flat'>Next</button>
								  <button class='cancel_button btn btn-flat'>Cancel</button>
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
								  <button id='PUR_step2_button' class='next_button btn btn-primary btn-flat'>Next</button>
								  <button class='cancel_button btn btn-flat'>Cancel</button>
								  </div>
								</div>
								
								<div id='ZeroWater_step2_content' class='stepper-vert-content hide'>
								   <p>ZeroWater pitchers do not require an adapter. No installation video is available.</p>
								   
								   <div class='btn_group'>
								  <button id='ZeroWater_step2_button' class='next_button btn btn-primary btn-flat'>Next</button>
								  <button class='cancel_button btn btn-flat'>Cancel</button>
								  </div>
								</div>
										
								<div id='filter_step3' class='stepper hide'>
									<div class='stepper-step'>
										<span class='icon stepper-step-icon'>done</span>
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
								 <button class='next_button btn btn-primary btn-flat'>Return to map</button>
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
								 <button class='next_button btn btn-primary btn-flat'>Return to map</button>
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
								 <button class='next_button btn btn-primary btn-flat'>Return to map</button>
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
				<h2>Clean My Aerator</h2>
				<div class='row'>
					<div id='topbar' class='col-xs-12'></div>
				
					<div id='stepper_content' class='col-xs-12'>
						<div id='steppers' class='stepper-vert'>
									<div class='stepper-vert-inner'>
										<div id='aerator_step1' class='stepper active'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
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
										  <button class='next_button btn btn-flat btn-primary' href='#'>Next</button>
										  <button class='cancel_button btn btn-flat' href='#'>Cancel</button>
										  </div>
										</div>
										
										<div id='aerator_step2' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
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
										  <button class='next_button btn btn-flat btn-primary' href='#'>Next</button>
										  <button class='cancel_button btn btn-flat' href='#'>Cancel</button>
										  </div>
										</div>
										
										<div id='aerator_step3' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
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
										 <button class='next_button btn btn-flat btn-primary' href='#'>Return to map</button>
										 </div>
										</div>
									</div>
								</div>
							</div>
							
							<div id='sidebar' class='col-sm-7'></div>
						</div>
					</div>";
		break;
		
		/*case "submit":
			$pagetitle = "Submit Location Information";
			$content ="<div id='submit_info' class='stepper-vert'><h2>Submit Location Information</h2>
							<div class='stepper-vert-inner'>
								<div id='submit_step1' class='stepper active'>
									<div class='stepper-step'>
										<span class='icon stepper-step-icon'>done</span>
										<span class='stepper-step-num'>1</span>
									</div>
									<span class='stepper-text'>Introduction</span>
								</div>
								<div id='submit_step1_content' class='stepper-vert-content'>								
								  <p></p>Submitting more information about a location helps make lead level predictions more accurate for the entire community.</p>
								  
								  <h6>Thank you for doing your part!</h6>
								  
								  <div class='btn_group'>
								  <button id='step1_click' href='#' class='btn btn-flat btn-primary'>Continue</button>
								  <button class='cancel_button btn btn-flat btn-primary'>Cancel</button>
								  </div>
								</div>
								
								<div id='submit_step2' class='stepper'>
									<div class='stepper-step'>
										<span class='icon stepper-step-icon'>done</span>
										<span class='stepper-step-num'>2</span>
									</div>
									<span class='stepper-text'>Enter your location</span>
								</div>
								<div id='submit_step2_content' class='stepper-vert-content hide'>
									<label for='locationTextField' style='display:none;'>Enter Your Location: </label><br />
									<input class='form-control' id='locationTextField' onFocus='initAutocomplete()'>
									
								   <div class='btn_group'>
								  <button type='submit' id='step2_click' class='btn btn-flat btn-primary disabled'>Continue</button>
								  <button type='button' class='cancel_button btn btn-flat btn-primary'>Cancel</button>
								  </div>
								</div>
							</div>
						</div>";
		break;*/
		
		case "report":
			if (@isset($_GET["address"]))
				$address = mb_convert_case($_GET["address"], MB_CASE_TITLE, "UTF-8") . ", Flint, MI";
			else
				$placeholder = "placeholder='Enter a location or click a favorite location on the map'";
			
			$pagetitle = "Report a Water Issue";
			$content = "<div id='report_problem' class='container-fluid'>
				<h2>Report a Water Issue</h2>
				<div class='row'>
					<div id='topbar' class='col-xs-12'></div>
				
					<div id='stepper_content' class='col-xs-12'>						
						<div id='steppers' class='stepper-vert'>
						<form>
									<div class='stepper-vert-inner'>
										<div id='report_step1' class='stepper active'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
												<span class='stepper-step-num'>1</span>
											</div>
											<span class='stepper-text'>Enter the location</span>
										</div>
										<div id='report_step1_content' class='stepper-vert-content'>
											<div class='form-group'>
											<label for='location' class='sr-only'>Enter the Location:</label>
											<input id='location' class='form-control' type='text' name='location' " . $placeholder . " tabindex='20' value='" . $address . "'required />
											<input id='location_lat' type='hidden' class='form-control' />
											<input id='location_lng' type='hidden' class='form-control' />
											</div>
											
											<div class='btn_group'>
											<button class='next_button btn btn-flat btn-primary disabled' href='#' tabindex='21'>Next</button>
											<button class='cancel_button btn btn-flat' href='#' tabindex='22'>Cancel</button>
											</div>
										</div>
										
										<div id='report_step2' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
												<span class='stepper-step-num'>2</span>
											</div>
											<span class='stepper-text'>Describe the problem</span>
										</div>
										<div id='report_step2_content' class='stepper-vert-content hide'>
											<div class='form-group'>
											<label for='problem_type'>Select the problem:</label>
											<select id='problem_type' name='problem_type' placeholder='Please choose a problem type.' class='form-control' tabindex='23' required>
												<option value=''></option> 
												<option value='Discolored Water'>Discolored Water</option>
												<option value='Water Main Break'>Water Main Break</option>
												<option value='Other Infrastructure Issue'>Other Water-Related Infrastructure Issue</option>
											</select>
											</div>
											
											<div class='form-group'>
											<label for='problem_text'>Describe the problem:</label>
											<textarea id='problem_text' class='form-control textarea-autosize' rows='5' name='problem_text' placeholder='500 character limit' tabindex='24' required></textarea>
											<p class='char_count'></p>
											</div>
											
											<div class='btn_group'>
											<button class='next_button btn btn-flat btn-primary disabled' href='#' tabindex='25'>Next</button>
											<button class='cancel_button btn btn-flat' href='#' tabindex='26'>Cancel</button>
											</div>
										</div>
										
										<div id='report_step3' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
												<span class='stepper-step-num'>3</span>
											</div>
											<span class='stepper-text'>Contact information</span>
										</div>
										<div id='report_step3_content' class='stepper-vert-content hide'>
											<!--<div id='contact_pref' class='form-group'>
												<h5>Contact preference:</h5>
												
												<label class='radio-inline'>
													<input type='radio' name='contact_radio_options' id='email_choice' value='email' tabindex='27' /> Email
												</label>
												<label class='radio-inline'>
													<input type='radio' name='contact_radio_options' id='phone_choice' value='phone' tabindex='28' /> Phone
												</label>
											</div>-->
											
											<div class='form-group'>
											<label for='email'>Email address:</label>
											<input id='email' class='form-control' type='email' name='email' placeholder='user@email.com' tabindex='29' required />
											</div>
											
											<!--<input id='phone' class='form-control hide' type='tel' name='phone' placeholder='(555) 555-5555' tabindex='30' />-->
											
											<div class='btn_group'>
											<button type='submit' class='next_button btn btn-flat btn-primary disabled' tabindex='31'>Submit</button>
											<button type='button' class='cancel_button btn btn-flat' tabindex='32'>Cancel</button>
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<div id='sidebar' class='col-sm-7'></div>
						</form>
						</div>
					</div>";
		break;
		
		case "about":
			$pagetitle = "About this Site";
			$content = "<h3 class='text-center'>" . $pagetitle . "</h3>";
			$content .= "<section class='container'><div id='university_images' class='container-fluid'><div class='row'>
			<div class='col-md-6'><img id='umf_logo' src='images/umf_logo.png' /></div>
			<div class='col-md-6'><img id='um_logo' src='images/um_logo.png' /></div>
			</div></div>
			
			<p class='text-justify'>This website is a joint project between <a href='http://www.umflint.edu'>University of Michigan-Flint</a> and the <a href='http://web.eecs.umich.edu/~jabernet/FlintWater/data_dive_summary.html'>University of Michigan-Ann Arbor Michigan Data Science Team</a> with support from <a href='http://www.google.org'>Google.org</a>.</p>
			
			<p class='text-justify'>Water test data courtesy of the <a href='http://www.michigan.gov/flintwater/0,6092,7-345-76292_76294_76297---,00.html'>State of Michigan</a> and property abandonment data courtesy of the United States Postal Service (both via UM-Ann Arbor MDST). Predicted risk results (developed using computer modeling) courtesy of UM-Ann Arbor MDST. Resource site information courtesy of <a href='http://www.flintcares.com'>Flint Cares</a>.</p></section>";
		break;
		
		case "disclaimer":
			$pagetitle = "Disclaimer";
			$content = "<h3 class='text-center'>" . $pagetitle . "</h3>";
			$content .= "<section class='container'><p class='text-justify'><strong>Any user of the MyWater-Flint data portal application (\"MyWater-Flint\") agrees to all of the following disclaimers, waives any and all claims against, and agrees to hold harmless, the Regents of the University of Michigan, its board members, officers, employees, agent and students (collectively, \"University\") with regard to any matter related to the use or the contents of MyWater-Flint.</strong></p>
			
				<p class='text-justify'>The data displayed on MyWater-Flint are provided as a public service, on an \"AS-IS\" basis, and for informational purposes only. University does not create these data, vouch for their accuracy, or guarantee that these are the most recent data available from the data provider. For many or all of the data, the data are by their nature approximate and will contain some inaccuracies. The data may contain errors introduced by the data provider(s) and/or by University. The names of counties and other locations shown in MyWater-Flint may differ from those in the original data.</p>
				
				<p class='text-justify'>University makes no warranty, representation or guaranty of any type as to any errors and omissions, or as to the content, accuracy, timeliness, completeness or fitness for any particular purpose or use of any data provided on MyWater-Flint; nor is it intended that any such warranty be implied, including, without limitation, the implied warranties of merchantability and fitness for a particular purpose.  Furthermore, University (a) expressly disclaims the accuracy, adequacy, or completeness of any data and (b) shall not be liable for any errors, omissions or other defects in, delays or interruptions in such data, or for any actions taken or not taken in reliance upon such data. Neither University nor any of its data providers will be liable for any damages relating to your use of the data provided in MyWater-Flint.</p>
				
				<p class='text-justify'>University shall reserve the right to discontinue the availability of any content on MyWater-Flint at any time and for any reason or no reason at all. The user assumes the entire risk related to its use of the data on MyWater-Flint. In no event will University be liable to you or to any third party for any direct, indirect, incidental, consequential, special or exemplary damages or lost profit resulting from any use or misuse of these data.</p></section>";
		break;
		
		case "privacy":
			$pagetitle = "Privacy Policy";
			$content = "<section></section>";
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