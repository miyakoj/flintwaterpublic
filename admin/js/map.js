/* Admin-only customizations to the map. */
resourceActiveArray = [0, 0, 0, 0, 0, 0, 0, 0];

/* Wait until the Google Client API key has been initialized. */
window.setTimeout(function() {
	if ((typeof(gapi.client) !== "undefined"))
		callStorageAPI("leadLevels_birdview.json");
}, 3000);

(function() {
	if (typeof(Storage) !== "undefined") {
		$("#heatmap_btn").on("click", function() {
			$("#resource_card, #location_card").hide();
			
			if (resourceActiveArray[0] == 1) {
				resourceActiveArray[0] = 0;
				$("#heatmap_btn").removeClass("active");
			}
			else {
				resourceActiveArray[0] = 1;
				$("#heatmap_btn").addClass("active");
			}
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});

		$("#water_pickup_btn").on("click", function() {
			$("#resource_card, #location_card").hide();
			
			if (resourceActiveArray[1] == 1) {
				resourceActiveArray[1] = 0;
				$("#water_pickup_btn").removeClass("active");
			}
			else {
				resourceActiveArray[1] = 1;
				$("#water_pickup_btn").addClass("active");
			}
			
			if (map.getZoom() > 15)
				map.setZoom(15);
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});

		$("#recycling_btn").on("click", function() {
			$("#resource_card, #location_card").hide();
			
			if (resourceActiveArray[2] == 1) {
				resourceActiveArray[2] = 0;
				$("#recycling_btn").removeClass("active");
			}
			else {
				resourceActiveArray[2] = 1;
				$("#recycling_btn").addClass("active");
			}
			
			if (map.getZoom() > 15)
				map.setZoom(15);
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});

		$("#water_testing_btn").on("click", function() {
			$("#resource_card, #location_card").hide();
			
			if (resourceActiveArray[4] == 1) {
				resourceActiveArray[4] = 0;
				$("#water_testing_btn").removeClass("active");
			}
			else {
				resourceActiveArray[4] = 1;
				$("#water_testing_btn").addClass("active");
			}
			
			if (map.getZoom() > 15)
				map.setZoom(15);
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});

		$("#blood_testing_btn").on("click", function() {
			$("#resource_card, #location_card").hide();
			
			if (resourceActiveArray[5] == 1) {
				resourceActiveArray[5] = 0;
				$("#blood_testing_btn").removeClass("active");
			}
			else {
				resourceActiveArray[5] = 1;
				$("#blood_testing_btn").addClass("active");
			}
			
			if (map.getZoom() > 14)
				map.setZoom(14);
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});

		$("#water_filters_btn").on("click", function() {
			$("#resource_card, #location_card").hide();
			
			if (resourceActiveArray[3] == 1) {
				resourceActiveArray[3] = 0;
				$("#water_filters_btn").removeClass("active");
			}
			else {
				resourceActiveArray[3] = 1;
				$("#water_filters_btn").addClass("active");
			}
			
			if (map.getZoom() > 15)
				map.setZoom(15);
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});

		$("#pipes_btn").on("click", function() {
			$("#resource_card, #location_card").hide();
			
			if (resourceActiveArray[6] == 1) {
				resourceActiveArray[6] = 0;
				$("#pipes_btn").removeClass("active");
				
				for (var i=0; i<constructionMarkers.length; i++)
					constructionMarkers[i].setMap(null);
			}
			else {
				resourceActiveArray[6] = 1;
				$("#pipes_btn").addClass("active");
				
				for (var i=0; i<constructionMarkers.length; i++)
					constructionMarkers[i].setMap(map);
			}
			
			if (map.getZoom() > 15)
				map.setZoom(15);
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});
	}
	else {
		console.log("No local storage support.");
		$("#page_alert button").after("You are using an unsupported browser. We recommend using Firefox 45.3+ or Chrome 53+ for the best experience.");
		$("#page_alert").addClass("alert-info").show();
		window.stop(); // stop loading the page
	}
})(jQuery);