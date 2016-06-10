$(document).ready(function(){
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;
	
	/* Position alert in the middle of the page. */
	$(".alert").css({"top": (windowHeight - $(".alert").height()) / 2, "left": (windowWidth - $(".alert").width()) / 2});
	
	/* Activate tooltips. */
	$(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});
	
	/* Dynamically adjust the line-height of the dropdown links by the link height. */
	$(".dropdown-menu a").css("line-height", $(".dropdown-menu a").css("min-height"));
	
	/* Position the map element in the correct column. */
	$("#map_container").prepend($("#map"));
  
	/* Size the map based on the window size. */
	var mapHeight = windowHeight - $("header").outerHeight() - $("#toggles").outerHeight() - $("footer").outerHeight();
	
	$("#map").css("height", mapHeight);
	$("#search_input").val(""); // clear the search input upon refresh
	
	/* Dynamically generate page links. */
	var id;
	var page;
	
	$(".nav a").each(function(i) {
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
				$(this).attr("href", "page.php?pid=" + page);
			}
			else if (id.indexOf("lang") != -1) {
				page = id.slice(id.indexOf("_") + 1, id.length);
				$(this).attr("href", page);
			}
		}
	});
	
	id = $("footer a").attr("id");
	page = id.slice(0, id.indexOf("_"));
	$("footer a").attr("href", "page.php?pid=" + page);
	
	/* Mark the tab of the current page as active. */
	//$(this).parent().addClass("active");
	$page_id = $("body").attr("id").slice(0, $("body").attr("id").indexOf("_"));
	$to_find = "[id='" + $page_id + "_link']";
	console.log($("body").attr("id"));
	$(".navbar").find($to_find).parent().addClass("active")
	
	/* Resize the provider info popups. */
	//console.log($("#provider_popup").parent());
	//$("#provider_popup").parent().parent().css("width", "300px");
	
	//$("#search_button").insertAfter("#pac-input");
	//$("#save_button").insertAfter("#search_button");
});