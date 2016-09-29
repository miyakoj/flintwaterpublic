var width = window.innerWidth;
var height = window.innerHeight;
var $pageId = $("body").attr("id").slice(0, $("body").attr("id").indexOf("_"));

if ($pageId.indexOf("dashboard") != -1) {
	$.ajax({
		type: "GET",
		url: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA0qZMLnj11C0CFSo-xo6LwqsNB_hKwRbM&libraries=visualization,places",
		dataType: "script",
		cache: true
	});
}

$(document).ready(function(){
	/* Size the map based on the window width and height. */
	var mapWidth;
	var mapHeight;

	if (width < 768) {
		mapWidth = $("#map").parent().width();
		mapHeight = mapWidth * 0.75;
	}
	else {
		mapWidth = $("#map").parent().width();
		mapHeight = mapWidth * 0.75;
	}
	
	$("#map").css({"width": mapWidth, "height": mapHeight});
});