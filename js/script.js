var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var $pageId = $("body").attr("id").slice(0, $("body").attr("id").indexOf("_"));
console.log("$pageId = " + $pageId);
var $activeNode;
var autocomplete;

/* Encourage a user of IE to download an alternate browser.
   (IE doesn't support the Web Audio API but Firefox/Chrome/Safari (desktop & mobile versions) all do.) */
if (!Modernizr.webaudio && !localStorage.getItem("browserMsg")) {
	$("#page_alert button").after("You are using an unsupported browser. We recommend using Firefox 45.3+ or Chrome 53+ for the best experience.");
	$("#page_alert").addClass("alert-info").show();
	localStorage.setItem("browserMsg", "1");
}

/* Dynamically load remote scripts only on pages where they're relevant. */
var map_api = "https://maps.googleapis.com/maps/api/js?key=AIzaSyA0qZMLnj11C0CFSo-xo6LwqsNB_hKwRbM&libraries=visualization,places";
//<script src="https://maps.googleapis.com/maps/api/js?client=gme-regentsoftheuniversity&libraries=visualization,places" async defer></script>
var client_api = "https://apis.google.com/js/client.js?onload=setAPIKey";
//var jquery_form_api = "http://malsup.github.io/min/jquery.form.min.js";
var form_validation_api = "https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/jquery.validate.min.js";
var form_validation_addl_js = "https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/additional-methods.min.js";
//var google_js_api = "https://www.google.com/jsapi";
var feed_api = "https://cdn.rawgit.com/sekando/feednami-client/master/releases/1.0.2.min.js";

if (($pageId.indexOf("index") != -1) || ($pageId.indexOf("report") != -1) || ($pageId.indexOf("test") != -1)) {
	// show a loading screen until the map has loaded
	//if ($pageId.indexOf("index") != -1)
		//$("#loading_screen").removeClass("hide");
	
	$.ajax({
		type: "GET",
		url: map_api,
		dataType: "script",
		cache: true
	});
	
	$.ajax({
		type: "GET",
		url: client_api,
		dataType: "script",
		cache: true
	});
}


$(document).ready(function() {
	// fix the AJAX linebreaks problem
	$.valHooks.textarea = {
	  get: function( elem ) {
		return elem.value.replace( /\r?\n/g, "\r\n" );
	  }
	};
		
	/* Position alert in the middle of the page. */
	$("#page_alert").css({
		"top": function() {
			return this.top = (windowHeight - $(".alert").height()) / 2;
		},
		"left": function() {
			return this.left = (windowWidth - $(".alert").width()) / 2;
		}
	});
	
	/* Position the spinner based upon the size of the screen. */
	$(".loader").css("margin-top", windowHeight/2 - $(".loader").height()/2 + "px");
	
	/* Activate tooltips. */
	$(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});
	
	/* Dynamically adjust the dropdown menu links. */
	$(".dropdown-menu a").css("line-height", $(".dropdown-menu a").css("min-height"));
	//$("#language_menu .dropdown-toggle").css("width", $("#language_menu .dropdown-menu").css("min-width"));
	$("#header_top #language_menu .dropdown-menu").css("min-width", $("#header_top #language_menu").css("min-width"));
	
	/* Scale the popup markers based on screen size. */
	if (($pageId.indexOf("index") != -1) && ($pageId.indexOf("test") != -1) && $pageId.indexOf("report") != -1)
		$(".marker_popup_icons").css({"width": iconSize + "px", "height": "auto"});
	
	/* Dynamically generate page links. */
	var id;
	var page;
	
	$("#main_menu a").each(function(i) {
		id = $(this).attr("id");
		var dropdown = $(this).siblings(".dropdown-menu");
		
		/* If the dropdown is a sibling of the current <a> then generate the links for the items. */
		if (dropdown.length > 0) {
			dropdown.each(function () {
				id = dropdown.find("a").attr("id");
				page = id.slice(0, id.indexOf("_"));
				$(this).attr("href", "page.php?pid=" + page);
			});
		}
		else {
			if (id.indexOf("link") != -1) {
				page = id.slice(0, id.indexOf("_"));

				if (page != "map")
					$(this).attr("href", "page.php?pid=" + page);
				else
					$(this).attr("href", "index.php");
			}
			/*else if (id.indexOf("lang") != -1) {
				page = id.slice(id.indexOf("_") + 1, id.length);
				$(this).attr("href", page);
			}*/
		}
	});
	
	//set toggles width based on number of toggles
	var numItems = 7;
	var average;
	average = windowWidth/numItems;
	$('#toggles label').css("width", average);
	
	$("footer #copyright a").each(function(i) {		
		if ($(this).attr("id").indexOf("contact_us") == -1) { //($(this).attr("href").length == 1)
			id = $(this).attr("id");
			page = id.slice(0, id.indexOf("_"));
			$(this).attr("href", "page.php?pid=" + page);
		}
	});
	
	/* Launch the contact form in a modal. */
	$("footer #contact_us").on("click", function() {
		$('#contact_form').modal("toggle")
	});
	
	
	/* Mark the tab of the current page as active. */
	if ($pageId.indexOf("index") != -1)
		$("#map_link").parent().addClass("active");
	else {
		$("#" + $pageId + "_link").parent().addClass("active");
		
		// if the linked clicked is in the "show me" dropdown then also make the "show me" tab active
		if ($("#" + $pageId + "_link").parent().parent().parent().attr("id") == "show_me_menu")
			$("#show_me_menu").addClass("active");
	}
	
	/* General layout/CSS differences between the mobile and desktop versions. */
	/* Phones and small tablets. */
	if (windowWidth < 600) {
		$("#location_card, #resource_card").appendTo($("body"));
		$("#legend_card").appendTo($("map-container"));
		
		$("#resource_card #card_report_menu").on("click", function() {
			$(this).find("li:first-child").addClass("dropup open");
			$(this).find("#report_button").attr("aria-expanded", "true");
		});
	}
	/* Large tablets and computers. */
	else if (windowWidth >= 600) {
		$("#location_card, #resource_card").css({
			"width": function() {
				return $("#search_input").outerWidth();
			},
			"top": function() {
				return parseInt($("#search_input").css("top")) + $("#search_input").outerHeight(true) + 10 + "px";
			},
			"left": function() {
				return parseInt($("#search_input").css("left")) + parseInt($("#search_input").css("margin-left")) + "px";
			}
		});
		
		$("#legend_card").css({
			"width": function() {
				return $("#location_card").outerWidth();
			},
			"top": function() {
				return parseInt($("#search_input").css("top")) + $("#search_input").outerHeight(true) + 10 + "px";
			},
			"left": function() {
				return parseInt($("#location_card").css("left")) + parseInt($("#location_card").css("margin-left")) + "px";
			}
		});
	}
	
	$("#legend_card").hide();
	
	if (windowWidth < 768) {
		//closes the nav drawer when you click outside of it
		$("body").click(function(){
			if($(".navbar").hasClass("slide-active")){
				$("#page_content, .navbar, body, .navbar-header, .navbar-toggle").toggleClass("slide-active");
				$("#main_menu li").removeClass("active");
				$(".navbar-header, #page_content").css("left", "0px");
				$("#main_menu").css("left", "-100%");
			}
		}).on("click", "#main_menu, .navbar-toggle, .modal", function(event) {
			event.stopPropagation();
		});
		
		/* Set a fixed height for the main menu so that the overflow scrolls. */
		$("#main_menu").height(windowHeight);
		
		/* Increase the window height of #page_content to prevent the #main_menu from being cut off. */
		$("#page_content").css("height", windowHeight+"px");
	}
	else
		$("#page_content").css("height", "auto");
	
	/* Layout mods for differences between desktop and mobile for the "show me" pages.	
	/* Size the map/video area depending on the height of the device. */	   
	if (windowHeight < 800)
		$("#topbar").css("height", "20em");
	else
		$("#topbar").css("height", "30em");
	
	if (($pageId.indexOf("index") == -1) && ($pageId.indexOf("news") == -1) && ($pageId.indexOf("about") == -1))
		$activeNode = $(".stepper-vert-inner").find($("div[class*='active']"));
	//else for the index, news, and about pages
	
	
	/* Phones and small tablets. */
	if (windowWidth < 768) {
		$("#main_menu").append($("#made_in_Flint"), $("#google_play_link"), $("footer"));
		//$("#header").append($("#contact_form"));
		
		$("#made_in_Flint img").css({
			"margin-left": "auto",
			"margin-right": "auto"		
		});
		
		$("#google_play_link img").addClass("center-block");
		
		$("#main_menu .nav").removeClass("nav-justified");
		$("#show_me_menu").removeClass("dropdown");
		$("#show_me_menu ul").removeClass("dropdown-menu");
		
		/* Move the map and help videos above the steppers for phone/small tablet. */
		$("#sidebar").addClass("hide");
		$("#topbar").prepend($("#map"));
		
		if ($pageId.indexOf("filter") != -1) {
			$("#topbar").css("height", "auto");
			
			$(".help_video").each(function() {
				$(this).prependTo($("#topbar"))
			});
		}
		else
			$(".help_video").prependTo($("#topbar"));
		
		/* Apply the initial abbreviated stepper layout for mobile. */
		$(".cancel_button").addClass("hide");
		
		$("#stepper_content").addClass("brief");
		$("#stepper_content h2").css({
			"font-size": "15px",
			"font-weight": "bold"
		});
		$("#stepper_content ul").css({
			"margin-bottom": "0",
			"padding-left": "0"
		});
		$("#stepper_content ul li").css("display", "none");
		$("#stepper_content ul li:first-child").css({
			"white-space": "nowrap",
			"overflow": "hidden",
			"text-overflow": "ellipsis",
			"display": "list-item"
		});
		$("#stepper_content .btn_group").css({
			"margin-top": "0",
			"text-align": "right"
		});
		//$(".stepper-vert .:after, .stepper-vert .stepper:before").addClass("cancel_stepper_border");
		
		$("div[id$='step1_content'] .btn_group").append("<img class='progress_img center-block' src='images/stepper1.png' />");
		$("div[id$='step2'], div[id$='step3']").addClass("hide");
		
		$("div[id$='step1'], div[id$='step2'], div[id$='step3']").css({
			"padding-top": "10px",
			"padding-bottom": "10px"
		});
		
		
		/*if ($pageId.indexOf("filter") == -1) {
			$(".back_button").css({
				"padding": "0",
				"position": "absolute",
				"top": "0",
				"left": "0"
			}).removeClass("btn-primary").prepend("<span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span> ");
			
			$(".next_button").css({
				"padding": "0",
				"position": "absolute",
				"top": "0",
				"right": "0"
			}).removeClass("btn-primary").append(" <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>");
		}
		else {*/
		/*	$("div[id$='step2_content'] .back_button, div[id$='step3_content'] .back_button").css({
				"padding": "0",
				"position": "absolute",
				"top": "0",
				"left": "0"
			}).removeClass("btn-primary").prepend("<span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span> ");*/
			
			$("div[id$='step1_content'] .next_button, div[id$='step2_content'] .next_button, div[id$='step3_content'] .next_button").css({
				"padding": "0",
				"position": "absolute",
				"top": "0",
				"right": "0"
			}).removeClass("btn-primary").append(" <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>");
			
		//}
		
		/* Unhide all step titles when the steppers are expanded and modify appearance of buttons. */
		$("div[id*='step1'], div[id*='step2'], div[id*='step3']").parent().parent().on("click", function() {
			if ($("#stepper_content").hasClass("brief")) {
				var $steppers = $(this).find("div[id*='step']");
				var $total_active = $(this).find("div[class*='active']").length;
				
				/* Mark previous steps as "done". */
				$steppers.each(function(i) {
					if (i < ($total_active-1)*2) {
						if ((i % 2) == 0)
							$(this).removeClass("active").addClass("done");
					}
					else {
						$activeNode = $(this);
						return false;
					}
				});
				
				$("#stepper_content").removeClass("brief").addClass("expanded");
				$("div[id$='step1'], div[id$='step2'], div[id$='step3'], #stepper_content h2, #stepper_content ul, #stepper_content ul li, .stepper-vert-content, #stepper_content .btn_group, #stepper_content .next_button").removeAttr("style");
				$("div[id*='step1'], div[id*='step2'], div[id*='step3']").removeClass("cancel_stepper_border");
				//$("div[id$='step1'], div[id$='step2'], div[id$='step3']").css({"padding-left": "inherit"});
				$("div[id$='step1'], div[id$='step2'], div[id$='step3'], .cancel_button").removeClass("hide");
				$("div[id*='step'] .btn_group").remove("img");
				
				if ($pageId.indexOf("filter") == -1) {
					$(".next_button, .back_button").addClass("btn-primary");
				}
				else {
					$("div[id$='step2_content'] .next_button, div[id$='step3_content'] .next_button, div[id$='step2_content'] .back_button, div[id$='step3_content'] .back_button").addClass("btn-primary");
				}
				
				$(".next_button span, .back_button span").remove();
				$(".progress_img").remove();
				
				isExpanded($activeNode);
			}
			else
				return;
		}).on("click", "input, textarea, select, .next_button, .back_button, .cancel_button", function(event) {
			event.stopPropagation();
		});
	}
	else { // Desktop/Laptop or HD phone
		if (windowWidth < 1024) {
			$("#header_top").addClass("clearfix");
			$("#toggles").removeClass("btn-group btn-group-justified");
		}
		
		/* Make the stepper content span only four columns. */
		$("#" + $pageId + "_page #stepper_content").removeClass("col-xs-12").addClass("col-sm-5");
		
		/* Move the map and help video into the sidebar. */
		$("#topbar").addClass("hide");
		$("#map").prependTo($("#sidebar"));
		$("#resource_card").appendTo($("#sidebar"));
		
		if ($pageId.indexOf("filter") != -1) {
			$(".help_video").each(function() {
				$(this).prependTo($("#sidebar"));
			});
		}
		else
			$(".help_video").prependTo($("#sidebar"));
		
		/* Show the step titles by default. */
		$("div[id$='step1_content'] .cancel_button, div[id$='step2'], div[id$='step3']").removeClass("hide");
	}
	
	/* Cancel button for all "show me" pages and the "report a water issue" page. */
	$("div[id$='step3_content'] .next_button").on("click", function() {
		if ($pageId.indexOf("report") == -1)
			$(window).attr("location", "index.php");
	});
	
	$(".cancel_button").on("click", function() {
		$(window).attr("location", "index.php");
	});
	
	/* Mobile "expanded" stepper code. */
	function isExpanded(node) {
		$nodeId = node.attr("id");
		$nodeSubstring = $nodeId.slice(0, $nodeId.length-1);
		
		/* Retrieve which type of filter was clicked if on the filter page. */
		var filter_type = "";
		
		if ($pageId.indexOf("filter") != -1) {
			var $temp = $(this).attr("id");
			filter_type = $temp.slice(0, $temp.indexOf("_"));
		}
		
		$(".cancel_button").removeClass("hide");
		
		if (windowHeight < 480)
			$("#topbar").css("height", "15em");
		
		$("#" + $nodeSubstring + "1_content .next_button").on("click", function() {
			$("#" + filter_type + "_" + $nodeSubstring + "1").removeClass("active hide").addClass("done");
			$("#" + filter_type + "_" + $nodeSubstring + "1_content").addClass("hide");
			$("#" + filter_type + "_" + $nodeSubstring + "2").removeClass("hide").addClass("active");
			$("#" + filter_type + "_" + $nodeSubstring + "2_content").removeClass("hide");
			
			if ($pageId.indexOf("test") != -1) {
				$("#map").addClass("hide");
				$(".help_video").removeClass("hide");
			}
		});
		
		$("#" + $nodeSubstring + "2_content .next_button").on("click", function() {
			$("#" + $nodeSubstring + "2").removeClass("active hide").addClass("done");
			$("#" + $nodeSubstring + "2_content").addClass("hide");
			$("#" + $nodeSubstring + "3").removeClass("hide").addClass("active");
			$("#" + $nodeSubstring + "3_content").removeClass("hide");
			
			if ($pageId.indexOf("test") != -1) {
				$(".help_video").addClass();
				$("#map").removeClass("hide");
			}
		});
		
		$("#" + $nodeSubstring + "2_content .back_button").on("click", function() {
			$("#" + $nodeSubstring + "2").removeClass("done").addClass("active");
			$("#" + $nodeSubstring + "2_content").removeClass("hide");
			$("#" + $nodeSubstring + "3").removeClass("active").addClass("hide");
			$("#" + $nodeSubstring + "3_content").addClass("hide");
			
			if ($pageId.indexOf("test") != -1) {
				$(".help_video").removeClass();
				$("#map").addClass("hide");
			}
		});
	}
	
	/* All "show me how" pages and the "report a problem" page. */
	if (($pageId.indexOf("index") == -1) && ($pageId.indexOf("news") == -1) && ($pageId.indexOf("about") == -1)) {
		$nodeId = $activeNode.attr("id");
		$nodeSubstring = $nodeId.slice(0, $nodeId.length-1);
		
		/* Hide the content of steps 2 and 3 when the page loads. */
		$("div[id$='step1_content']").removeClass("hide");
		
		console.log($pageId);
		
		if ($pageId.indexOf("test") != -1) {
			$(".help_video").addClass("hide");
			
			/* Set the map to display only test kits. */
			oldResourceActiveArray = resourceActiveArray;
			resourceActiveArray = [0, 0, 0, 0, 1, 0, 0, 0];
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			localStorage.setItem("saved_resource_array", JSON.stringify(oldResourceActiveArray));
		}
		else if ($pageId.indexOf("report") != -1) {
			$(".help_video").addClass("hide");
			
			/* Remove all resource markers from the map. */
			oldResourceActiveArray = resourceActiveArray;
			resourceActiveArray = [0, 0, 0, 0, 0, 0, 0, 0];
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			localStorage.setItem("saved_resource_array", JSON.stringify(oldResourceActiveArray));
		}
		else if ($pageId.indexOf("filter") != -1) {
			$("#PUR_video").addClass("hide");
			$("#map").remove();			
		}			
		else
			$("#map").remove();
		
		if (windowWidth < 768) {
			$(".cancel_button").addClass("hide");
			
			$("div[id*='" + $nodeSubstring + "']").addClass("cancel_stepper_border");
			$(".stepper-vert .stepper::after, .stepper-vert .stepper::before, #allFilters_step1_content, div[id$='step2_content'], div[id$='step3_content'] ").addClass("cancel_stepper_border");
			$("#allFilters_step1_content .next_button").css({
						"padding": "0",
						"position": "static",
						"top": "initial",
						"right": "initial"
			});			
			$("#allFilters_step1_content .glyphicon").remove();
			
			/* Use a loop to take the filter page into account, which has three clickables in step 1. */
			$("div[id$='step1_content'] .next_button").each(function() {
				$(this).on("click", function() {
					if ($(this).hasClass("disabled")) {
						return false;
					}
					
					/* Retrieve which type of filter was clicked if on the filter page. */
					var filter_type = "";
					
					if ($pageId.indexOf("filter") != -1) {
						var $temp = $(this).attr("id");
						filter_type = $temp.slice(0, $temp.indexOf("_"));
						console.log("filter_type = " + filter_type);
					}
					
					if ($("#stepper_content").hasClass("brief"))
						$("#" + $nodeSubstring + "1, div[id$='step1_content']").addClass("hide");
					else {
						$("#" + $nodeSubstring + "1").removeClass("active").addClass("done");
						$("div[id$='step1_content']").addClass("hide");
					}
					
					$("#" + $nodeSubstring + "2").removeClass("hide").addClass("active");
					$("div[id*='" + filter_type + "_step2_content']").removeClass("hide");
					
					if ($("#stepper_content").hasClass("brief"))
						$("div[id$='" + filter_type + "_step2_content'] .btn_group").append("<img class='progress_img center-block' src='images/stepper2.png' />");
					
					if ($pageId.indexOf("test") != -1) {
						$("#map").addClass("hide");
						$(".help_video").removeClass("hide");
					}
					else if ($pageId.indexOf("filter") != -1) {
						$(".help_video").addClass("hide");
						$("#" + filter_type + "_video").removeClass("hide");
					}
					
					if ($pageId.indexOf("report") != -1) {
						autocomplete = initAutocomplete("location");
						
						if ($("#location_lat").val().length == 0) {
							console.log(autocomplete.getPlace());
							
							/* Get the lat/long for the location using geocoding. */
							geocoder.geocode({
								address: $("#location").val(),
								bounds: new google.maps.LatLngBounds({lat: 43.021, lng: -83.681})
							}, function(results, status) {
								$("#location_lat").val(results[0].geometry.location.lat());
								$("#location_lng").val(results[0].geometry.location.lng());
								
								console.log($("#location_lat").val() + ", " + $("#location_lng").val());
							});
						}
					}
				});
			});
			
			$("div[id$='step2_content'] .next_button").on("click", function() {
				if ($(this).hasClass("disabled")) {
					return false;
				}
					
				/* Retrieve which type of filter was clicked if on the filter page. */
				var filter_type = "";
				
				if ($pageId.indexOf("filter") != -1) {
					var $temp = $(this).attr("id");
					filter_type = $temp.slice(0, $temp.indexOf("_"));
				}
				
				if ($("#stepper_content").hasClass("brief"))
					$("#" + $nodeSubstring + "2, div[id*='" + filter_type + "_step2_content']").addClass("hide");
				else {
					$("#" + $nodeSubstring + "2").removeClass("active").addClass("done");
					$("div[id*='" + filter_type + "_step2_content']").addClass("hide");
				}
				
				$("#" + $nodeSubstring + "3, div[id*='" + filter_type + "_step3_content']").removeClass("hide").addClass("cancel_stepper_border");
				$("#" + $nodeSubstring + "3").addClass("active");
				//$("div[id*='step3_content'] .cancel_button").removeClass("hide");
				$("div[id$='step3_content'] .next_button span").addClass("hide");
				$("div[id$='step3_content'] .btn_group").css("text-align", "center");
				
				if ($("#stepper_content").hasClass("brief")) {
					$("div[id$='" + filter_type + "_step3_content'] .btn_group").prepend("&nbsp;").append("<img class='progress_img center-block' src='images/stepper3.png' />");
				}
				
				if ($pageId.indexOf("report") == -1)
					$("div[id$='step3_content'] .next_button").css("display", "none");
				
				if ($pageId.indexOf("test") != -1) {
					$(".help_video").addClass("hide");
					$("#map").removeClass("hide");
				}
			});
			
			$("div[id$='step2_content'] .back_button").on("click", function() {
				/* Retrieve which type of filter was clicked if on the filter page. */
				var filter_type = "";
				
				if ($pageId.indexOf("filter") != -1) {
					var $temp = $(this).attr("id");
					filter_type = $temp.slice(0, $temp.indexOf("_"));
				}
				
				if ($("#stepper_content").hasClass("brief"))
					$("#" + $nodeSubstring + "2, div[id*='" + filter_type + "_step2_content']").removeClass("hide");
				else {
					$("#" + $nodeSubstring + "2").removeClass("done").addClass("active");
					$("div[id*='" + filter_type + "_step2_content']").removeClass("hide");
				}
				
				$("#" + $nodeSubstring + "3, div[id*='" + filter_type + "_step3_content']").addClass("hide");
				$("#" + $nodeSubstring + "3").removeClass("active");
				//$("div[id*='step3_content'] .cancel_button").removeClass("hide");
				$("div[id$='step3_content'] .next_button span").removeClass("hide");
				$("div[id$='step3_content'] .btn_group").css("text-align", "center");
				
				if ($("#stepper_content").hasClass("brief")) {
					$("div[id$='" + filter_type + "_step3_content'] .btn_group").prepend("&nbsp;").append("<img class='progress_img center-block' src='images/stepper2.png' />");
				}
				$("#water_step3_content").css("border-left", "0px!important");
				$("div[id$='step3_content'] .next_button").css("display", "none");
				
				if ($pageId.indexOf("test") != -1) {
					$(".help_video").removeClass("hide");
					$("#map").addClass("hide");
				}
			});
		}
		else {
			/* Use a loop to take into account the filter page which has three clickables in step 1. */
			$("div[id$='step1_content'] .next_button").each(function() {
				$(this).on("click", function(event) {
					if ($(this).hasClass("disabled")) {
						return false;
					}
					
					/* Retrieve which type of filter was clicked if on the filter page. */
					var filter_type = "";
					
					if ($pageId.indexOf("filter") != -1) {
						var $temp = $(this).attr("id");
						filter_type = $temp.slice(0, $temp.indexOf("_"));
					}
					
					$("#" + $nodeSubstring + "1").removeClass("active").addClass("done");
					$("div[id$='step1_content']").addClass("hide");
					$("div[id*='" + filter_type + "_step2_content']").removeClass("hide");
					$("#" + $nodeSubstring + "2").addClass("active");
					
					if ($pageId.indexOf("test") == -1) {
						if ($pageId.indexOf("report") == -1)
							$("#map").addClass("hide");
						
						$(".help_video").removeClass("hide");
						
						if ($pageId.indexOf("filter") == -1)
							$(".help_video").removeClass("hide");
						else
							$("#" + filter_type + "_video").removeClass("hide");
					}
					else if ($pageId.indexOf("filter") != -1) {
						$(".help_video").addClass("hide");
						$("#" + filter_type + "_video").removeClass("hide");
					}
					
					if ($pageId.indexOf("report") != -1) {
						if ($("#location_lat").val().length == 0) {
							/* Get the lat/long for the location using geocoding. */
							geocoder.geocode({
								address: $("#location").val(),
								bounds: new google.maps.LatLngBounds({lat: 43.021, lng: -83.681})
							}, function(results, status) {
								$("#location_lat").val(results[0].geometry.location.lat());
								$("#location_lng").val(results[0].geometry.location.lng());
								
								console.log($("#location_lat").val() + ", " + $("#location_lng").val());
							});
						}
					}
				});
			});
			
			$("div[id$='step2_content'] .next_button").on("click", function() {
				if ($(this).hasClass("disabled")) {
					return false;
				}
				
				/* Retrieve which type of filter was clicked if on the filter page. */
				var filter_type = "";
				
				if ($pageId.indexOf("filter") != -1) {
					var $temp = $(this).attr("id");
					filter_type = $temp.slice(0, $temp.indexOf("_"));
				}
				
				$("#" + $nodeSubstring + "2").removeClass("active hide").addClass("done");
				$("div[id*='" + filter_type + "_step2_content']").addClass("hide");
				$("#" + $nodeSubstring + "3").addClass("active");
				$("div[id*='" + filter_type + "_step3_content']").removeClass("hide").addClass("cancel_stepper_border");
				
				if ($pageId.indexOf("test") != -1) {
					$(".help_video").remove();
					$("#map").removeClass("hide");
				}
			});

		}
	}
	

	/* Report a Problem page */	
	if ($pageId.indexOf("report") != -1) {
		/* Make sure each form field is reset to default. */
		//$("#report_problem #location").val("")
		$("#report_problem #location_lat").val("");
		$("#report_problem #location_lng").val("");
		$("#report_problem #problem_type").val(0);
		$("#report_problem #problem_text").val("");
		$("#report_problem #email_choice, #report_problem #phone_choice").prop("checked", false);
		$("#report_problem #email").val("");
		//$("#report_problem #phone").val("");
		
		/* If the link was clicked on the location card, the address will be automatically filled in. */
		if ($("#report_problem #location").val().length > 0)
			$("#report_step1_content .next_button").removeClass("disabled");
		
		var report_validator;
		
		$.ajax({
			type: "GET",
			url: form_validation_api,
			dataType: "script",
			cache: true,
			success: function() {
				/* Report a Problem form processing. */
				report_validator = $("#report_problem form").validate({
					debug: false,
					errorPlacement: function(error, element) {
						element.after(error);
					},
					messages: {
						problemType: "Please select a problem type.",
						description: "Please describe the problem.",
						email: "Please enter a valid email address."
						//phone: "Please enter the phone number in (555) 555-5555 format."
					},
					submitHandler: function(form) {
						var location = $("#location").val().replace(", United States", "");
						
						$(form).ajaxSubmit({
							type: "POST",
							url: "includes/functions.php",
							data: {
								type: "problem_report",
								location: location,
								lat: $("#location_lat").val(),
								lng: $("#location_lng").val(),
								problemType: $("#problem_type").val(),
								description: $("#problem_text").val(),
								email: $("#email").val()
								//phone: $("#phone").val()
							},
							complete: function(resp) {
								if (resp.responseText.indexOf("1") != -1) {
									$("#report_problem form, #report_problem div[class*='alert-danger']").remove();
									$("#topbar, #sidebar").addClass("hide");
									$("#report_problem .row").append("<div class='alert alert-success' role='alert'>Your report has been successfully submitted.</div>");
									$("#report_problem form").resetForm();
								}
								else {
									$("#report_problem div[class*='alert-danger']").remove();
									$("#report_problem form").after("<div class='alert alert-danger' role='alert' style='margin-top:20px;'>There was an error submitting your report. Please try again.</div>");
								}
								
								$("#report_problem .alert").show();
							}
						});
					}
				});
				
				/* Set the validation rules. */
				$("#report_problem #location").rules("add", {required: true, location: true});
				
				jQuery.validator.addMethod("location", function(value, element) {
					return this.optional(element) || /(?:((?:\d[\d ]+)?[A-Za-z][A-Za-z ]+)[\s,]*([A-Za-z#0-9][A-Za-z#0-9 ]+)?[\s,]*)?(?:([A-Za-z][A-Za-z ]+)[\s,]+)?((?=AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY)[A-Z]{2})(\, [A-Z]+[a-z]+\ ? [A-Z]+[a-z]+)*/.test(value);
				}, "Please choose an option from the list or enter a location in the form Number Street, City, State with proper capitalization.");
				
				$("#report_problem #problem_type").rules("add", {required: true});
				$("#report_problem #problem_text").rules("add", {required: true, minlength: 5, maxlength: 500});
				
				$.validator.methods.email = function(value, element) {
					return this.optional(element) || /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/.test(value);
				};
				
				$("#email").rules("add", {
					required: true,
					email: true/*{
						depends: function(element) {
							return $("#email").is(":checked");
						}
					}*/
				});
				
				/*$.validator.methods.phoneUS = function(value, element) {
					return this.optional(element) || /^(\([2-9]([02-9]\d|1[02-9])\))\ [2-9]([02-9]\d|1[02-9])-\d{4}$/.test(value);
				}
				$("#phone").rules("add", {
					required: true,
					phoneUS: {
						depends: function(element) {
							return $("#phone").is(":checked");
						}
					}
				});*/
			}
		});
		
		/* Fill in location after clicking favorite location marker. */
		//var geocoder = new google.maps.Geocoder();
		
		$("#report_problem #location").on("focus", function() {
			autocomplete.addListener('place_changed', function() {
				if (report_validator.element("#report_problem #location")) {					
					$("#location_lat").val(autocomplete.getPlace().geometry.location.lat());
					$("#location_lng").val(autocomplete.getPlace().geometry.location.lng());
					
					$("#report_step1_content .next_button").removeClass("disabled");
				}
				else
					$("#report_step1_content .next_button").addClass("disabled");
			});
			
			if (report_validator.element("#report_problem #location"))
				$("#report_step1_content .next_button").removeClass("disabled");
			else
				$("#report_step1_content .next_button").addClass("disabled");
		}).on("focusout", function() {
			if (report_validator.element("#report_problem #location"))			
				$("#report_step1_content .next_button").removeClass("disabled");
			else
				$("#report_step1_content .next_button").addClass("disabled");
		}).on("change", function() {
			if (report_validator.element("#report_problem #location"))				
				$("#report_step1_content .next_button").removeClass("disabled");
			else
				$("#report_step1_content .next_button").addClass("disabled");
		});
		
		//var report_location = document.getElementById("location");
		
		/* Enable step 2 button once both fields are completed. */	
		/* Count the characters of the problem description. */
		$(".char_count").html("<span>Characters remaining:</span> 500");
		$("#report_problem #problem_text").on("keyup", function(event) {
			$(".char_count").html("<span>Characters remaining:</span> " + (500 - $(this).val().length));
		});
		
		$("#report_problem #problem_type").on("focusout", function() {
			if (report_validator.element("#report_problem #problem_type") && report_validator.element("#report_problem #problem_text"))
				$("#report_problem #report_step2_content .next_button").removeClass("disabled");
			else
				$("#report_problem #report_step2_content .next_button").addClass("disabled");
		});
		
		$("#report_problem #problem_text").on("keyup", function() {
			if (report_validator.element("#report_problem #problem_type") && report_validator.element("#report_problem #problem_text"))
				$("#report_problem #report_step2_content .next_button").removeClass("disabled");
			else
				$("#report_problem #report_step2_content .next_button").addClass("disabled");
		});
		
		/* Enable step 3 button once one of the contact fields is completed and valid. */
		$("#report_problem #contact_pref input[type='radio']").on("change", function() {
			var selected = $(this).filter(":checked").val();
			
			if (selected.indexOf("email") != -1) {
				$("#phone").addClass("hide");
				$("#email").removeClass("hide");
			}
			else if (selected.indexOf("phone") != -1) {
				$("#email").addClass("hide");
				$("#phone").removeClass("hide");
			}
		});
		
		$("#report_problem #email").on("keyup", function() {
			if (report_validator.element("#report_problem #email"))
				$("#report_problem #report_step3_content .next_button").removeClass("disabled");
			else
				$("#report_problem #report_step3_content .next_button").addClass("disabled");
		}).on("focusout", function() {
			if (report_validator.element("#report_problem #email"))
				$("#report_problem #report_step3_content .next_button").removeClass("disabled");
			else
				$("#report_problem #report_step3_content .next_button").addClass("disabled");
		});
		
		/*$("#report_problem #phone").on("keyup", function() {
			if (report_validator.element("#report_problem #phone"))
				$("#report_problem #report_step3_content .next_button").removeClass("disabled");
			else
				$("#report_problem #report_step3_content .next_button").addClass("disabled");
		});*/
	}
	/* Contact us form. */
	else if ($pageId.indexOf("index") != -1) {
		$("#contact_form .char_count").html("<span>Characters remaining:</span> " + (1000 - $("#contact_form #comments").val().length));
		$("#contact_form #comments").on("keyup", function(event) {
			$(".char_count").html("<span>Characters remaining:</span> " + (1000 - $(this).val().length));
		});
		
		$.ajax({
			type: "GET",
			url: form_validation_api,
			dataType: "script",
			cache: true,
			success: function() {
				var comments_validator = $("#contact_form form").validate({
					debug: false,
					errorPlacement: function(error, element) {
						element.after(error);
					},
					rules: {
						email: {
							required: false,
							email: true
						},
						comments: {
							required: true,
							minlength: 20,
							maxlength: 1000
						}
					},
					submitHandler: function(form) {			
						$(form).ajaxSubmit({
							type: "POST",
							url: "includes/functions.php",
							data: {
								"type": "contact_form",
								"form_type": "user"
							},
							complete: function(resp) {								
								if (resp.responseText.indexOf("1") != -1) {
									$("#contact_form div[class*='alert-danger']").remove();
									$("#contact_form .modal-header, #contact_form .modal-body, #contact_form .modal-footer").hide();
									$("#contact_form .modal-content").prepend("<div class='alert alert-success' role='alert'>Your comments have been successfully submitted.</div>");
									$("#contact_form form").resetForm();
								}
								else {
									$("#contact_form div[class*='alert-danger']").remove();
									$("#contact_form .modal-body").append("<div class='alert alert-danger' role='alert' style='margin-top:20px;'>There was an error submitting your comments. Please try again.</div>");
								}
								
								$("#contact_form .alert").show();
							}
						});
						
						return false;
					}
				});
				
				$("#contact_form").on("show.bs.modal", function() {
					$("#contact_form .modal-content .alert-success").remove();
					$("#contact_form .modal-header, #contact_form .modal-body, #contact_form .modal-footer").show();
				});
				
				$("#contact_form").on("shown.bs.modal", function() {
					if (comments_validator.element("#contact_form #comments"))
						$("#contact_form .submit_button").removeClass("disabled");
					else
						$("#contact_form .submit_button").addClass("disabled");
				});
			
				$("#contact_form #comments").on("keyup", function() {
					if (comments_validator.element("#contact_form #comments"))
						$("#contact_form .submit_button").removeClass("disabled");
					else
						$("#contact_form .submit_button").addClass("disabled");
				});
			}	
		});
	}	
	else if ($pageId.indexOf("news") != -1) {		
		$.ajax({
			type: "GET",
			url: feed_api,
			dataType: "script",
			cache: true
		});
		
		/*const messaging = firebase.messaging();
						
		messaging.requestPermission().then(function() {
			console.log("Notification permission granted.");
			
			messaging.getToken().then(function(currentToken) {
				if (currentToken) {
				  sendTokenToServer(currentToken);
				  updateUIForPushEnabled(currentToken);
				  // store token?
				}
				else {
				  // Show permission request.
				  console.log("No Instance ID token available. Request permission to generate one.");
				  // Show permission UI.
				  updateUIForPushPermissionRequired();
				  setTokenSentToServer(false);
				}
			}).catch(function(err) {
				console.log("An error occurred while retrieving token. ", err);
				showToken("Error retrieving Instance ID token. ", err);
				setTokenSentToServer(false);
			});
		}).catch(function(err) {
			console.log("Unable to get permission to notify.", err);
		});
		
		messaging.onTokenRefresh(function() {
			messaging.getToken().then(function(refreshedToken) {
				console.log("Token refreshed.");
				// Indicate that the new Instance ID token has not yet been sent to the
				// app server.
				setTokenSentToServer(false);
				// Send Instance ID token to app server.
				sendTokenToServer(refreshedToken);
				// ...
			}).catch(function(err) {
				console.log("Unable to retrieve refreshed token ", err);
				showToken("Unable to retrieve refreshed token ", err);
			});
		});*/
	}
});