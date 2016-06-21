<?php

require_once "includes/template.php";

$toggles = "<nav id='toggles' class='btn-group btn-group-justified' data-toggle='buttons'>
		  <label class='btn btn-primary resource_buttons' id='heatmap_btn'>
		    <input type='checkbox' autocomplete='off' /><img src='images/leadinfoicon.png' class='resource_buttons_image' alt='Latest Lead Levels' /> <span>Lead Levels</span>
		  </label>
		  <label class='btn btn-primary resource_buttons' id='pipes_btn'>
		    <input type='checkbox' autocomplete='off' /><img src='images/riskinfoicon.png' class='resource_buttons_image' alt='View Main Pipes' /> <span>View Pipes</span>
		  </label>
		  <label class='btn btn-primary resource_buttons' id='water_pickup_btn'>
		    <input type='checkbox' autocomplete='off' /><img src='images/waterpickupicon.png' class='resource_buttons_image' alt='Water Pickup Sites' /> <span>Water Pickup</span>
		  </label>
		  <label class='btn btn-primary resource_buttons' id='recycling_btn'>
		    <input type='checkbox' autocomplete='off' /><img src='images/recycleicon.png' class='resource_buttons_image' alt='Recycling Sites' /> <span>Recycling</span>
		  </label>
		  <label class='btn btn-primary resource_buttons' id='water_testing_btn'>
		    <input type='checkbox' autocomplete='off' /><img src='images/leadtesticon.png' class='resource_buttons_image' alt='Water Testing Sites' /> <span>Water Testing</span>
		  </label>
		  <label class='btn btn-primary resource_buttons' id='blood_testing_btn'>
		    <input type='checkbox' autocomplete='off' /><img src='images/bloodtesticon.png' class='resource_buttons_image' alt='Blood Testing Sites' > <span>Blood Testing</span>
		  </label>
		  <label class='btn btn-primary resource_buttons' id='water_filters_btn'>
		    <input type='checkbox' autocomplete='off' /><img src='images/waterfiltericon.png' class='resource_buttons_image' alt='Water Filters Sites' /> <span>Water Filters</span>
		  </label>
		  <label class='btn btn-primary resource_buttons' id='construction_btn'>
		    <input type='checkbox' autocomplete='off' /><img src='images/constructionicon.png' class='resource_buttons_image' alt='Construction Sites' /> <span>Construction</span>
		  </label>
		</nav>";
		
/*<label class='btn btn-primary resource_buttons' id='risk_factor_btn'>
		    <input type='checkbox' autocomplete='off' /><img src='images/riskinfoicon.png' class='resource_buttons_image' alt='Lead Risk Factor' /> <span>Risk Factor</span>
		  </label>*/

$content = "<div id='map_container'>
		<div id='location_card' class='card'>
			<div class='card-main'>
				<div class='card-inner'></div>
				<div class='card-action'>
					<div id='location_buttons' class='btn-group' role='group' aria-label='Location Info Buttons'>
						<button id='saved_location_button' type='button' class='btn btn-flat btn-brand'><img src='images/savedlocation.png' /> <span></span></button>
						<button id='more_info_button' type='button' class='btn btn-flat btn-brand'>
						<span>More Info</span></button>
					</div>
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