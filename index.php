<?php

//include_once "languages.php";
require_once "includes/template.php";

$toggles = "<nav id=\"toggles\" class=\"btn-group btn-group-justified\" data-toggle=\"buttons\">
		  <label class=\"btn btn-primary resource_buttons\" id=\"heatmap_btn\">
		    <input type=\"checkbox\" autocomplete=\"off\" /><img src=\"images/leadinfoicon.png\" class=\"resource_buttons_image\" alt=\"{LEAD_ALT_TEXT}\" /> <span>{LEAD_TEXT}</span>
		  </label>
		  <label class=\"btn btn-primary resource_buttons\" id=\"risk_factor_btn\">
		    <input type=\"checkbox\" autocomplete=\"off\" /><img src=\"images/riskinfoicon.png\" class=\"resource_buttons_image\" alt=\"{RISK_ALT_TEXT}\" /> <span>{RISK_TEXT}</span>
		  </label>
		  <label class=\"btn btn-primary resource_buttons\" id=\"water_pickup_btn\">
		    <input type=\"checkbox\" autocomplete=\"off\" /><img src=\"images/waterpickupicon.png\" class=\"resource_buttons_image\" alt=\"{WATER_PICKUP_ALT_TEXT}\" /> <span>{WATER_PICKUP_TEXT}</span>
		  </label>
		  <label class=\"btn btn-primary resource_buttons\" id=\"recycling_btn\">
		    <input type=\"checkbox\" autocomplete=\"off\" /><img src=\"images/recycleicon.png\" class=\"resource_buttons_image\" alt=\"{RECYCLING_ALT_TEXT}\" /> <span>{RECYCLING_TEXT}</span>
		  </label>
		  <label class=\"btn btn-primary resource_buttons\" id=\"water_testing_btn\">
		    <input type=\"checkbox\" autocomplete=\"off\" /><img src=\"images/leadtesticon.png\" class=\"resource_buttons_image\" alt=\"{WATER_TESTING_ALT_TEXT}\" /> <span>{WATER_TESTING_TEXT}</span>
		  </label>
		  <label class=\"btn btn-primary resource_buttons\" id=\"blood_testing_btn\">
		    <input type=\"checkbox\" autocomplete=\"off\" /><img src=\"images/bloodtesticon.png\" class=\"resource_buttons_image\" alt=\"{BLOOD_TESTING_ALT_TEXT}\" > <span>{BLOOD_TESTING_TEXT}</span>
		  </label>
		  <label class=\"btn btn-primary resource_buttons\" id=\"water_filters_btn\">
		    <input type=\"checkbox\" autocomplete=\"off\" /><img src=\"images/waterfiltericon.png\" class=\"resource_buttons_image\" alt=\"{WATER_FILTERS_ALT_TEXT}\" /> <span>{WATER_FILTERS_TEXT}</span>
		  </label>
		  <label class=\"btn btn-primary resource_buttons\" id=\"pipes_btn\">
		    <input type=\"checkbox\" autocomplete=\"off\" /><img src=\"images/pipesicon.png\" class=\"resource_buttons_image\" alt=\"{VIEW_PIPES_ALT_TEXT}\" /> <span>{VIEW_PIPES_TEXT}</span>
		  </label>
		</nav>";

$content = "<div id=\"map_container\">
		<div id=\"location_card\" class=\"card\">
			<div class=\"card-main\">
				<div class=\"card-inner\"></div>
				<div class=\"card-action\">
					<div id=\"location_buttons\" class=\"btn-group\" role=\"group\" aria-label=\"{LOCATION_CARD_LABEL}\">
						<button id=\"saved_location_button\" type=\"button\" class=\"btn btn-flat btn-brand\"><img src=\"images/savedlocation.png\" /> <span></span></button>
						<button id=\"more_info_button\" type=\"button\" class=\"btn btn-flat btn-brand\">
						<span>{MORE_INFO_TEXT}</span></button>
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