<?php

require_once "includes/template.php";

$toggles = "<nav id='toggles' class='col-md-12' data-toggle='buttons'>
				<div class='wrapper nav nav-tabs tile'>
					<div class='list'>
						<label class='btn btn-primary resource_buttons' id='heatmap_btn'><input type='checkbox' autocomplete='off' /> <span>Lead test results</span>
						</label>
						<label class='btn btn-primary resource_buttons' id='water_pickup_btn'><input type='checkbox' autocomplete='off' /><img src='../images/water_pickup_icon_white.png' class='resource_buttons_image' alt='Water Pickup Sites' /><span>Water pickup</span>
						</label>		  
						<label class='btn btn-primary resource_buttons' id='recycling_btn'><input type='checkbox' autocomplete='off' /><img src='../images/recycle_icon_white.png' class='resource_buttons_image' alt='Recycling Sites' /> <span>Water bottle recycling</span>
						</label>		  
						<label class='btn btn-primary resource_buttons' id='water_testing_btn'><input type='checkbox' autocomplete='off' /><img src='../images/lead_test_icon_white.png' class='resource_buttons_image' alt='Water Test Kits' /> <span>Water test kits</span>
						</label>	  
						<label class='btn btn-primary resource_buttons' id='blood_testing_btn'><input type='checkbox' autocomplete='off' /><img src='../images/bloodtest_icon_white.png' class='resource_buttons_image' alt='Blood Testing Sites' > <span>Blood testing</span>
						</label>	  
						<label class='btn btn-primary resource_buttons' id='water_filters_btn'><input type='checkbox' autocomplete='off' /><img src='../images/water_filter_icon_white.png' class='resource_buttons_image' alt='Water Filters Sites' /> <span>Water filter pickup</span>
						</label>		  
						<label class='btn btn-primary resource_buttons' id='pipes_btn'><input type='checkbox' autocomplete='off' /><img src='../images/pipes_icon_white.png' class='resource_buttons_image' alt='Pipe Info' /> <span>Pipe info</span>
						</label>
					</div> 
				</div>
			</nav>";
//<img src='../images/lead_info_icon_white.png' class='resource_buttons_image' alt='Latest Lead Levels' />
$content = "<div id='map_container'>
		<input id='search_input' class='controls' type='text' placeholder='Search for a location' />
		
		<div id='location_card' class='card'>
			<button type='button' class='close' aria-label='Close'><span class='icon' aria-hidden='true'>close</span></button>
			
			<div class='card-main'>
				<div class='card-inner'></div>
				
				<div class='card-action'>
					<button type='button' id='card_save' class='btn btn-flat pull-left' data-toggle='tooltip' data-placement='top' title='Save Location'>
					<span class='icon icon-lg'>star_border</span> <span>Save</span></button>
					
					<button type='button' id='more_info_button' class='btn btn-flat pull-right' data-toggle='collapse' data-target='#more_info_details' aria-expanded='false' aria-controls='more_info_details'><span>More Info</span></button>
				</div>
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
		</div>
		
		<div id='legend_card' class='card'>
			<div class='card-main'>
				<div class='card-inner'></div>
			</div>
		</div>
	</div>";

$page = new webpageTemplate("includes/template.html");
$page->set("PAGE_TITLE", "");
$page->set("PAGE_ID", "index_page");
$page->set("TOGGLES", $toggles);
$page->set("CONTENT", $content);
$page->create();