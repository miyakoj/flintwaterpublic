(function() {
    "use strict";
	
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;
	var $pageId = $("body").attr("id").slice(0, $("body").attr("id").indexOf("_"));

	if ($pageId.indexOf("dashboard") != -1) {
		$.ajax({
			type: "GET",
			url: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA0qZMLnj11C0CFSo-xo6LwqsNB_hKwRbM&libraries=visualization,places",
			dataType: "script",
			cache: true
		});
		
		$.ajax({
			type: "GET",
			url: "https://apis.google.com/js/client.js?onload=setAPIKey",
			dataType: "script",
			cache: true
		});
	}

    // custom scrollbar

    $("html").niceScroll({styler:"fb",cursorcolor:"#242E56", cursorwidth: '6', cursorborderradius: '10px', background: '#F3F3F4', spacebarenabled:false, cursorborder: '0',  zindex: '1000'});

    $(".scrollbar1").niceScroll({styler:"fb",cursorcolor:"rgba(97, 100, 193, 0.78)", cursorwidth: '6', cursorborderradius: '0',autohidemode: 'false', background: '#F1F1F1', spacebarenabled:false, cursorborder: '0'});
	
    $(".scrollbar1").getNiceScroll();
    if ($('body').hasClass('scrollbar1-collapsed')) {
        $(".scrollbar1").getNiceScroll().hide();
    }
	
	/* Size the map based on the window width and height. */
	var mapWidth = $("#map").parent().width();;
	var mapHeight;

	if (windowWidth < 768)
		mapHeight = mapWidth;
	else
		mapHeight = windowHeight - $(".navbar-default").outerHeight() - 150;
	
	$("#map").css({"width": mapWidth, "height": mapHeight});
	
	
	/* Various device size differences. */
	if (windowWidth < 768) {
	}
	else {
		$("#location_card").css({
			left: (($("#map").width() / 2) - ($("#location_card").width() / 2)) + "px",
			bottom: (($("#map").height() / 2) + 10) + "px"
		});
	}

})(jQuery);