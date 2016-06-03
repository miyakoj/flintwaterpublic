$(document).ready(function(){
	/* Attach the drawer toggle function to the nav drawer. */	
	$(".drawer").drawer();
	
	/* Activate tooltips. */
	$(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});
	
	/* Position the map element in the correct column. */
	$("#map_container").prepend($("#map"));
  
	/* Size the map based on the window size. */
	var windowHeight = window.innerHeight;
	var mapHeight = windowHeight - $("header").height();
	
	//console.log(windowHeight);
	
	$("#map").css("height", mapHeight);
	
	$("#pac-input").val(""); // clear the search input upon refresh
	
	//$("#search_button").insertAfter("#pac-input");
	//$("#save_button").insertAfter("#search_button");
});