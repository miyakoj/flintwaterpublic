$(document).ready(function() {
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;
	
	/* Position alert in the middle of the page. */
	$(".alert").css({
		"top": function() {
			return this.top = (windowHeight - $(".alert").height()) / 2;
		},
		"left": function() {
			return this.left = (windowWidth - $(".alert").width()) / 2;
		}
	});
	
	/* Activate tooltips. */
	$(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});
	
	/* Make the line-height of the navbar header h1 match the height of the navbar. */
	//$(".navbar-brand").css("line-height", $("#main_menu ul").css("line-height"));
	
	/* Dynamically adjust the dropdown menu links. */
	$(".dropdown-menu a").css("line-height", $(".dropdown-menu a").css("min-height"));
	//$("#language_menu .dropdown-toggle").css("width", $("#language_menu .dropdown-menu").css("min-width"));
	$("#header_top #language_menu .dropdown-menu").css("min-width", $("#header_top #language_menu").css("min-width"));
	
	/* Position the map in the correct element if it exists on the page. */
	if($("#search_input").length != 0)
		$("#map_container #search_input").after($("#map"));
  
	/* Size the map based on the window size. */
	var mapHeight = windowHeight - $("#header").outerHeight() - $("#toggles").outerHeight() - $("footer").outerHeight() + 10;
	$("#map_container").css("height", mapHeight + "px");
	
	$("#search_input").val(""); // clear the search input upon refresh
	
	/* Scale the popup markers based on screen size. */
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
	
	$("footer .card-action a").each(function(i) {
		id = $(this).attr("id");
		page = id.slice(0, id.indexOf("_"));
		
		$(this).attr("href", "page.php?pid=" + page);
	});
	
	//$("footer #about_link").attr("href", "page.php?pid=" + about);
	
	/* Mark the tab of the current page as active. */
	$page_id = $("body").attr("id").slice(0, $("body").attr("id").indexOf("_"));
	
	if ($page_id.indexOf("index") != -1)
		$("#map_link").parent().addClass("active");
	else {
		$("#" + $page_id + "_link").parent().addClass("active");
		
		// if the linked clicked is in the "show me" dropdown then also make the "show me" tab active
		if ($("#" + $page_id + "_link").parent().parent().parent().attr("id") == "show_me_menu")
			$("#show_me_menu").addClass("active");
	}
	
	/* Change the navbar-brand to the page title. */
	/*if ($page_id.indexOf("index") == -1)
		$(".navbar-brand").text($("#main_menu .active span:last-of-type").text());*/
		
	if (windowWidth < 600) {
		$("#location_card").appendTo($("body"));
		
		console.log("location_card spacing: " + ($("#location_card").width() / 2));
		
		$("#location_card").css({
			"margin": "0 5px",
			"left": function () {
				($("#location_card").width() / 2) + "px";
			},
			"bottom": "5px"
		});
		
		console.log("location_card left: " + $("#location_card").css("left"));
	}
	else {
		$("#location_card").css({
			"width": function() {
				return $("#search_input").outerWidth();
			},
			"top": function() {
				return parseInt($("#search_input").css("top")) + (parseInt($("#search_input").height()) + 20) + "px";
			},
			"left": function() {
				return parseInt($("#search_input").css("left")) + parseInt($("#search_input").css("margin-left")) + "px";
			}
		});
	}
	
	/* Layout mods for differences between desktop and mobile. */
	if (windowWidth < 768) {
		$("#made_in_Flint").appendTo($("#main_menu"));
		$("#made_in_Flint img").css({
			"margin-left": "auto",
			"margin-right": "auto",
			"margin-top": "20px"			
		});
		
		$("#main_menu .nav").removeClass("nav-justified");
		$("#show_me_menu").removeClass("dropdown");
		$("#show_me_menu ul").removeClass("dropdown-menu");
		
		/* Move the map and help videos above the steppers for phone/small tablet. */
		$("#topbar").css("height", "20em").prepend($("#map"));
		$("#help_video").prependTo($("#topbar"));
		$("#topbar").css("height", $("#help_video").height()+"px");
		
		/* Apply the initial abbreviated stepper layout for mobile. */
		$(".cancel_button").addClass("hide");
		
		$("div[id$='step1'], div[id$='step2'], div[id$='step3']").css({
			"padding-top": "10px",
			"padding-bottom": "10px"
		});
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
		$(".stepper-vert-content").css("border-left", "1px");
		$("#stepper_content .btn_group").css({
			"margin-top": "0",
			"text-align": "right"
		});
		$("#stepper_content .next_button").css("padding", "0").removeClass("btn-primary").append(" <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>");
		
		/* Unhide all step titles when the stepper content is tapped. */
		$("div[id*='step1']").on("click", function() {
			$("div[id$='step1'], div[id$='step2'], div[id$='step3'], #stepper_content h2, #stepper_content ul, #stepper_content ul li, .stepper-vert-content, #stepper_content .btn_group, #stepper_content .next_button").removeAttr("style");
			$("div[id$='step2'], div[id$='step3'], .cancel_button").removeClass("hide");
			$(".next_button").addClass("btn-primary")
			$(".next_button span").remove();
		});
		
		//$("#steppers").removeClass("stepper-vert").addClass("stepper-horiz");
		//$("#steppers div:first").removeClass("stepper-vert-inner").addClass("stepper-horiz-inner");
	}
	else if (windowWidth < 800) {
		/* Move the map and help videos above the steppers for phone/small tablet. */
		$("#topbar").css("height", "20em").prepend($("#map"));
		$("#help_video").prependTo($("#topbar"));
	}
	else if (windowWidth < 1024) {
		$("#header_top").addClass("clearfix");
		$("#toggles").removeClass("btn-group btn-group-justified");
	}
	else { // Desktop/Laptop
		$("#main_menu .nav").addClass("nav-justified");
		$("#show_me_menu").addClass("dropdown");
		$("#show_me_menu ul").addClass("dropdown-menu");
		
		/* Make the stepper content span only four columns. */
		$("#water_test #stepper_content").removeClass("col-md-12").addClass("col-md-4");
		
		/* Move the map and help video into the sidebar. */
		$("#map").prependTo($("#sidebar"));
		$("#help_video").prependTo($("#sidebar"));
		
		/* Show the step titles by default. */
		$("div[id$='step1_content'] .cancel_button, div[id$='step2'], div[id$='step3']").removeClass("hide");
		
		/*$("#steppers").removeClass("stepper-horiz").addClass("stepper-vert");
		$("#steppers div:first").removeClass("stepper-horiz-inner").addClass("stepper-vert-inner");
		$("#steppers div").find(".stepper-horiz-content").each(function() {
			$(this).removeClass("stepper-horiz-content").addClass("stepper-vert-content")
		});*/
	}
	
	/* Resize the provider info popups. */
	//console.log($("#provider_popup").parent());
	//$("#provider_popup").parent().parent().css("width", "300px");
	
	/* Dynamically add script tags only to pages where they're relevant. */
	// MAP API
	var js_api = "<script src='https://www.google.com/jsapi'></script>";
	var map_api = "<script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyAr4wgD-8jV8G7gv600mD75Ht1eS3B4siI&libraries=visualization,places' async defer></script>";
	var map_js = "<script src='js/map.js'></script>";
	var client_api = "<script src='https://apis.google.com/js/client.js?onload=setAPIKey'></script>";
	var news_js = "<script src='js/news.js'></script>";
	var alert_js = "<script src='js/alerts.js'></script>";
	
	/*if ($page_id.indexOf("index") != -1) {
		$("head script[src*='script']").before(map_api, client_api);
		$("head script[src*='script']").after(map_js, client_api);
	}*/
	console.log($page_id);
	
	/*if ($page_id.indexOf("news") != -1) {
		//$("head script[src*='script']").before(js_api);
		$("head").append(news_js);
		// + "\n" + alert_js
	}*/
	
	/* Function to apply the abbreviated stepper layout for mobile. */
	/*function changeToShortSteppers() {
		$("div[id$='step1'], div[id$='step2'], div[id$='step3']").css("padding-bottom", "24px");		
		$("#stepper_content ul").css("padding-left", "32px");
		$("#stepper_content ul li:first-child").css({
			"white-space": "normal",
			"overflow": "auto",
			"text-overflow": "clip"
		});
		$(".stepper-vert-content").css("border-left", "1px");
	}*/
	
	/* Cancel button for all "show me" pages. */
	$(".cancel_button").on("click", function() {
		$(window).attr("location", "index.php");
	});
	
	/* Test My Water page */
	if ($page_id.indexOf("test") != -1) {
		$("#water_step1").addClass("active");
		$("#water_step1_content").removeClass("hide");
		$("#water_step2_content").addClass("hide");
		$("#water_step3_content").addClass("hide");
		$("#help_video").addClass("hide");
		
		/* Set the map to display only test kits. */
		resourceActiveArray = [0,0,0,0,1,0];
		localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
		
		$("#water_step1_content .next_button").on("click", function() {
			$("#water_step1").removeClass("active").addClass("done");
			$("#water_step1_content").addClass("hide");
			$("#water_step2_content").removeClass("hide");
			$("#water_step2").addClass("active");
			
			$("#map").addClass("hide");
			$("#help_video").removeClass("hide");
		});
		
		$("#water_step2_content .next_button").on("click", function() {
			$("#water_step2").removeClass("active").addClass("done");
			$("#water_step2_content").addClass("hide");
			$("#water_step3").addClass("active");
			$("#water_step3_content").removeClass("hide").addClass("cancel-stepper-border");
			
			$("#help_video").remove();
			$("#map").removeClass("hide");
		});
	}
	
	/* Steppers for Install water filter */
	$("#filter_link").on("click", function() {
	  $("#filter_step1").addClass("active");
	  $("#allFilters_step1_content").removeClass("hide");
	  $("#filter_step2").addClass("hide");
	  $("#filter_step3").addClass("hide");
	});
	
	$("#install_filter #PUR_btn").on("click", function() {
	  $("#filter_step1").removeClass("active").addClass("done");
	  $("#allFilters_step1_content").addClass("hide");
	  $("#PUR_step2_content").removeClass("hide");
	  $("#filter_step2").addClass("active");
	});
	
	$("#install_filter #Brita_btn").on("click", function() {
	  $("#filter_step1").removeClass("active").addClass("done");
	  $("#allFilters_step1_content").addClass("hide");
	  $("#Brita_step2_content").removeClass("hide");
	  $("#filter_step2").addClass("active");
	});
	
    $("#install_filter #ZeroWater_btn").on("click", function() {
	  $("#filter_step1").removeClass("active").addClass("done");
	  $("#allFilters_step1_content").addClass("hide");
	  $("#ZeroWater_step2_content").removeClass("hide");
	  $("#filter_step2").addClass("active");
	});
	
	$("#PUR_step2_click").on("click", function() {
	  $("#filter_step2").removeClass("active").addClass("done");
	  $("#PUR_step2_content").addClass("hide");
	  $("#PUR_step3_content").removeClass("hide").addClass("cancel-stepper-border");
	  $("#filter_step3").addClass("active");
	});
	
    $("#Brita_step2_click").on("click", function() {
	  $("#filter_step2").removeClass("active").addClass("done");
	  $("#Brita_step2_content").addClass("hide");
	  $("#Brita_step3_content").removeClass("hide").addClass("cancel-stepper-border");
	  $("#filter_step3").addClass("active");
	});
	
	$("#ZeroWater_step2_click").on("click", function() {
	  $("#filter_step2").removeClass("active").addClass("done");
	  $("#ZeroWater_step2_content").addClass("hide");
	  $("#ZeroWater_step3_content").removeClass("hide").addClass("cancel-stepper-border");
	  $("#filter_step3").addClass("active");
	});

    $("#install_filter .cancel_button").on("click", function() {
		$(window).attr("location", "index.php");
	});


	/* Steppers for Clean My Aerator */
    $("#aerator_link").on("click", function() {
	  $("#aerator_step1").addClass("active");
	  $("#aerator_step1_content").removeClass("hide");
	  $("#aerator_step2").addClass("hide");
	  $("#aerator_step3").addClass("hide");
	  $("#aerator_step4").addClass("hide");
	});
	
	$("#aerator_step1_click").on("click", function() {
	  $("#aerator_step1").removeClass("active").addClass("done");
	  $("#aerator_step1_content").addClass("hide");
	  $("#aerator_step2_content").removeClass("hide");
	  $("#aerator_step2").addClass("active");
	});
	
    $("#aerator_step2_click").on("click", function() {
	  $("#aerator_step2").removeClass("active").addClass("done");
	  $("#aerator_step2_content").addClass("hide");
	  $("#aerator_step3_content").removeClass("hide");
	  $("#aerator_step3").addClass("active");
	});
	
    $("#aerator_step3_click").on("click", function() {
	  $("#aerator_step3").removeClass("active").addClass("done");
	  $("#aerator_step3_content").addClass("hide");
	  $("#aerator_step4_content").removeClass("hide").addClass("cancel-stepper-border");
	  $("#aerator_step4").addClass("active");
	});
	
	$("#clean_aerator .cancel_button").on("click", function() {
		$(window).attr("location", "index.php");
	});
	

	/* Report a Problem page */
	$("#report_link").on("click", function() {
	    $("#report_step1").addClass("active");
		$("#report_step1_content").removeClass("hide");
		$("#report_step2_content").addClass("hide");
		$("#report_step3_content").addClass("hide");
	});
	
    $("#report_problem #step1_click").click(function() {
		$("#report_step1").removeClass("active").addClass("done");
		$("#report_step1_content").addClass("hide");
		$("#report_step2_content").removeClass("hide");
		$("#report_step2").addClass("active");
	});
	
	$("#report_problem #step2_click").on("click", function() {
		$("#report_step2").removeClass("active").addClass("done");
		$("#report_step2_content").addClass("hide");
		$("#report_step3").addClass("active");
		$("#report_step3_content").removeClass("hide").addClass("cancel-stepper-border");
	});
	
	$("#report_problem #submit_button").on("click", function() {
		//var location = $("#report_page #report_info #locationTextField").val();
		//var problemType = $("#report_page #report_info #ProblemSelector").val();
		//var description = $("#report_page #report_info textarea").val();
		console.log("click worked");
		//TODO save these values to the db
		alert("Thank you for your submission!");
		$(window).attr("location", "index.php");
	});
	
	
	/* Steppers for the submit information page. */
	$("#submit_link").on("click", function() {
	    $("#submit_step1").addClass("active");
		$("#submit_step1_content").removeClass("hide");
		$("#submit_step2_content").addClass("hide");
		$("#submit_step3_content").addClass("hide");
	});
	
    $("#submit_info #step1_click").click(function() {
		$("#submit_step1").removeClass("active").addClass("done");
		$("#submit_step1_content").addClass("hide");
		$("#submit_step2_content").removeClass("hide");
		$("#submit_step2").addClass("active");
	});
	
	$("#submit_info #step2_click").on("click", function() {
		$("#submit_step2").removeClass("active").addClass("done");
		$("#submit_step2_content").addClass("hide");
		$("#submit_step3").addClass("active");
		$("#submit_step3_content").removeClass("hide").addClass("cancel-stepper-border");
	});
	
	$("#submit_info #submit_button").on("click", function() {
		//var location = $("#report_page #report_info #locationTextField").val();
		//var problemType = $("#report_page #report_info #ProblemSelector").val();
		//var description = $("#report_page #report_info textarea").val();
		console.log("click worked");
		//TODO save these values to the db
		alert("Thank you for your submission!");
		$(window).attr("location", "index.php");
	});
});