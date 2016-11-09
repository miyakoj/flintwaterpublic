<?php

@define("__ROOT__", dirname(dirname(__FILE__)));

require __ROOT__ . "/admin/includes/template.php";
require __ROOT__ . "/admin/includes/globals.php";
require __ROOT__ . "/admin/includes/verify_ID_token.php";
require __ROOT__ . "/admin/includes/functions.php";

if (@isset($_POST["pid"])) {
	$pid = $_POST["pid"];
	$role = $_POST["role"];
	
	$navigation = '<ul class="nav navbar-nav" id="top-menu">';
	$dashboard_link = '<li><a id="dashboard_link" href="#"><span class="material-icons nav_icon">dashboard</span> <span class="nav-label">Dashboard</span></a></li>';
	$reports_link = '<li><a id="reports_link" href="#"><span class="material-icons nav_icon">list</span> <span class="nav-label">View Reports</span></a></li>';
	
	switch($role) {
		// admin users and those with edit only privileges
		case 1:
			$edit_link = '<li><a id="edit_link" href="#"><span class="material-icons nav_icon">edit</span> <span class="nav-label">Edit Data</span></a></li>';
			$alerts_link = '<li class="hide"><a id="alerts_link" href="#"><span class="material-icons nav_icon">add_alert</span> <span class="nav-label">Manage Alerts</span></a></li>';
			$users_link = '<li class="hide"><a id="users_link" href="#"><span class="material-icons nav_icon">person</span> <span class="nav-label">Manage Users</span></a></li>';
		break;
		
		case 2:
			$edit_link = '<li><a id="edit_link" href="#"><span class="material-icons nav_icon">edit</span> <span class="nav-label">Edit Data</span></a></li>';
			$alerts_link = '<li class="disabled"><a id="alerts_link" href="#"><span class="material-icons nav_icon">add_alert</span> <span class="nav-label">Manage Alerts</span></a></li>';
			$users_link = "";
		break;
		
		// users with view only privileges
		case 3:
			$edit_link = "";
			$alerts_link = "";
			$users_link = "";
	}
	
	$navigation .= $dashboard_link . $reports_link . $edit_link . $alerts_link . $users_link . "</ul>";
	
	$access_denied = "<p class='text-center'>You are not authorized to access this page.</p>";
	
	$script = "";
	
	$user_form = "<div id='user_form' class=\"collapse\">
					<form method='post'>
					<div class='form-group'>
						<div class='row'>
						<div class='col-xs-12 col-md-2 col-md-offset-1'>
						<label for='user_group'>User Group:</label>
						<input id='user_group' class='form-control' type='text' name='user_group' size='5' disabled />
						</div>				
						</div>
					</div>
					
					<div class='form-group'>
						<div class='row'>
						<div class='col-xs-12 col-md-3 col-md-offset-1'>
						<label for='first_name'>First Name:<span class='required'>*</span></label>
						<input id='first_name' class='form-control' type='text' name='first_name' size='5' required disabled />
						</div>
						<div class='col-xs-12 col-md-5'>
						<label for='last_name'>Last Name:<span class='required'>*</span></label>
						<input id='last_name' class='form-control' type='text' name='last_name' size='25' required disabled />
						</div>						
						</div>
					</div>
					
					<div class='form-group'>
						<div class='row'>
						<div class='col-xs-12 col-md-8 col-md-offset-1'>
						<label for='title'>Title:<span class='required'>*</span></label>
						<input id='title' class='form-control' type='text' name='title' size='5' required disabled />
						</div>						
						</div>						
					</div>
					
					<div class='form-group'>
						<div class='row'>
						<div class='col-xs-12 col-md-4 col-md-offset-1 hide'>
						<label for='email'>Email:</label>
						<input id='email' class='form-control' type='text' name='email' size='25' required />
						</div>
						
						<div class='col-xs-12 col-md-4'>
						<label for='phone'>Phone:</label>
						<input id='phone' class='form-control' type='text' name='phone' size='25' disabled />
						<span class='help-block' hide>Example: (810) 555-5555</span>
						</div>						
						</div>
					</div>
					
					<div class='form-group'>
						<div class='row'>
						<div class='col-xs-12 col-md-4 col-md-offset-1'>
						<label for='dept'>Department:</label>
						<input id='dept' class='form-control' type='text' name='dept' size='5' disabled />
						</div>
						<div class='col-xs-12 col-md-4'>
						<label for='bldg'>Building:</label>
						<input id='bldg' class='form-control' type='text' name='bldg' size='5' disabled />
						</div>
						</div>
					</div>
					
					<div class='form-group'>
						<div class='row'>
						<div class='col-xs-12 col-md-4 col-md-offset-1'>
						<label for='address'>Street address:<span class='required'>*</span></label>
						<input id='address' class='form-control' type='text' name='address' size='25' required disabled />
						<span class='help-block hide'>Example: 303 E. Kearsley St.</span>
						</div>
						
						<div class='col-xs-12 col-md-3'>
						<label for='city'>City:<span class='required'>*</span></label>
						<input id='city' class='form-control' type='text' name='city' size='5' required disabled />
						</div>
						<div class='col-xs-12 col-md-1'>
						<label for='state'>State:<span class='required'>*</span></label>
						<input id='state' class='form-control' type='text' name='state' size='2' required disabled />
						</div>
						<div class='col-xs-12 col-md-2'>
						<label for='zipcode'>Zipcode:<span class='required'>*</span></label>
						<input id='zipcode' class='form-control' type='text' name='zipcode' size='5' required disabled />
						</div>
						</div>
					</div>
					
					<div class='form-group'>
						<div class='row'>
						<div class='col-xs-12 col-md-10 col-md-offset-1'>
						<label for='show_info'>Show contact information to other users<span class='required'>*</span>:</label>
						<div id='show_info' class='radio'>
						<label><input type='radio' name='show_info' id='show_info1' value='yes' required disabled /> Yes</label>
						<label><input type='radio' name='show_info' id='show_info2' value='no' required checked disabled /> No</label>
						</div>
						</div>						
						</div>						
					</div>
					
					<div class='form-group'>
						<div class='row'>
						<div class='col-xs-12 col-md-10 col-md-offset-1'>
						<button id='edit_button' type='button' class='btn btn-default pull-right'>Edit</button>
						<button id='submit_button' type='submit' class='btn btn-default pull-right hide'>Submit</button>
						</div>
						</div>
					</div>
					</form>
				</div>";
	
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
							<li class='hide'><button id='problem_reports' type='button' class='btn btn-default' disabled='disabled'>Problem Reports</button></li>
							<li class='hide'><button id='survey_results' type='button' class='btn btn-default' disabled='disabled'>Survey Results</button></li>
						</ul>
					</div>
				</div>
				</div>

				<div id='report_area' class='col-md-9'>
				<div class='row'>
					<div class='content-top-1'>
						<p id='instructions'>Select a report type from the menu to the left.</p>
					
						<form class='form-inline hide' method='post'>
							<div id='report_type' class='row'>
								<div class='form-group col-xs-12 col-md-6'>
									<h5 style='font-weight:500;'>Report Type</h5>
									
									<select class='form-control'>
									<option selected='selected'></option>
									</select>
								</div>
							</div>
						
							<div id='time_period' class='row'>								
								<div class='form-group col-xs-12'>
								<h5 style='font-weight:500;'>Time Period</h5>
								
								<div class='row'>						
									<div class='form-group col-xs-12 col-md-3'>
									<label for='years'>Years</label>
									<select id='years' class='form-control' name='years[]' multiple='multiple' required></select>
									</div>
								
									<div class='form-group col-xs-12 col-md-3'>
									<label for='months'>Months</label>
									<select id='months' class='form-control' name='months[]' multiple='multiple' required></select>
									</div>
								</div>
								</div>							
								<div class='col-xs-12'><span class='help-block'>Hold down ctrl to multiselect.</span></div>
							</div>
							
							<div id='options' class='row'>
							<div class='form-group col-xs-12 col-md-4 hide'>
								<h5 style='font-weight:500;'>Aggregation</h5>
								
								<select id='aggregation' class='form-control' name='aggregation'>
								<option value='' selected='selected'></option>
								<option value='sum'>Sum</option>
								<option value='average'>Average</option>
								</select>
							</div>
							
							<div class='form-group col-xs-12 col-md-4 hide'>
								<h5 style='font-weight:500;'>Group By</h5>
								
								<select id='group_by' class='form-control' name='group_by'>
								<option value='' selected='selected'></option>
								<option value='date'>Date Added</option>
								<option value='address'>Address</option>
								</select>
							</div>
							
							<div class='form-group col-xs-12 col-md-3'>
								<h5 style='font-weight:500;'>Order By</h5>
								
								<select id='order_by' class='form-control' name='order_by'>
								<option value='' selected='selected'></option>
								<option value='date_asc'>Date Added (Ascending)</option>
								<option value='date_desc'>Date Added (Descending)</option>
								<option value='lead_asc'>Lead Level (Ascending)</option>
								<option value='lead_desc'>Lead Level (Descending)</option>
								<option value='copper_asc'>Copper Level (Ascending)</option>
								<option value='copper_desc'>Copper Level (Descending)</option>
								<option value='address_asc'>Address (Ascending)</option>
								<option value='address_desc'>Address (Descending)</option>
								</select>
							</div>
							</div>
							
							<div id='limit' class='row'>								
								<div class='form-group col-xs-12'>
								<h5 style='font-weight:500;'>Limit</h5>
								
								<div class='row'>
									<div class='col-xs-12 col-md-6'>
									<label for='lead'>Lead Level: </label>
									<span>less than</span> <input id='lead_less' class='form-control' type='text' name='lead_less' size='4' />, 
									<span>greater than</span> <input id='lead_greater' class='form-control' type='text' name='lead_greater' size='4' />
									</div>
									
									<div class='col-xs-12 col-md-6'>
									<label for='copper'>Copper Level: </label>
									<span>less than</span> <input id='copper_less' class='form-control' type='text' name='copper_less' size='4' />, 
									<span>greater than</span> <input id='copper_greater' class='form-control' type='text' name='copper_greater' size='4' />
									</div>
								</div>
								</div>
							</div>
							
							<div class='row'><div class='form-group col-xs-12'>
							<button id='submit_button' type='submit' class='btn btn-default pull-right'>Submit</button>
							<button id='clear_button' type='button' class='btn btn-default pull-right'>Clear</button>
							</div></div>
						</form>
						
						<div id='display_area' class='hide'></div>
					</div>
				</div>
				</div>
				
				<div class='clearfix'> </div>
			</div>";
			
			/* Retrieve the water test data from the database and process it. */
			if (!isset($TIME_PERIOD))
				$TIME_PERIOD = getTimePeriod();			
			
			$year = array();
			
			foreach ($TIME_PERIOD as $value) {
				$array = explode(" ", $value);
				$years[] = $array[1];
			}
			
			$TIME_PERIOD = implode("', '", $TIME_PERIOD);
			$TIME_PERIOD = "['" . $TIME_PERIOD . "']";
			
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
				
				var timePeriods = $TIME_PERIOD;
				var months = $MONTHS;
				var years = $years;
				
				var yearOpts = '';
				var monthsOpts = '';
				
				for (var i=0; i<years.length; i++)
					yearOpts += '<option value=\"' + years[i] + '\">' + years[i] + '</option>';
				
				for (var i=0; i<months.length; i++)
					monthsOpts += '<option value=\"' + (i+1) + '\">' + months[i] + '</option>';
				
				\$('#time_period #years').html(yearOpts);
				\$('#time_period #months').html(monthsOpts);
				
				/* Hide the form if the report type is blank. */
				/*\$('#report_type').on('change', function() {
					if (\$('#report_type').val() === '')
						\$('#report_area form').addClass('hide');
				});*/
				
				\$('#water_tests, #problem_reports, #survey_results').on('click', function() {
					$('#instructions').addClass('hide');
					//$(this).find('form').resetForm();
					$(this).addClass('active');
					var content = '';
					
					if ($(this).attr('id').indexOf('water') != -1) {
						$('#report_type').addClass('hide');
						
						/*content = '<option id=\"all_water_tests1\">All Water Tests (Ungrouped)</option> \
								<option id=\"all_water_tests2\" disabled=\"disabled\">All Water Tests (Grouped by Address)</option> \
								<option id=\"high_water_tests1\" disabled=\"disabled\">High Water Tests (Ungrouped)</option> \
								<option id=\"high_water_tests1\" disabled=\"disabled\">High Water Tests (Grouped by Address)</option>';*/
					}					
						
					\$('#report_type select').append(content);
					\$('#report_area form').removeClass('hide');
				});
			});
			</script>";
		
		break;
		
		case "edit":
			if (($role == 1) || ($role == 2)) {
				$pagetitle = "Edit Data";
				$content = "<h3 class='text-center'>" . $pagetitle . "</h3>";
				
				$resource_locations = getResourceLocations();
				
				$inner_content = "<div class='panel-group' id='resources_accordion' role='tablist' aria-multiselectable='true'>
				<div class='panel panel-default'>
				<div class='panel-heading' role='tab' id='edit_resource_heading'>
				<h4 class='panel-title'><a role='button' data-toggle='collapse' data-parent='#resources_accordion' href='#edit_resources' aria-expanded='true' aria-controls='edit_resources'>Edit Resource Location</a></h4>
				</div>

				<div id='edit_resources' class='panel-collapse collapse' role='tabpanel' aria-labelledby='edit_resource_heading'>
				<div class='panel-body'>
				<form id='location_form' method='post'>
					<div id='instructions'>Click \"Load\" to retrieve data for the selected resource location.</div>
					
					<div id='location_list' class='form-group'>
					<div class='row'>
					<div class='col-xs-12 col-md-5'><select class='form-control' name='location_menu'>$resource_locations</select></div>
					<div class='col-xs-12 col-md-3'><button type='button' class='btn btn-default'>Load</button></div>
					</div>
					</div>
					
					<div class='form-group'>
					<label for='site'>Name of site<span class='required'>*</span>:</label>
					<input id='site' class='form-control' type='text' name='site' size='55' required />
					</div>
					
					<div class='form-group'>
						<label for='categories'>Resource Types<span class='required'>*</span></label>:
						<div id='category_options'>
						<input id='water_pickup' type='checkbox' name='categories[]' value='Water Pickup' /> <label for='water_pickup'>Water Pickup</label><br />
						<input id='water_filters' type='checkbox' name='categories[]' value='Water Filters' /> <label for='water_filters'>Water Filters</label><br />
						<input id='recycling' type='checkbox' name='categories[]' value='Recycle' /> <label for='recycling'>Recycling</label><br />
						<input id='test_kits' type='checkbox' name='categories[]' value='Test Kits' /> <label for='test_kits'>Test Kits</label><br />
						<input id='blood_testing' type='checkbox' name='categories[]' value='Blood Testing' /> <label for='blood_testing'>Blood Testing</label>
						</div>
					</div>
					
					<div class='form-group'>
						<div class='row'>
						<div class='col-xs-12 col-md-6'>
						<label for='address'>Street address<span class='required'>*</span>:</label>
						<input id='address' class='form-control' type='text' name='address' size='25' required disabled />
						<span class='help-block hide'>Example: 125 E. Union St.</span>
						</div>
						<div class='col-xs-12 col-md-3'>
						<label for='city'>City<span class='required'>*</span>:</label>
						<input id='city' class='form-control' type='text' name='city' size='5' required />
						</div>
						<div class='col-xs-12 col-md-3'>
						<label for='zipcode'>Zipcode<span class='required'>*</span>:</label>
						<input id='zipcode' class='form-control' type='text' name='zipcode' size='5' required />
						</div>
						</div>
					</div>
					
					<div class='form-group'>
						<div class='row'>
						<div class='col-xs-12 col-md-3'>
						<label for='latitude'>Latitude<span class='required'>*</span>:</label>
						<input id='latitude' class='form-control' type='text' name='latitude' size='10' required />
						<span class='help-block'>Example: 43.0186</span>
						</div>
						<div class='col-xs-12 col-md-3'>
						<label for='longitude'>Longitude<span class='required'>*</span>:</label>
						<input id='longitude' class='form-control' type='text' name='longitude' size='10' required />
						<span class='help-block'>Example: -83.6916</span>
						</div>
						</div>
					</div>
					
					<div class='form-group'>
						<div class='row'>
						<div class='col-xs-12 col-md-3'>
						<label for='phone'>Phone number:</label>
						<input id='phone' class='form-control' type='tel' name='phone' size='15' />
						<span class='help-block'>Example: (810) 555-5555</span>
						</div>
						<div class='col-xs-12 col-md-6'>
						<label for='hours'>Hours<span class='required'>*</span>:</label>
						<input id='hours' class='form-control' type='text' name='hours' size='20' required />
						<span class='help-block'>Example: MWRF 8-11a, 1-4p; T 1-4p</span>
						</div>
						</div>
					</div>
					
					<div class='form-group'>
					<label for='notes'>Notes:</label>
					<textarea id='notes' class='form-control' rows='3' name='notes' cols='50' placeholder='600 character limit'></textarea>
					<p class='char_count'></p>
					</div>
					
					<button type='submit' class='btn btn-default pull-right'>Submit</button>
				</form>
				</div>
				</div>
				</div>

				<div class='panel panel-default'>
				<div class='panel-heading' role='tab' id='new_resource_heading'>
				<h4 class='panel-title'><a role='button' data-toggle='collapse' data-parent='#resources_accordion' href='#new_resources' aria-expanded='true' aria-controls='new_resources'>New Resource Location</a></h4>
				</div>

				<div id='new_resources' class='panel-collapse collapse' role='tabpanel' aria-labelledby='new_resource_heading'>
				<div class='panel-body'></div>
				</div>
				</div>

				<div class='panel panel-default'>
				<div class='panel-heading' role='tab' id='delete_resource_heading'>
				<h4 class='panel-title'><a role='button' data-toggle='collapse' data-parent='#resources_accordion' href='#delete_resources' aria-expanded='true' aria-controls='delete_resources'>Delete Resource Location</a></h4>
				</div>

				<div id='delete_resources' class='panel-collapse collapse' role='tabpanel' aria-labelledby='delete_resource_heading'>
				<div class='panel-body'>
				<form id='delete_form' method='post'>
					<div class='row'>
					<div class='col-xs-12 col-md-5'><select class='form-control' name='location_menu'>$resource_locations</select></div>
					<div class='col-xs-12 col-md-3'><button type='submit' class='btn btn-default' disabled='disabled'>Delete</button></div>
					</div>
				</form>
				</div>
				</div>
				</div>
				</div>
				
				<hr class='hide' />
				
				<div class='panel-group hide' id='construction_accordion' role='tablist' aria-multiselectable='true'>
				<div class='panel panel-default'>
				<div class='panel-heading' role='tab' id='new_construction_heading'>
				<h4 class='panel-title'><a role='button' data-toggle='collapse' data-parent='#construction_accordion' href='#new_construction' aria-expanded='true' aria-controls='new_construction'>New Construction Location</a></h4>
				</div>

				<div id='new_construction' class='panel-collapse collapse' role='tabpanel' aria-labelledby='new_construction_heading'>
				<div class='panel-body'>
				NEW CONSTRUCTION LOCATION FORM
				</div>
				</div>
				</div>
				
				<div class='panel panel-default'>
				<div class='panel-heading' role='tab' id='edit_construction_heading'>
				<h4 class='panel-title'><a role='button' data-toggle='collapse' data-parent='#construction_accordion' href='#edit_construction' aria-expanded='true' aria-controls='edit_construction'>Edit Construction Location</a></h4>
				</div>

				<div id='edit_construction' class='panel-collapse collapse' role='tabpanel' aria-labelledby='edit_construction_heading'>
				<div class='panel-body'>
				NEW CONSTRUCTION LOCATION FORM
				</div>
				</div>
				</div>
				</div>";
			}
			else {
				$pagetitle = "";
				$content = "";
				$inner_content = $access_denied;
			}
			
			$content .= "<div class='content-top'>
				<div class='col-xs-12 col-md-8 col-md-offset-2'>
				<div class='row'>
					<div class='content-top-1'>
					<section>
					$inner_content
					</section>
					</div>
				</div>
				</div>
			</div>";
		break;
		
		case "alerts":
			if (($role == 1) || ($role == 2)) {
				$pagetitle = "Manage Alerts";
				$content = "<h3 class='text-center'>" . $pagetitle . "</h3>";
				$inner_content = "INSERT FORM HERE";
			}
			else {
				$pagetitle = "";
				$content = "";
				$inner_content = $access_denied;
			}
			
			$content .= "<div class='content-top'>
				<div class='col-xs-12 col-md-8 col-md-offset-2'>
				<div class='row'>
					<div class='content-top-1'>
					<section>
					$inner_content
					</section>
					</div>
				</div>
				</div>
			</div>";
		break;
		
		case "users":
			if ($role == 1) {
				$pagetitle = "Manage Users";
				$content = "<h3 class='text-center'>" . $pagetitle . "</h3>";
				$inner_content = "<div class=\"row\">
									<div class=\"col-xs-6 col-md-2 col-md-offset-4\"><button id=\"new_user_button\" class=\"btn btn-default\" type=\"button\" data-toggle=\"collapse\" data-target=\"#user_form\" aria-expanded=\"false\" aria-controls=\"user_form\">New User</button></div>
									
									<div class=\"col-xs-6 col-md-2\"><button id=\"user_list_button\" class=\"btn btn-default\" type=\"button\" data-toggle=\"collapse\" data-target=\"#user_list\" aria-expanded=\"false\" aria-controls=\"user_list\">Edit User</button></div>
								</div>
				
								<div id=\"user_list\" class=\"collapse\">
								<div class=\"table-responsive\">
								<table class=\"table table-striped\">
									<thead>
										<tr>
										<th class=\"first_name\">First Name</th>
										<th class=\"last_name\">Last Name</th>
										<th class=\"email\">Email</th>
										<th class=\"title\">Title</th>
										</tr>
									</thead>
									
									<tbody></tbody>
								</table>
								</div>
								</div>";
				
				$script = "<script>
					\$(document).ready(function() {
						var field;
						var content = '';
						
						var query = db.ref('users').orderByChild('firstName');
						var uid;
				
						query.once(\"value\").then(function(snapshot) {
							snapshot.forEach(function(childSnapshot) {
								uid = childSnapshot.key;
								
								content += '<tr id=\"' + uid + '\">';
								content += '<td id=\"first_name\">' + childSnapshot.child(\"firstName\").val() + '</td>';
								content += '<td id=\"last_name\">' + childSnapshot.child(\"lastName\").val() + '</td>';
								content += '<td id=\"email\">' + childSnapshot.child(\"email\").val() + '</td>';
								content += '<td id=\"title\">' + childSnapshot.child(\"title\").val() + '</td>';
								content += '</tr>';
							});
							
							\$('table tbody').append(content);
						});
						
						/* Hide the other collapsible if it's visible. */
						$('#user_form, #user_list').on('show.bs.collapse', function() {
							if ($(this).attr('id').indexOf('user_form') != -1)
								$('#user_list').collapse('hide');
							else
								$('#user_form').collapse('hide');
						});
					});
					</script>";
			}
			else {
				$pagetitle = "";
				$content = "";
				$inner_content = $access_denied;
			}
			
			$content .= "<div class='content-top'>
				<div class='col-xs-12 col-md-8 col-md-offset-2'>
				<div class='row'>
					<div class='content-top-1'>
					<section>
					$inner_content
					$user_form
					</section>
					</div>
				</div>
				</div>
			</div>";
		break;
		
		case "profile":
			$pagetitle = "Manage Your Profile";
			$content = "<h3 class='text-center'>" . $pagetitle . "</h3>";
			
			$inner_content = "<div class='panel-group' id='profile_accordion' role='tablist' aria-multiselectable='true'>
				<div class='panel panel-default'>
				<div class='panel-heading' role='tab' id='edit_profile_heading'>
				<h4 class='panel-title'><a role='button' data-toggle='collapse' data-parent='#profile_accordion' href='#edit_profile' aria-expanded='true' aria-controls='edit_profile'>Edit Profile Information</a></h4>
				</div>

				<div id='edit_profile' class='panel-collapse collapse' role='tabpanel' aria-labelledby='edit_profile_heading'>
				<div class='panel-body'>
					$user_form
				</div>
				</div>
				</div>
				
				<div class='panel panel-default'>
				<div class='panel-heading' role='tab' id='change_email_heading'>
				<h4 class='panel-title'><a role='button' data-toggle='collapse' data-parent='#profile_accordion' href='#change_email' aria-expanded='true' aria-controls='change_email'>Change Email</a></h4>
				</div>

				<div id='change_email' class='panel-collapse collapse' role='tabpanel' aria-labelledby='change_email_heading'>
				<div class='panel-body'>
					<form id='change_email_form' method='post'>
					<div class='form-group'>					
						<div class='row'>
						<div class='col-xs-12 col-md-4'>
						<label for='email'>New Email:</label>
						<input id='email' class='form-control' type='text' name='email' size='5' />
						</div>
						<div class='col-xs-12 col-md-4'>
						<label for='email_confirm'>Confirm Email:</label>
						<input id='email_confirm' class='form-control' type='text' name='email_confirm' size='10' />
						</div>					
						</div>
					</div>
					
					<div class='form-group'>
						<div class='row'>
						<div class='col-xs-12 col-md-8'>
						<button type='submit' class='btn btn-default pull-right'>Submit</button>
						</div>
						</div>
					</div>
					</form>
				</div>
				</div>
				</div>
				
				<div class='panel panel-default'>
				<div class='panel-heading' role='tab' id='change_password_heading'>
				<h4 class='panel-title'><a role='button' data-toggle='collapse' data-parent='#profile_accordion' href='#change_password' aria-expanded='true' aria-controls='change_password'>Change Password</a></h4>
				</div>

				<div id='change_password' class='panel-collapse collapse' role='tabpanel' aria-labelledby='change_password_heading'>
				<div class='panel-body'>
					<form id='change_password_form' method='post'>
					<div class='form-group'>					
						<div class='row'>
						<div class='col-xs-12 col-md-3'>
						<label for='password'>New Password:</label>
						<input id='password' class='form-control' type='password' name='password' size='10' />
						</div>
						<div class='col-xs-12 col-md-3'>
						<label for='password_confirm'>Confirm Password:</label>
						<input id='password_confirm' class='form-control' type='password' name='password_confirm' size='10' />
						</div>						
						</div>
					</div>
					
					<div class='form-group'>
						<div class='row'>
						<div class='col-xs-12 col-md-6'>
						<button type='submit' class='btn btn-default pull-right'>Submit</button>
						</div>
						</div>
					</div>
					</form>
				</div>
				</div>
				</div>
				</div>";			
			
			$content .= "<div class='content-top'>
				<div class='col-xs-12 col-md-8 col-md-offset-2'>
				<div class='row'>
					<div class='content-top-1'>
					<section>
					$inner_content
					</section>
					</div>
				</div>
				</div>
			</div>";
		break;
		
		case "about":
			$pagetitle = "About this Site";
			$content = "<h3 class='text-center'>" . $pagetitle . "</h3>";
			$content .= "<div class='content-top'>
				<div class='col-xs-12 col-md-8 col-md-offset-2'>
				<div class='row'>
					<div class='content-top-1'>
					<section>
					<p class='text-justify'>The MyWater-Flint Administration site was developed by <a href='http://www.umflint.edu'>University of Michigan-Flint</a> to assist with research and the prioritization of relief efforts.</p>
					<p class='text-justify'>Water test data courtesy of the <a href='http://www.michigan.gov/flintwater/0,6092,7-345-76292_76294_76297---,00.html'>State of Michigan</a> and property abandonment data courtesy of the United Status Postal Service (both via UM-Ann Arbor MDST). Predicted risk results (developed using computer modeling) courtesy of UM-Ann Arbor MDST. Resource site information courtesy of <a href='http://www.flintcares.com'>Flint Cares</a>.</p>
					</section>
					</div>
				</div>
				</div>
			</div>";
		break;
		
		case "disclaimer":
			$pagetitle = "Disclaimer";
			$content = "<h3 class='text-center'>" . $pagetitle . "</h3>";
			$content .= "<div class='content-top'>
				<div class='col-xs-12 col-md-8 col-md-offset-2'>
				<div class='row'>
					<div class='content-top-1'>
						<section>
						<p class='text-justify'><strong>Any user of the MyWater-Flint data portal application (\"MyWater-Flint\") agrees to all of the following disclaimers, waives any and all claims against, and agrees to hold harmless, the Regents of the University of Michigan, its board members, officers, employees, agent and students (collectively, \"University\") with regard to any matter related to the use or the contents of MyWater-Flint.</strong></p>
			
						<p class='text-justify'>The data displayed on MyWater-Flint are provided as a public service, on an \"AS-IS\" basis, and for informational purposes only. University does not create these data, vouch for their accuracy, or guarantee that these are the most recent data available from the data provider. For many or all of the data, the data are by their nature approximate and will contain some inaccuracies. The data may contain errors introduced by the data provider(s) and/or by University. The names of counties and other locations shown in MyWater-Flint may differ from those in the original data.</p>
						
						<p class='text-justify'>University makes no warranty, representation or guaranty of any type as to any errors and omissions, or as to the content, accuracy, timeliness, completeness or fitness for any particular purpose or use of any data provided on MyWater-Flint; nor is it intended that any such warranty be implied, including, without limitation, the implied warranties of merchantability and fitness for a particular purpose.  Furthermore, University (a) expressly disclaims the accuracy, adequacy, or completeness of any data and (b) shall not be liable for any errors, omissions or other defects in, delays or interruptions in such data, or for any actions taken or not taken in reliance upon such data. Neither University nor any of its data providers will be liable for any damages relating to your use of the data provided in MyWater-Flint.</p>
						
						<p class='text-justify'>University shall reserve the right to discontinue the availability of any content on MyWater-Flint at any time and for any reason or no reason at all. The user assumes the entire risk related to its use of the data on MyWater-Flint. In no event will University be liable to you or to any third party for any direct, indirect, incidental, consequential, special or exemplary damages or lost profit resulting from any use or misuse of these data.</p>
						</section>
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
				<div class='content-top-1 hide'><canvas id='repairs_chart'></canvas></div>
				
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
						<div class='btn-group' role='group'><button id='pipes_btn' type='button' class='btn btn-default'>Pipes &amp; Construction Sites</button></div>
					</div>
					
					<div id='resource_layer_selection' class='btn-toolbar' role='group' aria-label='Resource Layer Buttons'>
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
				<div class='content-top-1'><canvas id='levels_trend'></canvas></div>
				<div class='content-top-1'><canvas id='water_tests_trend' ></canvas></div>
			</div>
		</div>";
		
		/* CHART VARIABLES */
		/* Retrieve the water test data from the database and process it. */
		if (!isset($TIME_PERIOD))
			$TIME_PERIOD = getTimePeriod();
		
		$totalTimePeriods = sizeof($TIME_PERIOD);
		
		$TIME_PERIOD = implode("', '", $TIME_PERIOD);
		$TIME_PERIOD = "['" . $TIME_PERIOD . "']";
		
		$totalLocationsTested = generateChartData("total_locations");
		$totalApprovedRepairs = generateChartData("total_approved_repairs");
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
		
			/*var repairsChart = new Chart(\$('#repairs_chart'), {
				type: 'doughnut',
				data: {
					labels: ['Approved Repairs', 'Completed Repairs'],
					datasets: [{
						data: [$totalApprovedRepairs[0], $totalApprovedRepairs[1]],
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
			});*/
			
			// change how much area the line graphs take up depending on display size
			if (windowWidth >= 1920)
				\$('#graph_area div').addClass('col-lg-6');
			else
				\$('#graph_area div').addClass('col-lg-10 col-lg-offset-1');
			
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
						fill: false,
						hidden: true
					},
					{
						label: 'Copper Action Level',
						data: $copperActionLvlData,
						borderColor: '#FF6600',
						fill: false,
						hidden: true
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
		});
		</script>";
	}
	
	$page = new webpageTemplate("includes/template.html");
	$page->set("PAGE_TITLE", " | " . $pagetitle);
	$page->set("PAGE_ID", $pid . "_page");
	$page->set("SCRIPT", $script);
	$page->set("NAVIGATION", $navigation);
	$page->set("CONTENT", $content);
	$page->create();
}
else {
	/* 
	 * Redirect the user to the login page if the page ID isn't set. 
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