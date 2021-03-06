<?php

require_once "includes/template.php";

/*<!--<label class='btn btn-primary resource_buttons' id='risk_factor_btn'><input type='checkbox' autocomplete='off' /><img src='../images/riskinfoicon.png' class='resource_buttons_image' alt='View Main Pipes' /> <span>Risk Factor</span>
						</label>-->*/

$toggles = "<nav id='toggles' class='col-md-12' data-toggle='buttons'>
			<div class='scroller scroller-left'><span class='glyphicon glyphicon-chevron-left'></span></div>
				<div class='wrapper nav nav-tabs tile'>
					<div class='list'>
						<label class='btn btn-primary resource_buttons' id='heatmap_btn'><input type='checkbox' autocomplete='off' /><img src='../images/leadinfoicon.png' class='resource_buttons_image' alt='Latest Lead Levels' /> <span>Lead Levels</span>
						</label>
						<label class='btn btn-primary resource_buttons' id='water_pickup_btn'><input type='checkbox' autocomplete='off' /><img src='../images/waterpickupicon.png' class='resource_buttons_image' alt='Water Pickup Sites' /><span>Water Pickup</span>
						</label>		  
						<label class='btn btn-primary resource_buttons' id='recycling_btn'><input type='checkbox' autocomplete='off' /><img src='../images/recycleicon.png' class='resource_buttons_image' alt='Recycling Sites' /> <span>Recycling</span>
						</label>		  
						<label class='btn btn-primary resource_buttons' id='water_testing_btn'><input type='checkbox' autocomplete='off' /><img src='../images/leadtesticon.png' class='resource_buttons_image' alt='Water Testing Sites' /> <span>Water Testing</span>
						</label>	  
						<label class='btn btn-primary resource_buttons' id='blood_testing_btn'><input type='checkbox' autocomplete='off' /><img src='../images/bloodtesticon.png' class='resource_buttons_image' alt='Blood Testing Sites' > <span>Blood Testing</span>
						</label>	  
						<label class='btn btn-primary resource_buttons' id='water_filters_btn'><input type='checkbox' autocomplete='off' /><img src='../images/waterfiltericon.png' class='resource_buttons_image' alt='Water Filters Sites' /> <span>Water Filters</span>
						</label>		  
						<label class='btn btn-primary resource_buttons' id='pipes_btn'><input type='checkbox' autocomplete='off' /><img src='../images/constructionicon.png' class='resource_buttons_image' alt='Pipe Info' /> <span>Pipe Info</span>
						</label>
					</div>
				<div class='scroller scroller-right'><span class='glyphicon glyphicon-chevron-right'></span></div>	 
			</div>
			</nav>";

$content = "<div id='map_container'>
		<div id='location_card' class='card'>
			<div class='card-main'>
				<div class='card-inner'></div>
				<div class='card-action'>
					<div id='location_buttons' class='btn-group' role='group' aria-label='Location Info Buttons'>
						<button id='saved_location_button' type='button' class='btn btn-flat btn-brand'><img src='images/savedlocation.png' /> <span></span></button>
						<button id='more_info_button' type='button' class='btn btn-flat btn-brand'><img src='images/moreinfo.png' /> <span>More Info</span></button>
					</div>
				</div>
			</div>
		</div>

		<div id='resource_card' class='card'>
			<div class='card_main'>
				<div class='card-inner'>
					<h5> Resource Title </h5>
					<p> address </p>
					<p> notes </p>
					<p> hours </p>
					<p> available resources </p>
				 </div>
				<div class='card-action'>
					<button class='btn btn-flat'>  Get Directions </button>
					<button class='btn btn-flat'> <img src='../images/ic_star.png'/> </button>
					<div class='dropdown'>
					    <a class='dropdown-toggle' data-toggle='dropdown'> <img src='../images/ic_report.png'/></a>
					    <ul class='dropdown-menu'>
					        <li>
					            <a> Temporarily Closed </a>
					        </li>
					        <li>
					            <a> Permanently Closed </a>
					        </li>
					        <li>
					            <a> Doesn't Have Water </a>
					        </li>
					        <li>
					            <a> Doesn't Have Water Filters</a>
					        </li>
					        <li>
					            <a> Doesn't have Test Kits </a>
					        </li>
					    </ul>
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