<?php

require_once "includes/template.php";

$toggles = "<nav id='toggles' class='btn-group btn-group-justified' data-toggle='buttons'>
		  <label class='btn btn-primary active resource_buttons btn-brand' name='heatmap'>
		    <input type='checkbox' autocomplete='off' /><img src='images/leadicon.png' class='resource_buttons_image' /> <span>Lead Levels</span>
		  </label>
		  <label class='btn btn-primary resource_buttons btn-brand' name='risk_factor'>
		    <input type='checkbox' autocomplete='off' /><img src='images/predictedleadtesticon.png' class='resource_buttons_image' /> <span>Risk Factor</span>
		  </label>
		  <label class='btn btn-primary resource_buttons btn-brand' name='water_pickup'>
		    <input type='checkbox' autocomplete='off' /><img src='images/waterpickupicon.png' class='resource_buttons_image' /> <span>Water Pickup</span>
		  </label>
		  <label class='btn btn-primary resource_buttons btn-brand' name='recycling'>
		    <input type='checkbox' autocomplete='off' /><img src='images/recycleicon.png' class='resource_buttons_image' /> <span>Recycling</span>
		  </label>
		  <label class='btn btn-primary resource_buttons btn-brand' name='water_testing'>
		    <input type='checkbox' autocomplete='off' /><img src='images/leadtesticon.png' class='resource_buttons_image' /> <span>Water Testing</span>
		  </label>
		  <label class='btn btn-primary resource_buttons btn-brand' name='blood_testing'>
		    <input type='checkbox' autocomplete='off' /><img src='images/bloodtesticon.png' class='resource_buttons_image'> <span>Blood Testing</span>
		  </label>
		  <label class='btn btn-primary resource_buttons btn-brand' name='water_filters'>
		    <input type='checkbox' autocomplete='off' /><img src='images/waterfiltericon.png' class='resource_buttons_image' /> <span>Water Filters</span>
		  </label>
		  <label class='btn btn-primary resource_buttons btn-brand' name='construction'>
		    <input type='checkbox' autocomplete='off' /><img src='images/constructionicon.png' class='resource_buttons_image' /> <span>Construction</span>
		  </label>
		</nav>";

$content = "<div id='map_container'>
		<div id='location_card' class='card'>
			<div class='card-main'>
				<div class='card-inner'></div>
				<div class='card-action'>
					<div id='location_buttons' class='btn-group' role='group' aria-label='Location Info Buttons'>
						<button id='saved_location_button' type='button' class='btn btn-flat btn-brand'><img src='images/savedlocation.png' /> <span></span></button>
						<button id='more_info_button' type='button' class='btn btn-flat btn-brand'><img src='images/moreinfo.png' /> 
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