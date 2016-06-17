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
			$content = "<div id='page_card' >
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
			
			/*hidden-md hidden-lg col-md-6 
			<h2 class='hidden-xs hidden-sm'>News</h2>
			<h2 class='hidden-xs hidden-sm'>Alerts</h2>*/
		break;
		
		case "test":
			$pagetitle = "Test My Water";
			$content ="<div id='step1'>
							<div class='card'>
						       <div class='card-main'><h3>Step 1: Get a water test kit</h3>
						             <div class='card-inner'><p>Pick up a free water test kit from a water resource location.</p></div>
						           <div class='card-action'><a class='btn btn-flat'>VIEW PICK-UP LOCATIONS</a></div>
						       </div>
						   	</div>
					  		<button type='button' class='btn btn-primary btn-lg btn-block btn-bottom'>I ALREADY HAVE A TEST KIT</button>
					  	</div>
					  	<div id='step2'> 
						  	<div class='card'>
						        <div class='card-main'><h3>Step 2: Fill out form</h3>
						              <div class='card-inner'><p>Fill out the water test form that came with your water test kit.</p></div>
						        </div>
						    </div>
						    <button type='button' class='btn btn-primary btn-lg btn-block btn-bottom'>CONTINUE</button>
					  	</div>
					  	<div id='step3'>
						  	<div class='card'>
						       	<div class='card-main'><h3>Step 3: Plan to sample</h3>
						            <div class='card-inner'>
						              <ul>
						                <li>The sample should be taken from either your kitchen (recommended) or bathroom sink.</li>
						                <li>Water must not have been used at all for more than 6 hours before taking the sample. A good time to do this is first thing in the morning.</li>
						              <ul>
						            </div>
					           </div>
					       	</div>
					    	<button type='button' class='btn btn-primary btn-lg btn-block btn-bottom'>CONTINUE</button>
					   	</div>
					   	<div id='step4'>
					   		<div class='card'>
						        <div class='card-main'><h3>Step 4: Take the sample</h3>
						              <div class='card-inner'>
						              <ul>
						                <li>Use cold water that has not been filtered.</li>
						                <li>Fill the water jug almost to the top, leave about 2 inches for air at the top</li>
						              </ul>
						            </div>
						        </div>
						    </div>
						    <button id='test_water_step4' type='button' class='btn btn-primary btn-lg btn-block btn-bottom'>CONTINUE</button>
					   	</div>
					   	<div id='step5'>
						   	<div class='card'>
						        <div class='card-main'><h3>Step 5: Drop off sample</h3>
						              <div class='card-inner'>
						              <p>Seal the water sample tightly and take it to a drop-off location.</p></div>
						             <div class='card-action'><a class='btn btn-flat' href='index.php'>VIEW DROP-OFF LOCATIONS</a></div>    
						        </div>
						    </div>
						    <div><!--This button needs to be at the bottom of the screen-->
						        <button type='button' class='btn btn-primary btn-lg btn-block btn-bottom'><!--<a href='Getting your test results page'>-->CONTINUE<!--</a>--></button>
						    </div>
					   	</div>
					   	<div id='step6'>
							<div class='card'>
						        <div class='card-main'><h3>Getting your test results</h3>
						              <div class='card-inner'>
						              <p>Once your test has been processed, you can find your results under the 'Residental Testing Results' tab on the <a href='http://www.michigan.gov/flintwater'>Michigan.gov/flintwater</a> website.</p></div>
						             <div class='card-action'><a class='btn btn-flat'>NOTIFY ME WHEN MY RESULTS ARE READY</a></div>    
						        </div>
						    </div>
						    <button type='button' class='btn btn-primary btn-lg btn-block btn-bottom'>RETURN TO MAP</button>
					   	</div>";
		break;
		
		case "filter":
			$pagetitle = "Install a Water Filter";
			$content = "<div class='card'>
						<div class='card-main'><h3>Step 1: Choose your filter type</h3>
						<div class='card-inner'><p>From the choices below, select your water filter.</p></div>
						<table style='width: 100%'>
							<tr>
								<td><img src='../images/PUR_filter.jpg' width='150' height='150'></td>
								<td> <img src='../images/Brita_filter.jpg' width='150' height='150'></td>
								<td><img src='../images/ZeroWater.jpg' width='150' height='150'></td>
							</tr>
							<tr>
								<td>PUR</td>
								<td>Brita</td>
								<td>ZeroWater</td>
							</tr>
						</table>
						<div class='card-action'>
						<div class='dropdown-wrap'>
						<div class='dropdown dropdown-inline'>
						<a class='btn dropdown-toggle-btn' data-toggle='dropdown'>CHOOSE YOUR FILTER</a>
							<ul class='dropdown-menu nav'>
								<li>
									<a> ZeroWater 23-Cup Dispenser, model number ZD-018 </a>
									<a> Brita faucet filter, model SAFF-100 </a>
									<a> PUR Faucet Mount, model number FM-3700B </a>
								</li>
							</ul>
						</div>
						</div>
						</div>	
					</div>
				</div>
			</div>";
		break;
		
		case "aerator":
			$pagetitle = "Clean My Aerator";
			$content = "<div id='step1'>
							<div class='card'>
			                    <img src='../images/aerator.jpg' alt='aerator' width='200' height='200'>
			                    <div class='card-main'><h3>Step 1: Protect the aerator</h3>
			                        <div class='card-inner'>
			                        <ul>
			                            <li>Get a cloth or tape to wrap around the aerator.</li>
			                            <li>Get a pair of pliers.</li>
			                        </ul>
			                        </div>
			                    </div>
			                </div>
			                <button id='clean_aerator_step1' type='button' class='btn btn-primary btn-lg btn-block btn-bottom'>CONTINUE</button>
			            </div>
			            <div id='step2'>
				            <div class='card'>
			                    <div class='card-main'><h3>Step 2: Remove the aerator</h3>
			                        <div class='card-inner'>
			                        <ul>
			                            <li>Place the plier jaws around the aerator gently.</li>
			                            <li>Grip the faucet handle.</li>
			                            <li>Turn the aerator clockwise without crushing aerator.</li>
			                        </ul>
			                        </div>
			                    </div>
			                </div>
	                		<button id='clean_aerator_step2' type='button' class='btn btn-primary btn-lg btn-block btn-bottom'>CONTINUE</button>
			            </div>
			            <div id='step3'>
			            	<div class='card'>
			                    <div class='card-main'><h3>Step 3: Clean the aerator</h3>
			                        <div class='card-inner'>
			                        <ul>
			                            <li>Move the aerator over a flat surface.</li>
			                            <li>Remove the parts inside the aerator by pushing them.(If stuck: place in a solution that can remove lime.)Remember the order in which you removed the parts.</li>
			                            <li>Clean aerator by gently scrubbing with a toothbrush.</li>
			                        </ul>
			                        </div>
			                    </div>
			                </div>
			                <button id='clean_aerator_step3' type='button' class='btn btn-primary btn-lg btn-block btn-bottom'>CONTINUE</button>
			            </div>
			            <div id='step4'>
				            <div class='card'>
			                    <div class='card-main'><h3>Step 4: Reinstall aerator</h3>
			                        <div class='card-inner'>
			                        <ul>
			                            <li>Put the aerator back together in reverse order.</li>
			                            <li>Screw the aerator back into the faucet counterclockwise.</li>
			                            <li>Tighten with pliers but not too tight.</li>
			                        </ul>
			                        </div>
			                    </div>
			                </div>
			                <button id='clean_aerator_step4' type='button' class='btn btn-primary btn-lg btn-block btn-bottom'>RETURN TO MAP</button>
			            </div>";
		break;
		
		case "report":
			$pagetitle = "Report a Problem";
			$content = "<div class='stpper-vert'>
                            <div class='stpper-vert-inner'>
                                <div id='stepper1' class='stepper'>
                                    <div class='stepper-step'>
                                        <i class='icon stepper-step-icon'>check</i>
                                        <span class='stepper-step-num'>1</span>
                                    </div>
                                    <span class='stepper-text'>Step 1</span>
                                </div>
                                <div class='stepper-vert-content'>
                                <!--- Step One Contents Here! ---> 
                                    <label for='locationTextField'>Enter Your Location: </label><br>
                                <input id='locationTextField' type='text' size='50' style='max-width:75%;' style='width:75%;'>
                                <script>
                                    function init() {
                                        var input = document.getElementById('locationTextField');
                                        var autocomplete = new google.maps.places.Autocomplete(input);
                                    }
                                    google.maps.event.addDomListener(window, 'load', init);
                                </script>
                                </div>
                                <div id='stepper2' class='stepper'>
                                    <div class='stepper-step'>
                                        <i class='icon stepper-step-icon'>check</i>
                                        <span class='stepper-step-num'>2</span>
                                    </div>
                                    <span class='stepper-text'>Step 2</span>
                                </div>
                                <div class='stepper-vert-content'>
                                    <!-- Step Two Contents Here! --->
                                    <div id='step2_stuff' class='form-group form-group-label'>
                                    <label for='ProblemSelector'> Select The Problem: </label>
                                    <select class='form-control' id='ProblemSelector' style='max-width:75%;' style='width:75%;'>
                                        <option value='...'> Discolored Water </option>
                                        <option value='...'> Water Main Break </option>
                                        <option value='...'> Other Infrastructure Issue </option>
                                        ...
                                    </select>
                                    </div>
                                </div>
                                <div id='stepper3' class='stepper'>
                                    <div class='stepper-step'>
                                        <i class='icon stepper-step-icon'>check</i>
                                        <span class='stepper-step-num'>3</span>
                                    </div>
                                    <span class='stepper-text'>Step 3</span>
                                </div>
                                <div class='stepper-vert-content'>
                                <!--- Step 3 Contents Here! --->
                                    <div id='step3_stuff' class='form-group form-group-label'>
                                    <label for='GrowBox'> Describe Problem: </label><br>
                                    <textarea class='form-control textarea-autosize' id='GrowBox' rows='3' style='max-width:75%;' style='width:75%;'></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <button id='clean_aerator_step1' type='button' class='btn btn-primary btn-lg btn-block btn-bottom'><!--<a href='Step 2'>-->SUBMIT<!--</a>--></button></div>";
		break;
		
		case "submit":
			$pagetitle = "Submit Location Information";
			$content ="<div class='stpper-horiz stepper_group_width'>
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