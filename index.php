<?php

require_once "includes/template.php";

/*<!---->*/

$toggles = "<nav id='toggles' class='col-md-12' data-toggle='buttons'>
				<div class='wrapper nav nav-tabs tile'>
					<div class='list'>
						<label class='btn btn-primary resource_buttons' id='heatmap_btn'><input type='checkbox' autocomplete='off' /><img src='../images/leadinfoicon.png' class='resource_buttons_image' alt='Latest Lead Levels' /> <span>Lead Levels</span>
						</label>
						<label class='btn btn-primary resource_buttons' id='risk_factor_btn'><input type='checkbox' autocomplete='off' /><img src='../images/riskinfoicon.png' class='resource_buttons_image' alt='Predicted Levels' /> <span>Predicted Levels</span>
						</label>
						<label class='btn btn-primary resource_buttons' id='water_pickup_btn'><input type='checkbox' autocomplete='off' /><img src='../images/waterpickupicon.png' class='resource_buttons_image' alt='Water Pickup Sites' /><span>Water Pickup</span>
						</label>		  
						<label class='btn btn-primary resource_buttons' id='recycling_btn'><input type='checkbox' autocomplete='off' /><img src='../images/recycleicon.png' class='resource_buttons_image' alt='Recycling Sites' /> <span>Recycling</span>
						</label>		  
						<label class='btn btn-primary resource_buttons' id='water_testing_btn'><input type='checkbox' autocomplete='off' /><img src='../images/leadtesticon.png' class='resource_buttons_image' alt='Water Test Kits' /> <span>Water Test Kits</span>
						</label>	  
						<label class='btn btn-primary resource_buttons' id='blood_testing_btn'><input type='checkbox' autocomplete='off' /><img src='../images/bloodtesticon.png' class='resource_buttons_image' alt='Blood Testing Sites' > <span>Blood Testing</span>
						</label>	  
						<label class='btn btn-primary resource_buttons' id='water_filters_btn'><input type='checkbox' autocomplete='off' /><img src='../images/waterfiltericon.png' class='resource_buttons_image' alt='Water Filters Sites' /> <span>Water Filters</span>
						</label>		  
						<label class='btn btn-primary resource_buttons' id='pipes_btn'><input type='checkbox' autocomplete='off' /><img src='../images/constructionicon.png' class='resource_buttons_image' alt='Pipe Info' /> <span>Pipe Info</span>
						</label>
					</div> 
				</div>
			</nav>";

$content = "<div id='map_container'>
		<input id='search_input' class='controls' type='text' placeholder='Search for an address' />
		
		<div id='location_card' class='card'>
			<button type='button' class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
			
			<div class='card-main'>
				<div class='card-inner'></div>
				<div class='card-action'>
					<!--<div id='location_buttons' class='btn-group' role='group' aria-label='Location Info Buttons'>
						<button id='saved_location_button' type='button' class='btn btn-flat btn-brand'><img src='images/savedlocation.png' /> <span></span></button>
						<button id='more_info_button' type='button' class='btn btn-flat btn-brand'><img src='images/moreinfo.png' /> <span>More Info</span></button>
					</div>-->
					
					<button id='card_save' class='btn btn-flat pull-right' data-toggle='tooltip' data-placement='top' title='Save Location'><span class='sr-only sr-only-focusable'>Save</span>
					<span class='material-icons'>star_border</span></button>
					
					<button id='more_info_button' class='btn btn-flat pull-right' data-toggle='tooltip' data-placement='top' title='More Information'><span class='sr-only sr-only-focusable'>More Info</span>
					<span class='material-icons'>info_outline</span></button>
				</div>
			</div>
		</div>

		<div id='resource_card' class='card'>
			<div class='card_main'>
				<div class='card-inner'>
					<div><h4 id='title'></h4> <div id='address'></div></div>
					<div><p id='hours'></p> <p id='resources'></p> <p id='notes'></p></div>
				 </div>
				<div class='card-action'>
					<button id='card_directions' class='btn btn-flat pull-left' data-toggle='tooltip' data-placement='top' title='Get Directions'>Get Directions</button>
					
					<!--<button id='card_directions' class='btn btn-flat pull-left' data-toggle='tooltip' data-placement='top' title='Get Directions'><span class='sr-only sr-only-focusable'>Get Directions</span><span class='material-icons'>directions</span></button>-->
					
					<ul id='card_report_menu' class='btn btn-flat pull-right' data-toggle='tooltip' data-placement='top' title='Report an Inaccuracy'>
					    <li class='dropdown'>
						<a id='report_button' class='dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><span class='sr-only sr-only-focusable'>Report an Inaccuracy</span>
						<span class='material-icons'>error</span></a>
					    <ul class='dropdown-menu dropdown-menu-right' aria-labelledby='report_button'>
					        <li><a href='#'>Temporarily Closed</a></li>
					        <li><a href='#'>Permanently Closed</a></li>
					        <li><a href='#'>Doesn't Have Water</a></li>
					        <li><a href='#'>Doesn't Have Water Filters</a></li>
					        <li><a href='#'>Doesn't have Test Kits</a></li>
							<li><a href='#'>Doesn't Perform Blood Testing</a></li>
					    </ul>
						</li>
					</ul>
					
					<button id='card_save' class='btn btn-flat pull-right' data-toggle='tooltip' data-placement='top' title='Save Location'><span class='sr-only sr-only-focusable'>Save</span><span class='material-icons'>star_border</span></button>
				</div>
			</div>
		</div>
	</div>";

$page = new webpageTemplate("includes/template.html");
$page->set("PAGE_TITLE", "");
$page->set("PAGE_ID", "index_page");
$page->set("TOGGLES", $toggles);
$page->set("CONTENT", $content);
$page->create();