<?php

require_once "includes/template.php";

$toggles = "<nav id='toggles' class='col-md-12' data-toggle='buttons'>
				<div class='wrapper nav nav-tabs tile'>
					<div class='list'>
						<label class='btn btn-primary resource_buttons' id='heatmap_btn'><input type='checkbox' autocomplete='off' /> <span data-i18n='toggles.testResults'></span>
						</label>
						<label class='btn btn-primary resource_buttons' id='water_pickup_btn'><input type='checkbox' autocomplete='off' /><img src='../images/water_pickup_icon_white.png' class='resource_buttons_image' data-i18n='[alt]toggles.waterAlt' /><span data-i18n='toggles.water'></span>
						</label>		  
						<label class='btn btn-primary resource_buttons' id='recycling_btn'><input type='checkbox' autocomplete='off' /><img src='../images/recycle_icon_white.png' class='resource_buttons_image' data-i18n='[alt]toggles.recyclingAlt' /> <span data-i18n='toggles.recycling'></span>
						</label>		  
						<label class='btn btn-primary resource_buttons' id='water_testing_btn'><input type='checkbox' autocomplete='off' /><img src='../images/lead_test_icon_white.png' class='resource_buttons_image' data-i18n='[alt]toggles.waterTestingAlt' /> <span data-i18n='toggles.waterTesting'></span>
						</label>	  
						<label class='btn btn-primary resource_buttons' id='blood_testing_btn'><input type='checkbox' autocomplete='off' /><img src='../images/bloodtest_icon_white.png' class='resource_buttons_image' data-i18n='[alt]toggles.bloodTestingAlt' /> <span data-i18n='toggles.bloodTesting'></span>
						</label>	  
						<label class='btn btn-primary resource_buttons' id='water_filters_btn'><input type='checkbox' autocomplete='off' /><img src='../images/water_filter_icon_white.png' class='resource_buttons_image' data-i18n='[alt]toggles.filtersAlt' /> <span data-i18n='toggles.filters'></span>
						</label>		  
						<label class='btn btn-primary resource_buttons' id='pipes_btn'><input type='checkbox' autocomplete='off' /><img src='../images/pipes_icon_white.png' class='resource_buttons_image' data-i18n='[alt]toggles.pipesAlt' /> <span data-i18n='toggles.pipes'></span>
						</label>
					</div> 
				</div>
			</nav>";
//<img src='../images/lead_info_icon_white.png' class='resource_buttons_image' alt='Latest Lead Levels' />
$content = "<div id='map_container'>
		<input id='search_input' class='controls' type='text' data-i18n='[placeholder]map.searchText' />
		
		<div id='location_card' class='card'>
			<button type='button' class='close' aria-label='Close'><span class='icon' aria-hidden='true'>close</span></button>
			
			<div class='card-main'>
				<div class='card-inner'></div>
				
				<div class='card-action'>
					<button type='button' id='card_save' class='btn btn-flat pull-left' data-toggle='tooltip' data-placement='top' data-i18n='[title]map.saveBtnTitle'>
					<span class='icon icon-lg'>star_border</span> <span data-i18n='map.saveBtnText'></span></button>
					
					<button type='button' id='more_info_button' class='btn btn-flat pull-right' data-toggle='collapse' data-target='#more_info_details' aria-expanded='false' aria-controls='more_info_details'><span data-i18n='locationCard.infoBtnText'></span></button>
				</div>
			</div>
		</div>

		<div id='resource_card' class='card'>
			<button type='button' class='close' aria-label='Close'><span class='icon' aria-hidden='true'>close</span></button>
			
			<div class='card-main'>				
				<div class='card-inner'></div>
				
				<div class='card-action'>
					<button id='card_save' class='btn btn-flat pull-left' data-toggle='tooltip' data-placement='top' data-i18n='[title]map.saveBtnTitle'><span class='icon icon-lg'>star_border</span> <span data-i18n='map.saveBtnText'></span></button>
					
					<ul id='card_report_menu' class='btn btn-flat pull-left' data-toggle='tooltip' data-placement='top' data-i18n='[title]resourceCard.reportText'>
					    <li>
							<div class='dropdown'>
							<a id='report_button' class='btn btn-flat dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
							<span class='icon icon-lg'>error</span> <span data-i18n='resourceCard.reportBtnText'></span></a>
							
							<ul class='dropdown-menu dropdown-menu-right' aria-labelledby='report_button'>
								<li><a href='#' data-i18n='resourceCard.tempClosed'></a></li>
								<li><a href='#' data-i18n='resourceCard.permClosed'></a></li>
								<li><a href='#' data-i18n='resourceCard.noWater'></a></li>
								<li><a href='#' data-i18n='resourceCard.noFilters'></a></li>
								<li><a href='#' data-i18n='resourceCard.noTestKits'></a></li>
								<li><a href='#' data-i18n='resourceCard.noRecycling'</a></li>
								<li><a href='#' data-i18n='resourceCard.noBloodTesting'></a></li>
							</ul>
							</div>
						</li>
					</ul>
					
					<button id='card_directions' class='btn btn-flat pull-right' data-i18n='resourceCard.directionsBtnText'></button>
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