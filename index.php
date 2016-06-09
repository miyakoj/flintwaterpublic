<?php

require_once "includes/template.php";

$content = "<main class='col-md-12' id='map_container'>
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
	</main>";

$page = new webpageTemplate("includes/template.html");
$page->set("PAGE_ID", "index");
$page->set("CONTENT", $content);
$page->create();