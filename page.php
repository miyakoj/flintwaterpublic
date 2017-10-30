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
			$content = "<section class='container'><h2 data-i18n='newsPage.newsPageTitle'></h2>
				<nav class='tab-nav'>
				  <ul class='nav nav-justified' role='tablist'>
					<li id='alerts_tab' role='presentation' class='tab-nav-brand'><a href='#alerts' aria-controls='alerts' role='tab' data-toggle='tab' data-i18n='newsPage.alertsTabTitle'></a></li>
					<li id='news_tab' role='presentation' class='tab-nav-brand active'><a href='#news' aria-controls='news' role='tab' data-toggle='tab' data-i18n='newsPage.newsPageTitle'></a></li>
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
				<h2 data-i18n='testPage.waterTestPageTitle'></h2>
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
											<span class='stepper-text' data-i18n='testPage.testPageTitle'></span>
										</div>
										<div id='water_step1_content' class='stepper-vert-content'>										
										  <ul>
											<li data-i18n='testPage.step1a'></li>
											<li><span data-i18n='testPage.step1b'></span> <a href='http://www.centralmichigan211.org'>211</a>.</li>
										  </ul>
										  <div class='btn_group'>
										  <button class='next_button btn btn-flat btn-primary' href='#' data-i18n='showmePages.nextBtn'></a>
										  <button class='cancel_button btn btn-flat' href='#' data-i18n='showmePages.cancelBtn'></a>
										  </div>
										</div>
										
										<div id='water_step2' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
												<span class='stepper-step-num'>2</span>
											</div>
											<span class='stepper-text' data-i18n='testPage.step2Title'></span>
										</div>
										<div id='water_step2_content' class='stepper-vert-content hide'>
											<div class='help_video embed-responsive embed-responsive-16by9 center-block'>
											<iframe class='embed-responsive-item' src='https://www.youtube.com/embed/KMaAZA1c3oA' allowfullscreen></iframe>
											</div>
										   <ul>
											 <li data-i18n='testPage.step2a'></li>
											 <li data-i18n='testPage.step2b'></li>
											 <li data-i18n='testPage.step2c'></li>
											 <li data-i18n='testPage.step2d'></li>
											 <li data-i18n='testPage.step2e'></li>
										   </ul>
										   <div class='btn_group'>
										   <button class='back_button btn btn-flat btn-primary hide' href='#' data-i18n='showmePages.backBtn'></button>
										   <button class='next_button btn btn-flat btn-primary' href='#' data-i18n='showmePages.nextBtn'></button>
										   <button class='cancel_button btn btn-flat' href='#' data-i18n='showmePages.cancelBtn'></button>
										  </div>
										</div>
										
										<div id='water_step3' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
												<span class='stepper-step-num'>3</span>
											</div>
											<span class='stepper-text' data-i18n='testPage.step3Title'></span>
										</div>
										<div id='water_step3_content' class='stepper-vert-content hide'>
										  <ul>
											 <li data-i18n='testPage.step3a'></li>
											 <li><span data-i18n='testPage.step3b'></span> <a href='http://www.michigan.gov/flintwater'>Michigan.gov/flintwater</a> <span data-i18n='testPage.step3b2'></span>.</li>
										  </ul>
										  <div class='btn_group'>
										  <button class='back_button btn btn-flat btn-primary hide' href='#' data-i18n='showmePages.backBtn'></button>
										  <button class='next_button btn btn-flat btn-primary' href='#' data-i18n='showmePages.endBtn'></button>
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
				<h2 data-i18n='filterPage.filterPageTitle'></h2>
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
										<span class='stepper-text' data-i18n='filterPage.step1Title'></span>
									</div>
									
									<div id='allFilters_step1_content' class='stepper-vert-content'>
										<div id='Brita_card' class='next_button card'>
											<div class='card-main'>
												<div class='card-img'><img src='images/Brita.jpg' /></div>
												<div class='card-inner'><h5 data-i18n='filterPage.step1Brita'></h5></div>
											</div>
										</div>
										
										<div id='PUR_card' class='next_button card'>
											<div class='card-main'>
												<div class='card-img'><img src='images/PUR.jpg' /></div>
												<div class='card-inner'><h5 data-i18n='filterPage.step1PUR'></h5></div>
											</div>
										</div>
										
										<div id='ZeroWater_card' class='next_button card'>
											<div class='card-main'>
												<div class='card-img'><img src='images/ZeroWater.jpg' /></div>
												<div class='card-inner'><h5 data-i18n='filterPage.step1ZeroWater'></h5></div>
											</div>
										</div>
									</div>
										
								<div id='filter_step2' class='stepper'>
									<div class='stepper-step'>
										<span class='icon stepper-step-icon'>done</span>
										<span class='stepper-step-num'>2</span>
									</div>
									<span class='stepper-text' data-i18n='filterPage.step2Title'></span>
								</div>
								
								<div id='Brita_step2_content' class='stepper-vert-content hide'>
									<div id='Brita_video' class='help_video embed-responsive embed-responsive-16by9 center-block'>
										<iframe class='embed-responsive-item' data-i18n='[src]filterPage.step2BritaVideo' allowfullscreen></iframe>
									</div>
									
								   <ul>
										<li data-i18n='filterPage.step2Brita1'></li>
										<li data-i18n='filterPage.step2Brita2'></li>
										<li data-i18n='filterPage.step2Brita3'></li>
										<li data-i18n='filterPage.step2Brita4'></li>
										<li data-i18n='filterPage.step2Brita5'></li>
								   </ul>
								   <div class='btn_group'>
								  <button id='Brita_step2_button' class='next_button btn btn-primary btn-flat' data-i18n='showmePages.nextBtn'></button>
								  <button class='cancel_button btn btn-flat' data-i18n='showmePages.cancelBtn'></button>
								  </div>
								</div>
								
								<div id='PUR_step2_content' class='stepper-vert-content hide'>									
									<div id='PUR_video' class='help_video embed-responsive embed-responsive-16by9 center-block'>
										<iframe class='embed-responsive-item' data-i18n='[src]filterPage.step2PURVideo' allowfullscreen></iframe>
									</div>
								
								   <ul>
									 <li data-i18n='filterPage.step2PUR1'></li>
									 <li data-i18n='filterPage.step2PUR2'></li>
									 <li data-i18n='filterPage.step2PUR3'></li>
									 <li data-i18n='filterPage.step2PUR4'></li>
								   </ul>
								   <div class='btn_group'>
								  <button id='PUR_step2_button' class='next_button btn btn-primary btn-flat' data-i18n='showmePages.nextBtn'></button>
								  <button class='cancel_button btn btn-flat' data-i18n='showmePages.cancelBtn'></button>
								  </div>
								</div>
								
								<div id='ZeroWater_step2_content' class='stepper-vert-content hide'>
								   <p data-i18n='filterPage.step2ZeroWater'></p>
								   
								   <div class='btn_group'>
								  <button id='ZeroWater_step2_button' class='next_button btn btn-primary btn-flat' data-i18n='showmePages.nextBtn'></button>
								  <button class='cancel_button btn btn-flat' data-i18n='showmePages.cancelBtn'></button>
								  </div>
								</div>
										
								<div id='filter_step3' class='stepper hide'>
									<div class='stepper-step'>
										<span class='icon stepper-step-icon'>done</span>
										<span class='stepper-step-num'>3</span>
									</div>
									<span class='stepper-text' data-i18n='filterPage.step3Title'></span>
								</div>
								
								<div id='Brita_step3_content' class='stepper-vert-content hide'>
								  <ul>
									<li data-i18n='filterPage.step3Brita1'></li>
									<li data-i18n='filterPage.step3Brita2'></li>
									<li data-i18n='filterPage.step3Brita3'></li>
									<li data-i18n='filterPage.step3Brita4'></li>
								  </ul>
								  <div class='btn_group'>
								 <button class='next_button btn btn-primary btn-flat' data-i18n='showmePages.endBtn'></button>
								 </div>
								</div>
								
								<div id='PUR_step3_content' class='stepper-vert-content hide'>
								  <ul>
										<li data-i18n='filterPage.step3PUR1'></li>
										<li data-i18n='filterPage.step3PUR2'></li>
										<li data-i18n='filterPage.step3PUR3'></li>
										<li data-i18n='filterPage.step3PUR4'></li>
										<li data-i18n='filterPage.step3PUR5'></li>
								  </ul>
								  <div class='btn_group'>
								 <button class='next_button btn btn-primary btn-flat' data-i18n='showmePages.endBtn'></button>
								 </div>
								</div>
								
								<div id='ZeroWater_step3_content' class='stepper-vert-content hide'>
								  <ul>
										<li data-i18n='filterPage.step3ZeroWater1'></li>
										<li data-i18n='filterPage.step3ZeroWater2'></li>
										<li data-i18n='filterPage.step3ZeroWater3'></li>
										<li data-i18n='filterPage.step3ZeroWater4'></li>
								  </ul>
								  <div class='btn_group'>
								 <button class='next_button btn btn-primary btn-flat' data-i18n='showmePages.endBtn'></button>
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
				<h2 data-i18n='aeratorPage.aeratorPageTitle'></h2>
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
											<span class='stepper-text' data-i18n='aeratorPage.step1Title'></span>
										</div>
										<div id='aerator_step1_content' class='stepper-vert-content'>
										  <ul>
											<li data-i18n='aeratorPage.step1a'></li>
											<li data-i18n='aeratorPage.step1b'></li>
											<li data-i18n='aeratorPage.step1c'></li>
											<li data-i18n='aeratorPage.step1d'></li>
											<li data-i18n='aeratorPage.step1e'></li>
										  </ul>
										  <div class='btn_group'>
										  <button class='next_button btn btn-flat btn-primary' href='#' data-i18n='showmePages.nextBtn'></button>
										  <button class='cancel_button btn btn-flat' href='#' data-i18n='showmePages.cancelBtn'></button>
										  </div>
										</div>
										
										<div id='aerator_step2' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
												<span class='stepper-step-num'>2</span>
											</div>
											<span class='stepper-text' data-i18n='aeratorPage.step2Title'></span>
										</div>
										<div id='aerator_step2_content' class='stepper-vert-content hide'>
											<div class='help_video embed-responsive embed-responsive-16by9 center-block'>
											<iframe class='embed-responsive-item' src='https://www.youtube.com/embed/7P9L2b8v5VM' allowfullscreen></iframe>
											</div>
										
										   <ul>
											<li data-i18n='aeratorPage.step2a'></li>
											<li data-i18n='aeratorPage.step2b'></li>
											<li data-i18n='aeratorPage.step2c'></li>
										  </ul>
										   <div class='btn_group'>
										  <button class='next_button btn btn-flat btn-primary' href='#' data-i18n='showmePages.nextBtn'></button>
										  <button class='cancel_button btn btn-flat' href='#' data-i18n='showmePages.cancelBtn'></button>
										  </div>
										</div>
										
										<div id='aerator_step3' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
												<span class='stepper-step-num'>3</span>
											</div>
											<span class='stepper-text' data-i18n='aeratorPage.step3Title'></span>
										</div>
										<div id='aerator_step3_content' class='stepper-vert-content hide'>
										  <ul>
											<li data-i18n='aeratorPage.step3a'></li>
											<li data-i18n='aeratorPage.step3b'></li>
											<li data-i18n='aeratorPage.step3c'></li>
										  </ul>
										  <div class='btn_group'>
										 <button class='next_button btn btn-flat btn-primary' href='#' data-i18n='showmePages.endBtn'></button>
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
			$content ="<div id='submit_info' class='stepper-vert'><h2 data-i18n='submitInfoPage.submitInfoPageTitle'></h2>
							<div class='stepper-vert-inner'>
								<div id='submit_step1' class='stepper active'>
									<div class='stepper-step'>
										<span class='icon stepper-step-icon'>done</span>
										<span class='stepper-step-num'>1</span>
									</div>
									<span class='stepper-text' data-i18n='submitInfoPage.step1Title'></span>
								</div>
								<div id='submit_step1_content' class='stepper-vert-content'>
								  <p data-i18n='submitInfoPage.step1'></p>
								  
								  <p data-i18n='submitInfoPage.step1thankyou'></p>
								  
								  <div class='btn_group'>
								  <button id='step1_click' href='#' class='btn btn-flat btn-primary' data-i18n='showmePages.nextBtn'></button>
								  <button class='cancel_button btn btn-flat btn-primary' data-i18n='showmePages.cancelBtn'></button>
								  </div>
								</div>
								
								<div id='submit_step2' class='stepper'>
									<div class='stepper-step'>
										<span class='icon stepper-step-icon'>done</span>
										<span class='stepper-step-num'>2</span>
									</div>
									<span class='stepper-text' data-i18n='submitInfoPage.step2Title'></span>
								</div>
								<div id='submit_step2_content' class='stepper-vert-content hide'>
									<label for='locationTextField' style='display:none;'>Enter Your Location: </label><br />
									<input class='form-control' id='locationTextField' onFocus='initAutocomplete()'>
									
								   <div class='btn_group'>
								  <button type='submit' id='step2_click' class='btn btn-flat btn-primary disabled' data-i18n='showmePages.submitBtn'></button>
								  <button type='button' class='cancel_button btn btn-flat btn-primary' data-i18n='showmePages.cancelBtn'></button>
								  </div>
								</div>
							</div>
						</div>";
		break;*/
		
		case "report":
			if (@isset($_GET["address"]))
				$address = mb_convert_case($_GET["address"], MB_CASE_TITLE, "UTF-8") . ", Flint, MI";
			else
				$placeholder = "placeholder=''";
			
			$pagetitle = "Report a Water Issue";
			$content = "<div id='report_problem' class='container-fluid'>
				<h2 data-i18n='waterIssuePage.waterIssuePageTitle'></h2>
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
											<span class='stepper-text' data-i18n='waterIssuePage.step1Title'></span>
										</div>
										<div id='report_step1_content' class='stepper-vert-content'>
											<div class='form-group'>
											<label for='location' class='sr-only'><span data-i18n='waterIssuePage.step1LocationLabel'></span>:</label>
											<input id='location' class='form-control' type='text' name='location' data-i18n='[placeholder]waterIssuePage.addressPlaceholder'  tabindex='20' value='" . $address . "'required />
											<input id='location_lat' type='hidden' class='form-control' />
											<input id='location_lng' type='hidden' class='form-control' />
											</div>
											
											<div class='btn_group'>
											<button class='next_button btn btn-flat btn-primary disabled' href='#' tabindex='21' data-i18n='showmePages.nextBtn'></button>
											<button class='cancel_button btn btn-flat' href='#' tabindex='22' data-i18n='showmePages.cancelBtn'></button>
											</div>
										</div>
										
										<div id='report_step2' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
												<span class='stepper-step-num'>2</span>
											</div>
											<span class='stepper-text' data-i18n='waterIssuePage.step2Title'></span>
										</div>
										<div id='report_step2_content' class='stepper-vert-content hide'>
											<div class='form-group'>
											<label for='problem_type'><span data-i18n='waterIssuePage.step2ProblemLabel'></span>:</label>
											<select id='problem_type' name='problem_type' data-i18n='[placeholder]waterIssuePage.step2ProblemTypePlaceholder' class='form-control' tabindex='23' required>
												<option value=''></option> 
												<option value='Discolored Water' data-i18n='waterIssuePage.step2Option1'></option>
												<option value='Water Main Break' data-i18n='waterIssuePage.step2Option2'></option>
												<option value='Other Infrastructure Issue' data-i18n='waterIssuePage.step2Option3'></option>
											</select>
											</div>
											
											<div class='form-group'>
											<label for='problem_text'><span data-i18n='waterIssuePage.step2ProblemLabel'></span>:</label>
											<textarea id='problem_text' class='form-control textarea-autosize' rows='5' name='problem_text' data-i18n='[placeholder]waterIssuePage.step2ProblemTextPlaceholder' tabindex='24' required></textarea>
											<p class='char_count'></p>
											</div>
											
											<div class='btn_group'>
											<button class='next_button btn btn-flat btn-primary disabled' href='#' tabindex='25' data-i18n='showmePages.nextBtn'></button>
											<button class='cancel_button btn btn-flat' href='#' tabindex='26' data-i18n='showmePages.cancelBtn'></button>
											</div>
										</div>
										
										<div id='report_step3' class='stepper hide'>
											<div class='stepper-step'>
												<span class='icon stepper-step-icon'>done</span>
												<span class='stepper-step-num'>3</span>
											</div>
											<span class='stepper-text' data-i18n='waterIssuePage.step3Title'></span>
										</div>
										<div id='report_step3_content' class='stepper-vert-content hide'>
											<!--<div id='contact_pref' class='form-group'>
												<h5><span data-i18n='waterIssuePage.step3ContactPref'></span>:</h5>
												
												<label class='radio-inline'>
													<input type='radio' name='contact_radio_options' id='email_choice' value='email' tabindex='27' /> <span data-i18n='waterIssuePage.step3EmailPref'></span>
												</label>
												<label class='radio-inline'>
													<input type='radio' name='contact_radio_options' id='phone_choice' value='phone' tabindex='28' /> <span data-i18n='waterIssuePage.step3PhonePref'></span>
												</label>
											</div>-->
											
											<div class='form-group'>
											<label for='email'><span data-i18n='waterIssuePage.step3EmailLabel'></span>:</label>
											<input id='email' class='form-control' type='email' name='email' data-i18n='[placeholder]waterIssuePage.step3EmailPlaceholder' tabindex='29' required />
											</div>
											
											<!--<label for='phone'><span data-i18n='waterIssuePage.step3PhoneLabel'></span>:</label>
											<input id='phone' class='form-control hide' type='tel' name='phone' data-i18n='[placeholder]waterIssuePage.step3PhonePlaceholder' tabindex='30' />-->
											
											<div class='btn_group'>
											<button type='submit' class='next_button btn btn-flat btn-primary disabled' tabindex='31' data-i18n='showmePages.submitBtn'></button>
											<button type='button' class='cancel_button btn btn-flat' tabindex='32' data-i18n='showmePages.cancelBtn'></button>
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
			$content = "<h3 class='text-center' data-i18n='aboutPage.aboutPageTitle'></h3>";
			$content .= "<section class='container'><div id='university_images' class='container-fluid'><div class='row'>
			<div class='col-md-6'><img id='umf_logo' src='images/umf_logo.png' /></div>
			<div class='col-md-6'><img id='um_logo' src='images/um_logo.png' /></div>
			</div></div>
			
			<p class='text-justify'><span data-i18n='aboutPage.copyrightPart1'></span> <a href='http://www.umflint.edu'>University of Michigan-Flint</a> <span data-i18n='aboutPage.copyrightPart2'></span> <a href='http://web.eecs.umich.edu/~jabernet/FlintWater/data_dive_summary.html'>University of Michigan-Ann Arbor Michigan Data Science Team</a> <span data-i18n='aboutPage.copyrightPart3'></span> <a href='http://www.google.org'>Google.org</a>.</p>
			
			<p class='text-justify'><span data-i18n='aboutPage.dataPart1'></span> <a href='http://www.michigan.gov/flintwater/0,6092,7-345-76292_76294_76297---,00.html'>State of Michigan</a> <span data-i18n='aboutPage.dataPart2'></span> <a href='https://www.cityofflint.com/water-sites/'>City of Flint</a> <span data-i18n='aboutPage.dataPart3'></span> <a href='http://www.flintcares.com'>Flint Cares</a>.</p></section>";
		break;
		
		case "disclaimer":
			$pagetitle = "Disclaimer";
			$content = "<h3 class='text-center' data-i18n='disclaimerPage.disclaimerPageTitle'></h3>";
			$content .= "<section class='container'><p class='text-justify'><strong data-i18n='disclaimerPage.disclaimerPrt1'></strong></p>			
				<p class='text-justify' data-i18n='disclaimerPage.disclaimerPrt2'></p>				
				<p class='text-justify' data-i18n='disclaimerPage.disclaimerPrt3'></p>				
				<p class='text-justify' data-i18n='disclaimerPage.disclaimerPrt4'></p></section>";
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