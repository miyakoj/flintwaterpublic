$(document).ready(function(){
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;
	
	/* Attach the drawer toggle function to the nav drawer. */	
	$(".drawer").drawer();
	
	/* Position alert in the middle of the page. */
	$(".alert").css({"top": (windowHeight - $(".alert").height()) / 2, "left": (windowWidth - $(".alert").width()) / 2});
	
	/* Activate tooltips. */
	$(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});
	
	/* Activate and position the info cards. */
	
	
	/* Position the map element in the correct column. */
	$("#map_container").prepend($("#map"));
  
	/* Size the map based on the window size. */
	var mapHeight = windowHeight - $("header").height() - $("#toggles").height();
	
	$("#map").css("height", mapHeight);	
	$("#pac-input").val(""); // clear the search input upon refresh
	
	/* Resize the provider info popups. */
	//console.log($("#provider_popup").parent());
	//$("#provider_popup").parent().parent().css("width", "300px");
	
	//$("#search_button").insertAfter("#pac-input");
	//$("#save_button").insertAfter("#search_button");
});