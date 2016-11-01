<?php

@define("__ROOT__", dirname(dirname(__FILE__)));

require __ROOT__ . "/admin/includes/template.php";
require __ROOT__ . "/admin/includes/globals.php";
require __ROOT__ . "/admin/includes/verify_ID_token.php";
require __ROOT__ . "/admin/includes/functions.php";

if (@isset($_POST["pid"])) {	
	$pid = $_POST["pid"];
	
	$navigation = array();
	$script = "";
	
	switch($pid) {
		case "reports":
			$pagetitle = "Reports";
			
			$content = "<div class='content-top'>
				<div id='report_list' class='col-md-3'>
				<div class='row'>	
					<div class='content-top-1'>
						<h3>Reports</h3>
						
						<ul class='nav'>
							<li><button id='water_tests' type='button' class='btn btn-default'>Water Tests</button></li>
							<li><button id='problem_reports' type='button' class='btn btn-default' disabled='disabled'>Problem Reports</button></li>
							<li><button id='survey_results' type='button' class='btn btn-default' disabled='disabled'>Survey Results</button></li>
						</ul>
					</div>
				</div>
				</div>

				<div id='report_area' class='col-md-9'>
				<div class='row'>
					<div class='content-top-1'>
						<form class='form-inline hide'>
							<div id='report_type'>
								<h5>Report Type</h5>
								
								<select class='form-control'>
								<option selected=\"selected\"></option>
								</select>
							</div>
						
							<div id='time_period' class='hide'>						
								<div class='form-group'>
								<label for='years'>Years</label>
								<select id='years' class='form-control'></select>
								</div>
								
								<div class='form-group'>
								<label for='months'>Months</label>
								<select id='months' class='form-control'></select>
								</div>
							</div>
						</form>
						
						<div id='display_area' class='hide'></div>
					</div>
				</div>
				</div>
				
				<div class='clearfix'> </div>
			</div>";
			
			/* Retrieve the water test data from the database and process it. */
			$timePeriod = getTimePeriod();
			$year = array();
			
			foreach ($timePeriod as $value) {
				$array = explode(" ", $value);
				$years[] = $array[1];
			}
			
			$timePeriod = implode("', '", $timePeriod);
			$timePeriod = "['" . $timePeriod . "']";
			
			$years = array_unique($years);
			$years = implode("', '", $years);
			$years = "['" . $years . "']";
			
			$script = "<script>
			\$(document).ready(function() {
				//\$('#display_area form').resetForm();
				/*Pace.options = {
					ajax: true,
					document: false,
					eventLag: false
				};*/
				
				var timePeriods = $timePeriod;
				var months = $MONTHS;
				var years = $years;
				
				var yearOpts = '<option selected=\"selected\"></option>';
				var monthsOpts = '<option selected=\"selected\"></option>';
				
				for (var i=0; i<years.length; i++)
					yearOpts += '<option>' + years[i] + '</option>';
				
				for (var i=0; i<months.length; i++)
					monthsOpts += '<option>' + months[i] + '</option>';
				
				\$('#time_period #years').html(yearOpts);
				\$('#time_period #months').html(monthsOpts);
				
				/* Deactivate invalid year-month options. */
				\$('#time_period #years').on('change', function() {
					console.log(\$(this).val());
					console.log(timePeriods);
				});
				
				\$('#water_tests, #problem_reports, #survey_results').on('click', function() {
					if ($(this).attr('id').indexOf('water') != -1) {
						content = '<option id=\"all_water_tests1\">All Water Tests (Ungrouped)</option> \
								<option id=\"all_water_tests2\" disabled=\"disabled\">All Water Tests (Grouped by Address)</option> \
								<option id=\"high_water_tests1\" disabled=\"disabled\">High Water Tests (Ungrouped)</option> \
								<option id=\"high_water_tests1\" disabled=\"disabled\">High Water Tests (Grouped by Address)</option>';
					}							
						
					$('#report_type select').append(content);
					\$('#report_area form').removeClass('hide');
				});
				
				\$('#report_area #display_area #table_body').css({
					height: (window.innerHeight * 0.80) + 'px'
				});
				
				\$('#report_type select').on('change', function() {
					var id = \$('#report_type option:selected').attr('id');
					
					if (typeof(id) !== 'undefined') {					
						//Pace.track(function(){
							$.ajax({
								type: 'POST',
								data: {
									report_type: id
								},
								dataType: 'json',
								url: 'includes/functions.php',
								beforeSend: function() {
									//Pace.start();
								}
							}).done(function(data) {
								var content = '<div class=\"table-responsive\"> \
									<table id=\"table_header\" class=\"table\"> \
										<tr> \
											<th class=\"address\">Address</th> \
											<th class=\"lead_level\">Lead Level (ppb)</th> \
											<th class=\"copper_level\">Copper Level (ppb)</th> \
											<th class=\"date\">Date Submtted</th> \
										</tr> \
									</table> \
									\
									<table id=\"table_body\" class=\"table\">';
								
								for (var i=0; i<data.all_water_tests1.length; i++) {
									var temp = data.all_water_tests1[i];
									
									content += '<tr> \
										<td class=\"address\">' + temp.address + '</td> \
										<td class=\"lead_level\">' + temp.leadLevel + '</td> \
										<td class=\"copper_level\">' + temp.copperLevel + '</td> \
										<td class=\"date\">' + temp.dateUpdated + '</td> \
									</tr>';
								}
										
								content += '</table></div>';
								
								\$('#display_area').html(content);
								\$('#display_area').removeClass('hide');
								//Pace.stop();
							});
						//});
					}
				});
			});
			</script>";
		
		break;
		
		case "edit":
			$pagetitle = "Edit Data";
			$content = "<div class='content-top'>
				<div id='report_area' class='col-md-12'>
				<div class='row'>
					<div class='content-top-1'>
						INSERT FORM HERE
					</div>
				</div>
				</div>
			</div>";
			$script = "";
		break;
		
		case "alerts":
			$pagetitle = "Manage Alerts";
			$content = "<div class='content-top'>
				<div id='report_area' class='col-md-12'>
				<div class='row'>
					<div class='content-top-1'>
						INSERT FORM HERE
					</div>
				</div>
				</div>
			</div>";
			$script = "";
		break;
		
		case "about":
			$pagetitle = "About this Site";
			$content = "<h3 class='text-center'>" . $pagetitle . "</h3>";
			$content .= "<div class='content-top'>
				<div id='report_area' class='col-md-12'>
				<div class='row'>
					<div class='content-top-1'>		
					<p class='text-justify'>[insert text]</p>
					</div>
				</div>
				</div>
			</div>";
		break;
		
		case "disclaimer":
			$pagetitle = "Disclaimer";
			$content = "<h3 class='text-center'>" . $pagetitle . "</h3>";
			$content .= "<div class='content-top'>
				<div id='report_area' class='col-md-12'>
				<div class='row'>
					<div class='content-top-1'>
						<p class='text-justify'><strong>Any user of the MyWater-Flint data portal application (\"MyWater-Flint\") agrees to all of the following disclaimers, waives any and all claims against, and agrees to hold harmless, the Regents of the University of Michigan, its board members, officers, employees, agent and students (collectively, \"University\") with regard to any matter related to the use or the contents of MyWater-Flint.</strong></p>
			
						<p class='text-justify'>The data displayed on MyWater-Flint are provided as a public service, on an \"AS-IS\" basis, and for informational purposes only. University does not create these data, vouch for their accuracy, or guarantee that these are the most recent data available from the data provider. For many or all of the data, the data are by their nature approximate and will contain some inaccuracies. The data may contain errors introduced by the data provider(s) and/or by University. The names of counties and other locations shown in MyWater-Flint may differ from those in the original data.</p>
						
						<p class='text-justify'>University makes no warranty, representation or guaranty of any type as to any errors and omissions, or as to the content, accuracy, timeliness, completeness or fitness for any particular purpose or use of any data provided on MyWater-Flint; nor is it intended that any such warranty be implied, including, without limitation, the implied warranties of merchantability and fitness for a particular purpose.  Furthermore, University (a) expressly disclaims the accuracy, adequacy, or completeness of any data and (b) shall not be liable for any errors, omissions or other defects in, delays or interruptions in such data, or for any actions taken or not taken in reliance upon such data. Neither University nor any of its data providers will be liable for any damages relating to your use of the data provided in MyWater-Flint.</p>
						
						<p class='text-justify'>University shall reserve the right to discontinue the availability of any content on MyWater-Flint at any time and for any reason or no reason at all. The user assumes the entire risk related to its use of the data on MyWater-Flint. In no event will University be liable to you or to any third party for any direct, indirect, incidental, consequential, special or exemplary damages or lost profit resulting from any use or misuse of these data.</p>
					</div>
				</div>
				</div>
			</div>";
		break;
		
		default:
		$pid = "dashboard";
		$pagetitle = "Dashboard";
		
		$content = "<div class='content-top'>
			<div id='chart_area' class='col-md-4'>
			<div class='row'>	
				<div class='content-top-1'><canvas id='water_tests_chart'></canvas></div>
				<div class='content-top-1'><canvas id='repairs_chart'></canvas></div>
				
				<div class='clearfix'> </div>
			</div>
			</div>

			<div class='col-md-8'>
			<div class='row'>
				<div class='content-top-1'>
					<div id='legend_card' class='card hide'>
						<div class='card-main'>
							<div class='card-inner'></div>
						</div>
					</div>
					
					<div id='map'></div>
					
					<div id='map_layer_selection' class='btn-toolbar' role='group' aria-label='Map Layer Buttons'>
						<div class='btn-group' role='group'><button id='heatmap_btn' type='button' class='btn btn-default'>Lead Levels</button></div>
						<div class='btn-group' role='group'><button id='pipes_btn' type='button' class='btn btn-default'>Construction Sites</button></div>
					</div>
					
					<div id='resource_layer_selection' class='btn-toolbar hide' role='group' aria-label='Resource Layer Buttons'>
						<div class='btn-group' role='group'><button id='water_pickup_btn' type='button' class='btn btn-default'>Water Pickup</button></div>
						<div class='btn-group' role='group'><button id='recycling_btn' type='button' class='btn btn-default'>Recycling</button></div>
						<div class='btn-group' role='group'><button id='water_testing_btn' type='button' class='btn btn-default'>Water Testing</button></div>
						<div class='btn-group' role='group'><button id='blood_testing_btn' type='button' class='btn btn-default'>Blood Testing</button></div>
						<div class='btn-group' role='group'><button id='water_filters_btn' type='button' class='btn btn-default'>Water Filters</button></div>
					</div>
					
					<div id='location_card' class='card'>
						<button type='button' class='close' aria-label='Close'><span class='icon' aria-hidden='true'>close</span></button>
						
						<div class='card-main'>
							<div class='card-inner'></div>
						</div>
					</div>
					
					<div id='resource_card' class='card'>
						<button type='button' class='close' aria-label='Close'><span class='icon' aria-hidden='true'>close</span></button>
						
						<div class='card-main'>				
							<div class='card-inner'></div>
						</div>
					</div>
				</div>
			</div>
			</div>
			
			<div class='clearfix'> </div>
		</div>
		
		<div class='clearfix'> </div>
		
		<div class='content-mid'>
			<div id='graph_area' class='row'>
				<div class='content-top-1 col-xs-12 col-lg-6'><canvas id='levels_trend'></canvas></div>
				<div class='content-top-1 col-xs-12 col-lg-6'><canvas id='water_tests_trend' ></canvas></div>
			</div>
		</div>";
		
		/* Retrieve the water test data from the database and process it. */
		if (!isset($TIME_PERIOD))
			$TIME_PERIOD = getTimePeriod();
		
		$totalTimePeriods = sizeof($TIME_PERIOD);
		
		$TIME_PERIOD = implode("', '", $TIME_PERIOD);
		$TIME_PERIOD = "['" . $TIME_PERIOD . "']";
		
		$totalLocationsTested = generateChartData("total_locations");
		//$repairsChart = ;
		
		$testLevelsData = generateChartData("test_data");
		
		$leadActionLvlData = "[";
		$copperActionLvlData = "[";
		
		for ($i=0; $i<$totalTimePeriods; $i++) {
			$leadActionLvlData .= "15";
			$copperActionLvlData .= "1300";
			
			if ($i < ($totalTimePeriods-1)) {
				$leadActionLvlData .= ", ";
				$copperActionLvlData .= ", ";
			}
		}
		
		$leadActionLvlData .= "]";
		$copperActionLvlData .= "]";
		
		$numTestsData = arrayAccumulation($testLevelsData[2]);
		
		$script = "<script>
		\$(document).ready(function() {		
			/* Dashboard doughnut status charts. */
			if (\$('body').attr('id').indexOf('dashboard') != -1) {
				var waterTestsChart = new Chart(\$('#water_tests_chart'), {
					type: 'doughnut',
					data: {
						labels: ['Total Households', 'Total Locations Tested'],
						datasets: [{
							data: [$TOTAL_HOUSEHOLDS, $totalLocationsTested[0]],
							backgroundColor: ['#CCC', '#5266B0']
						}]
					},
					options: {
						title: {
							display: true,
							fontSize: 15,
							text: 'Water Tests'
						}
					}
				});
			
				var repairsChart = new Chart(\$('#repairs_chart'), {
					type: 'doughnut',
					data: {
						labels: ['Pending Repairs', 'Completed Repairs'],
						datasets: [{
							data: [203, 38],
							backgroundColor: ['#CCC', '#5266B0']
						}]
					},
					options: {
						title: {
							display: true,
							fontSize: 15,
							text: 'Water Infrastructure Repairs'
						}
					}
				});
				
				var levelsChart = new Chart(\$('#levels_trend'), {
					type: 'line',
					data: {
						labels: $TIME_PERIOD,
						datasets: [{
							label: 'Average Lead Level',
							data: $testLevelsData[0],
							backgroundColor: '#5266B0',
							borderColor: '#5266B0',
							fill: false
						},
						{
							label: 'Lead Action Level',
							data: $leadActionLvlData,
							backgroundColor: '#FF0000',
							borderColor: '#FF0000',
							fill: false
						},
						{
							label: 'Average Copper Level',
							data: $testLevelsData[1],
							borderColor: '#252E56',
							fill: false
						},
						{
							label: 'Copper Action Level',
							data: $copperActionLvlData,
							borderColor: '#FF6600',
							fill: false
						}]
					},
					options: {
						title: {
							display: true,
							fontSize: 15,
							text: 'Lead Levels by Month'
						},
						scales: {
							xAxes: [{
								display: true,
								scaleLabel: {
									display: true,
									labelString: 'Month'
								}
							}],
							yAxes: [{
								display: true,
								scaleLabel: {
									display: true,
									labelString: 'ppb'
								}
							}]
						}
					}
				});
				
				var waterTests = new Chart(\$('#water_tests_trend'), {
					type: 'line',
					data: {
						labels: $TIME_PERIOD,
						datasets: [{
							label: 'Total Water Tests',
							data: $numTestsData[1],
							backgroundColor: '#FF0000',
							borderColor: '#FF0000',
							fill: false
						},
						{
							label: 'Monthly Water Tests',
							data: $numTestsData[0],
							backgroundColor: '#5266B0',
							borderColor: '#5266B0',
							fill: false
						}]
					},
					options: {
						title: {
							display: true,
							fontSize: 15,
							text: 'Water Tests by Month'
						},
						scales: {
							xAxes: [{
								display: true,
								scaleLabel: {
									display: true,
									labelString: 'Month'
								}
							}],
							yAxes: [{
								display: true,
								scaleLabel: {
									display: false
								}
							}]
						}
					}
				});
			}
		});
		</script>";
	}
	
	$page = new webpageTemplate("includes/template.html");
	$page->set("PAGE_TITLE", " | " . $pagetitle);
	$page->set("PAGE_ID", $pid . "_page");
	$page->set("SCRIPT", $script);
	$page->set("CONTENT", $content);
	$page->create();
}
else {
	/* 
	 * Redirect the user to the login page if they aren't logged in. 
	 * http://php.net/manual/en/function.headers-sent.php#60450
	 */
	$page = "login.php";
	
	if (!headers_sent())
        header("Location: " . $page);
    else {
        echo '<script type="text/javascript">';
        echo 'window.location.href="'.$page.'";';
        echo '</script>';
    }
}