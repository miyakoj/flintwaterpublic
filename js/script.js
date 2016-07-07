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
	
	/* Toggles styles */
	$("#toggles .wrapper, #toggles .list").css("height", $("#toggles label").css("height"));
	$("#toggles .tile").css("min-height", $("#toggles label").css("height"));
	
	/* Position the map element in the correct column. */
	$("#map_container").prepend($("#map"));
  
	/* Size the map based on the window size. */
	var mapHeight = windowHeight - $("#header").outerHeight() - $("#toggles").outerHeight() - $("footer").outerHeight();
	
	$("#map").css("height", mapHeight + "px");
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
	
	/* Mark the tab of the current page as active. */
	$page_id = $("body").attr("id").slice(0, $("body").attr("id").indexOf("_"));
	
	if ($page_id.indexOf("index") != -1)
		$("#map_link").parent().addClass("active");
	else {
		$("#" + $page_id + "_link").parent().addClass("active");
		
		console.log($("#" + $page_id + "_link").parent().parent().parent().attr("id"));
		
		// if the linked clicked is in the "show me" dropdown then also make the "show me" tab active
		if ($("#" + $page_id + "_link").parent().parent().parent().attr("id") == "show_me_menu")
			$("#show_me_menu").addClass("active");
	}
	
	/* Footer slide functionality. */
	//id = $("footer a").attr("id");
	//page = id.slice(0, id.indexOf("_"));
	/*$("footer a").on("click", function() {
	});*/
	
	/* Change the navbar-brand to the page title. */
	/*if ($page_id.indexOf("index") == -1)
		$(".navbar-brand").text($("#main_menu .active span:last-of-type").text());*/
	
	/* Layout mods for differences between desktop and mobile. */
	if (windowWidth < 992) {
		$("#header_top").addClass("clearfix");
		$("#main_menu .nav").removeClass("nav-justified");
		$("#toggles").removeClass("btn-group btn-group-justified");
		$("#show_me_menu").removeClass("dropdown");
		$("#show_me_menu ul").removeClass("dropdown-menu");
		$("#help_video").prependTo("main");
	}
	else {
		// Justify the main tabs only on desktop
		$("#main_menu .nav").addClass("nav-justified");
		$("#toggles").addClass("btn-group btn-group-justified");
		$("#show_me_menu").addClass("dropdown");
		$("#show_me_menu ul").addClass("dropdown-menu");
		
		/* Set the width of the toggle buttons. 
		$(".resource_buttons").css("width", $(".resource_buttons").width()+"px");
		console.log($(".resource_buttons").css("width"));*/
	}
	
	/* Resize the provider info popups. */
	//console.log($("#provider_popup").parent());
	//$("#provider_popup").parent().parent().css("width", "300px");
	
	/* Dynamically added script tags. */
	// MAP API
	var js_api = "<script src='https://www.google.com/jsapi'></script>";
	var map_api = "<script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyAr4wgD-8jV8G7gv600mD75Ht1eS3B4siI&libraries=visualization,places' async defer></script>";
	var map_js = "<script src='js/map.js'></script>";
	var client_api = "<script src='https://apis.google.com/js/client.js?onload=setAPIKey'></script>";
	var news_js = "<script src='js/news.js'></script>";
	var alert_js = "<script src='js/alerts.js'></script>";
	
	/*if ($page_id == "index") {
		$("head script[src*='script']").before(map_api, client_api);
		$("head script[src*='script']").after(map_js, client_api);
	}
	/*else if ($page_id == "news") {
		//$("head script[src*='script']").before(js_api);
		$("head script[src*='script']").after(news_js, alert_js);
	}*/

	/* Test My Water page */
	$("#test_link").on("click", function() {
	    $("#water_step1").addClass("active");
		$("#water_step1_content").removeClass("hide");
		$("#water_step2_content").addClass("hide");
		$("#water_step3_content").addClass("hide");
	});
	
    $("#water_test #step1_click").click(function() {
		$("#water_step1").removeClass("active").addClass("done");
		$("#water_step1_content").addClass("hide");
		$("#water_step2_content").removeClass("hide");
		$("#water_step2").addClass("active");
	});
	
	$("#water_test #step2_click").on("click", function() {
		$("#water_step2").removeClass("active");
		$("#water_step2").addClass("done");
		$("water_step2_content").addClass("hide");
		$("#water_step3").addClass("active");
		$("#water_step3_content").removeClass("hide").addClass("cancel-stepper-border");
	});
	
	$("#water_test #cancel_button").on("click", function() {
		$(window).attr("location", "index.php");
	});
	
	/* Install a WaterFilter page */
	$("#filter_page #step1 #PUR_btn").on("click", function() {
		console.log("filter selected");
		$("#filter_page #step1").css("display", "none");
		$("#filter_page #PUR-Step2").css("display","block");
	});

	$("#filter_page #PUR-Step2 a").on("click", function() {
		console.log("pur step2 btn clicked");
		$("#filter_page #PUR-Step2").css("display", "none");
		$("#filter_page #PUR-Step3").css("display", "block");
	});

	$("#filter_page #PUR-Step3 a").on("click", function() {
		console.log("back to map");
		$(window).attr("location", "index.php");
	});

	$("#filter_page #step1 #Brita_btn").on("click", function() {
		$("#filter_page #step1").css("display", "none");
		$("#filter_page #Brita-Step2").css("display", "block");
	});

	$("#filter_page #Brita-Step2 a").on("click", function() {
		$("#filter_page #Brita-Step2").css("display", "none");
		$("#filter_page #Brita-Step3").css("display", "block");
	});

	$("#filter_page #Brita-Step3 a").on("click", function() {
		$(window).attr("location", "index.php");
	});

	$("#filter_page #step1 #ZeroWater_btn").on("click", function() {
		$("#filter_page #step1").css("display", "none");
		$("#filter_page #ZeroWater-Step2").css("display", "block");
	});

	$("#filter_page #ZeroWater-Step2 button").on("click", function() {
		$(window).attr("location", "index.php");
	});



	/* Clean My Aerator page */
	$("#aerator_page #step1 .btn").on("click", function(){
		$("#aerator_page #step1").css("display","none");
		$("#aerator_page #step2").css("display","block");
	});

	$("#aerator_page #step2 .btn").on("click", function(){
		$("#aerator_page #step2").css("display","none");
		$("#aerator_page #step3").css("display","block");
	});

	$("#aerator_page #step3 .btn").on("click", function(){
		$("#aerator_page #step3").css("display","none");
		$("#aerator_page #step4").css("display","block");
	});

	$("#aerator_page #step4 .btn").on("click", function(){
		$(window).attr("location", "index.php");
	});

	/* Report a Problem page */
	$("#report_page button").on("click", function() {
		//var location = $("#report_page #report_info #locationTextField").val();
		//var problemType = $("#report_page #report_info #ProblemSelector").val();
		//var description = $("#report_page #report_info textarea").val();
		console.log("click worked");
		//TODO save these values to the db
		alert("Thank you for your submission!");
		$(window).attr("location", "index.php");
	});
	
	
	/* Steppers for help pages */
	$("#report_page #locationTextField").on("click", function(){
		$("#stepper1").addClass("active");
	});

	$("#report_page #step2_stuff").on("click", function(){
		$("#stepper2").addClass("active");
	});

	$("#report_page #step3_stuff").on("click", function(){
		$("#stepper3").addClass("active");
	});
});