/* Google Service Account info */
var clientId = "807599170352-afiu7fosjp2hg4n6gs3ghc99momgfica.apps.googleusercontent.com";
var apiKey = "AIzaSyAr4wgD-8jV8G7gv600mD75Ht1eS3B4siI";

// Access Google Cloud Storage
var default_bucket = "flint-water-project.appspot.com";
var scope = "https://www.googleapis.com/auth/devstorage.read_only";

var map;
var infoWindow;
var heatmap;

var $location_buttons;

var allMarkers = [];
var allMarkersString = [];
var resourceActiveArray = [1, 0, 0, 0, 0, 0];  //heatmap, water pickup, recycle, filter, lead, blood
var location_marker = [];
var marker_img;

//for construction
var constructionMarker ;
var constructionToggle = 0;
var pipePolyLine;

//icons
var bloodIcon ;
var waterpickupIcon ;
var leadTestIcon ;
var recycleIcon ;
var filterIcon ;
var constructionIcon ;

function setAPIKey() {
	gapi.client.setApiKey(apiKey);
	window.setTimeout(checkAuth, 1);
}

function checkAuth() {
	gapi.auth.authorize({client_id: clientId, scope: scope, immediate: true}, initMap);
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 43.021, lng: -83.681},
	  zoom: 13,
	  mapTypeControl:false
	});
	
	/*Centering and resizing*/
	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);
		
		$("#map").css("height", window.innerHeight - $("header").height());
	});
	
	infoWindow = new google.maps.InfoWindow();
	

	callStorageAPI("providers.json");
	callStorageAPI("leadlevels.json");
	//callStorageAPI("construction.json");

	allMarkers.forEach(function(marker) {
		marker.setMap(null);
	});

	//make icons for each resource
	bloodIcon ={url: 'images/bloodtesticon.png',
				size: new google.maps.Size(64,64),
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(0,0),
				scaledSize: new google.maps.Size(45,45)};
	waterpickupIcon ={url: 'images/waterpickupicon.png',
				size: new google.maps.Size(100,100),
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(0,0),
				scaledSize: new google.maps.Size(45,45)};
	leadTestIcon ={url: 'images/leadtesticon.png',
				size: new google.maps.Size(100,100),
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(0,0),
				scaledSize: new google.maps.Size(45,45)};
	recycleIcon ={url: 'images/recycleicon.png',
				size: new google.maps.Size(100,100),
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(0,0),
				scaledSize: new google.maps.Size(45,45)};
	filterIcon ={url: 'images/waterfiltericon.png',
				size: new google.maps.Size(100,100),
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(0,0),
				scaledSize: new google.maps.Size(45,45)};
	constructionIcon ={url: 'images/constructionicon.png',
				size: new google.maps.Size(100,100),
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(0,0),
				scaledSize: new google.maps.Size(45,45)};
	
	//Construction Junk
	var constructionLatLng = {lat:43.019368, lng:-83.668522 };
	var constructionTitle = "Construction Zone";
	var constructionImage = "images/constructionicon.png";
	constructionMarker  = new google.maps.Marker({
		position: constructionLatLng,
		map: map,
		title: constructionTitle,
		icon: constructionIcon
	});

	var constructionContent = "<h1>Construction Zone</h1> <p>Replacing Pipes. Estimated to last 2 weeks</p>";
	bindInfoWindow(constructionMarker,map, infoWindow,constructionContent);

	constructionMarker.setMap(null);

	var pipePlanCoordinates = [
		{lat:43.01826, lng:-83.66875},
		{lat:43.01837, lng:-83.66106},
		{lat:43.022, lng:-83.66128 }
	];

	pipePolyLine = new google.maps.Polyline({
		path: pipePlanCoordinates,
		strokeColor: '#FF0000',
		strokeOpacity: .9,
		strokeWeight: 2
	});

	
	// Create the search box and link it to the UI element.
	var input = document.getElementById('search_input');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});
	
	$("#location_card").css({
		"width": function() {
			return $("#search_input").outerWidth() + parseInt($("#search_button").outerWidth());
		},
		"top": function() {
			return parseInt($("#search_input").css("top")) + parseInt($("#search_input").height()) + 20 + "px";
		},
		"left": function() {
			return parseInt($("#search_input").css("left")) + parseInt($("#search_input").css("margin-left")) + "px";
		}
	});
	
	/* Saved Location Selection Card */
	if ((localStorage.getItem("saved_locations_count") !== null) && (localStorage.saved_locations_count > 0)) {
		$("#location_card .card-inner").html("<h6>Saved Locations</h6>");
		$("#location_card .card-action").css("font-size", "0.5rem");
		
		var saved_locations = "<div id=\"saved_locations\">";
		
		if (localStorage.getItem("saved_location1") !== null) {
			saved_locations += "<div class=\"card-action\"><button type=\"button\" name=\"saved_location1\" class=\"btn btn-flat btn-brand saved-location\"><img src=\"images/savedlocation.png\" /> <span>" + localStorage.getItem("saved_location1") + "</span></button></div>";
		}
		
		if (localStorage.getItem("saved_location2") !== null) {
			saved_locations += "<div class=\"card-action\"><button type=\"button\" name=\"saved_location2\" class=\"btn btn-flat btn-brand saved-location\"><img src=\"images/savedlocation.png\" /> <span>" + localStorage.getItem("saved_location2") + "</span></button></div>";
		}
		
		if (localStorage.getItem("saved_location3") !== null) {
			saved_locations += "<div class=\"card-action\"><button type=\"button\" name=\"saved_location3\" class=\"btn btn-flat btn-brand saved-location\"><img src=\"images/savedlocation.png\" /> <span>" + localStorage.getItem("saved_location3") + "</span></button></div>";
		}
		
		saved_locations += "</div>";
		
		$("#location_buttons").css("display", "none");
		$("#location_card .card-action").append(saved_locations);
		$("#location_card").css("display", "block");
	}
	
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

	  // For each place, get the icon, name and location.
	  var bounds = new google.maps.LatLngBounds();
	  places.forEach(function(place) {
		var icon = {
		  url: place.icon,
		  size: new google.maps.Size(71, 71),
		  origin: new google.maps.Point(0, 0),
		  anchor: new google.maps.Point(17, 34),
		  scaledSize: new google.maps.Size(25, 25)
		};
		
		updateSaveButtons();

		// Create a marker for the place.
		location_marker.push(new google.maps.Marker({
			map: map,
			icon: marker_img,
			title: place.name,
			position: place.geometry.location
		}));

		if (place.geometry.viewport) {
		  // Only geocodes have viewport.
		  bounds.union(place.geometry.viewport);
		}
		else {
		  bounds.extend(place.geometry.location);
		}
	  });
	  
	  map.fitBounds(bounds);
	  
	  /* Location Info Card */
	  $("#location_card").css("display", "block");
		
		/* Display appropriate lead rating and message. */
		var lead_prediction = "Predicted low lead levels";
		var lead_meter = "[lead rating]";
		var lead_msg = "OK to use filtered water, except children under 6 and pregnant women.";		
		$("#location_card .card-inner").html("<h6>" + lead_prediction + "</h6> <p>" + lead_meter + "</p> <p>" + lead_msg + "</p>");
	});
	
	//303 E Kearsley St, Flint, MI, United States
	
	console.log(localStorage);
	
	$("#search_button").css({
		"top": function() {
				return $("header").outerHeight() + $("#toggles").outerHeight() + 20;
			   }
	});
	
	// Check the saved locations if enter is pressed while in the search box
	$("#search_input").keydown(function( event ) {
		if (event.which == 13)
			updateSaveButtons();
	});
	
	// Trigger search on button click
    $("#search_button").click(function() {
		//if(activeSearch){
			var input = document.getElementById('search_input');

			google.maps.event.trigger(input, 'focus');
			google.maps.event.trigger(input, 'keydown', {
				keyCode: 13
			});
			
			updateSaveButtons();
		//}	
    });
	
	var save_location_msg = "Save This Location";
	var saved_location_msg = "Saved Location";

	
	/* Disable the save button if there are already three saved locations. */
	if ((Number(localStorage.saved_locations_count) == 3) && ($("#saved_location_button span").text() == save_location_msg))
		$("#saved_location_button").attr("disabled", "disabled");
	
	/* Show/hide buttons and dymaically set different button text. */
	function updateSaveButtons() {
		$("#saved_locations").css("display", "none"); // hide saved locations
		$("#location_buttons").css("display", "block"); // unhide location buttons
			
		var searched_location = $("#search_input").val();
		var searched_location_sub = searched_location.substring(1,searched_location.length);

		console.log(localStorage.saved_location1);
		console.log(searched_location_sub);
		console.log(searched_location);
		
		marker_img = "images/savedlocation.png"; // saved location icon by default
		
		if (localStorage.saved_location1 === searched_location_sub)
			$("#saved_location_button span").text(saved_location_msg);
		else if (localStorage.saved_location2 === searched_location_sub)
			$("#saved_location_button span").text(saved_location_msg);
		else if (localStorage.saved_location3 === searched_location_sub)
			$("#saved_location_button span").text(saved_location_msg);
		else {
			$("#saved_location_button span").text(save_location_msg);
			marker_img = "images/locationicon.png";
		}
		
		console.log(localStorage);
	}
	
	/*if (localStorage.getItem("saved_location2") !== null) {
		localStorage.removeItem("saved_location2");
		localStorage.setItem("saved_locations_count", Number(localStorage.saved_locations_count) - 1);
	}*/
	
	// Save a location to HTML5 local storage when the save button is clicked	
    $("#saved_location_button").on("click", function() {
		if ($("#search_input").val() != "") {
			if (typeof(Storage) !== "undefined") {
				if ($("#location_card #saved_location_button span").text() == save_location_msg) {
					if (localStorage.getItem("saved_locations_count") !== null) {
						if (localStorage.saved_locations_count < 3)
							localStorage.saved_locations_count = Number(localStorage.saved_locations_count) + 1;
						else
							console.log("There are no free saved locations.");
					}
					else
						localStorage.saved_locations_count = 1;
					
					localStorage.setItem("saved_location" + Number(localStorage.saved_locations_count), $("#search_input").val());
					marker_img = "images/savedlocation.png";					
					card_location_img = "images/locationicon.png";
					$("#location_card #saved_location_button span").text(saved_location_msg);
				}
				else { // remove location
					var searched_location = $("#search_input").val();
					localStorage.setItem("saved_locations_count", Number(localStorage.saved_locations_count) - 1);
				
					$("#saved_location_button span").text(save_location_msg);

					if (localStorage.saved_location1 == searched_location) {
						localStorage.removeItem("saved_location1");
					}
					else if (localStorage.saved_location2 == searched_location) {
						localStorage.removeItem("saved_location2");
					}
					else if (localStorage.saved_location3 == searched_location) {
						localStorage.removeItem("saved_location3");
					}
					card_img = "images/savedlocation.png";
					card_marker_img = "images/locationicon.png";
				}
				
				location_marker[0].setIcon(marker_img);
				$("#location_card #saved_location_button img").attr("src",card_marker_img);
				console.log(localStorage);
			}
			else {
				console.log("There is no local storage support.");
			}
		}
		else
			console.log("The search input is empty.");
	});


	$("#more_info_button").on("click", function(){		
		if($(this).text() === "More Info"){
			console.log("currently more info");
			$(this).text("Less Info");
			$("#location_card .card-inner").append("<p class=\"more-info\">More Info</p>");
		}
		else{
			console.log("currently less info");
			$(this).text("More Info");
			$(".more-info").remove();
		}
	});
}

/* Calls the Google Cloud Storage API and reads in the JSON files created from the database data. */
function callStorageAPI(object) {
	gapi.client.load('storage', 'v1').then(function() {
		var request = gapi.client.storage.objects.get({
			'bucket': default_bucket,
			'object': object,
			'alt': 'media'
		});
		
		request.then(function(resp) {
			/* Heatmap Data */
			if (object == "leadlevels.json") {
				var heatmapData = [];
				js_obj = $.parseJSON(resp.body);
				
				/*for(i=0; i<js_obj.leadLevels.length; i++) {
					var info = js_obj.leadLevels[i];
					var weightValue = assignWeight(info.leadLevel);
					heatmapData.push({location: new google.maps.LatLng(info.latitude, info.longitude), weight: weightValue});
				}*/
				
				for(i=0; i<js_obj.leadLevels.length; i++) {
					var info = js_obj.leadLevels[i];
					var weightValue = assignWeight(info.lead_ppb);
					heatmapData.push({location: new google.maps.LatLng(info.lat, info.long), weight: weightValue});
				}
				
				function assignWeight(levelIn){
					if (levelIn < 5){
						return 0;
					}
					else if (levelIn < 14){
						return 0;
					}
					else if(levelIn < 50){
						return 50;
					}
					else {
						return 100;
					}
				}
				
				heatmap = new google.maps.visualization.HeatmapLayer({
					 data: heatmapData,
					 radius: 25,
					 dissipate: true,
					 gradient: ['rgba(0,0,0,0)',
								'rgba(255,255,0,1)',
								'rgba(213,109,0,1)',
								'rgba(255,0,0,1)',
								'rgba(128,0,0,1)']
				});
				console.log("heatmap is initiatded");
				//heatmap.setMap(map);
				setUpInitialMap();
			}
			/* Provider Data */
			else if (object == "providers.json") {
				js_obj = $.parseJSON(resp.body);
				
				for(i=0; i<js_obj.providers.length; i++) {
					var provider = js_obj.providers[i];
					var latLng = new google.maps.LatLng(provider.latitude, provider.longitude);
					var title = provider.locationName;
					
					var images = "";
					
					if (provider.resType.indexOf("Water Pickup") != -1) {
						marker_img = "images/waterpickupicon.png";
						images += "<img src='" + marker_img + "' class='marker_window_icons' />";
					}
					if (provider.resType.indexOf("Recycle") != -1) {
						marker_img = "images/recycleicon.png";
						images += "<img src='" + marker_img + "' class='marker_window_icons'/>";
					}
					if (provider.resType.indexOf("Blood Testing") != -1) {
						marker_img = "images/bloodtesticon.png";
						images += "<img src='" + marker_img + "' class='marker_window_icons'/>";
					}
					if (provider.resType.indexOf("Water Filters") != -1) {
						marker_img = "images/waterfiltericon.png";
						images += "<img src='" + marker_img + "' class='marker_window_icons'/>";
					}
					if (provider.resType.indexOf("Test Kits") != -1) {
						marker_img = "images/leadtesticon.png";
						images += "<img src='" + marker_img + "' class='marker_window_icons'/>";
					}
					
					allMarkersString.push(images);
					var content = "<div id=\"provider_popup\"><h1>" + provider.locationName + "</h1> <p>" + provider.aidAddress + "</p><p>" + images + "</p></div>";


					var marker = new google.maps.Marker({
						position: latLng,
						title: title,
						map: map
					});
					
					/* Store the markers in arrays for the add/remove functionality. */
					allMarkers.push(marker);
					
					bindInfoWindow(marker, map, infoWindow, content);
				}

				for(var i=0; i<allMarkers.length;i++) {
					allMarkers[i].setMap(null);
				}
			}
			/* Construction Data */
			/*else if (object == "construction.json") {
			}*/
				
		}, function(reason) {
			console.log('Error: ' + reason.result.error.message);
		});
	});
}

function setUpInitialMap(){
	console.log("Get Array");
		if (localStorage !== "undefined") {
     		var retrieveArray = localStorage.getItem("water_test_array");
       		resourceActiveArray = JSON.parse(retrieveArray);


     		var temp = [1,0,0,0,0,0];
			localStorage.setItem("water_test_array", JSON.stringify(temp));
     	}
    	else {
      		console.log("We suck");
    	}
    	setMarkers();

		if(resourceActiveArray[0] == 1) {
			$("#heatmap_btn").addClass("active");
		}
		if(resourceActiveArray[1] == 1) {
			$("#water_pickup_btn").addClass("active");
		}
		if(resourceActiveArray[2] == 1) {
			$("#recycling_btn").addClass("active");
		}
		if(resourceActiveArray[3] == 1) {
			$("#water_filters_btn").addClass("active");
		}
		if(resourceActiveArray[4] == 1) {
			$("#water_testing_btn").addClass("active");
		}
		if(resourceActiveArray[5] == 1) {
			$("#blood_testing_btn").addClass("active");
		}
		if(constructionToggle == 1) {
			$("#construction_btn").addClass("active");
		}
}

function bindInfoWindow(marker, map, infowindow, html){
	marker.addListener("click", function(){
		infowindow.setContent(html);
		infowindow.open(map, this);
	});
}

$(document).ready(function() {
	/* Get the data from the database and save it into JSON files. */
	$.ajax({
		method: "POST",
		url: "includes/json_processing.php",
		complete: function(resp) {
			if (resp.responseText == "error") {
				$(".alert-warning").append("<strong>Error:</strong> The map data didn't load successfully.")
				$(".alert-warning").css("display", "block");
			}
		}
	});
	
	//localStorage.clear();
	
	$("#heatmap_btn").on('click', function() {	
    	console.log(resourceActiveArray);
		if (resourceActiveArray[0] == 1) {
			resourceActiveArray[0] = 0;
		}
		else {
			resourceActiveArray[0] = 1;
		}
		setMarkers();
	});
	
	/*$("[name='risk_factor']").on('click', function() {		
		if (riskmap.getMap() != null) {
			riskmap.setMap(null);
		}
		else {
			riskmap.setMap(map);
		}
	});*/

	$("#water_pickup_btn").on('click', function(){
		if (resourceActiveArray[1] == 1) {
			resourceActiveArray[1] = 0;
		}
		else {
			resourceActiveArray[1] = 1;
		}
		setMarkers();
	});

	$("#recycling_btn").on('click', function(){
		if (resourceActiveArray[2] == 1) {
			resourceActiveArray[2] = 0;
		}
		else {
			resourceActiveArray[2] = 1;
		}
		setMarkers();
	});

	$("#water_testing_btn").on('click', function(){
		if (resourceActiveArray[4] == 1) {
			resourceActiveArray[4] = 0;
		}
		else {
			resourceActiveArray[4] = 1;
		}
		setMarkers();
	});

	$("#blood_testing_btn").on('click', function(){
		if (resourceActiveArray[5] == 1) {
			resourceActiveArray[5] = 0;
		}
		else {
			resourceActiveArray[5] = 1;
		}
		setMarkers();
	});

	$("#water_filters_btn").on('click', function(){
		if (resourceActiveArray[3] == 1) {
			resourceActiveArray[3] = 0;
		}
		else {
			resourceActiveArray[3] = 1;
		}
		setMarkers();
	});

	$("#construction_btn").on('click', function(){
		if (constructionToggle == 1) {
			constructionToggle = 0;
		}
		else {
			constructionToggle = 1;
		}
		setMarkers();
	});

	/* When a saved location is clicked, put the location in search bar and search. */
	$(document).on('click', '.saved-location', function() {
		$('#search_input').val($(this).text());
		$('#search_button').click();
	});
	
	$("#search_input").keyup(function() {
		if($("#search_input").val()) {
			$("#search_button").css("color", "#FFF");
			activeSearch = 1;
		}
		else {
			$("#search_button").css("color", "#61b1ff");
			activeSearch = 0;
		}
	});

	$("#test_page #step1 a").on("click", function(){
		if (localStorage !== "undefined") {
     		resourceActiveArray = [0,0,0,0,1,0];
			localStorage.setItem("water_test_array", JSON.stringify(resourceActiveArray));
     	}
    	else {
      		console.log("We suck");
    	}
		$(window).attr("location", "index.php");
	}); 
});
	/* Set markers on the map based on type. */
	function setMarkers() {  
		if(resourceActiveArray[0] == 1 && heatmap.getMap() != map) {
				console.log("heatmap is trying to be set");
				heatmap.setMap(map);
		}
		else if (heatmap.getMap() == map) {
			
		}
		else {
			heatmap.setMap(null);
		}
		for (var i = 0; i < allMarkers.length; i++){
			allMarkers[i].setMap(null);
			if(resourceActiveArray[5]==1 && allMarkersString[i].search("blood") >-1){
				allMarkers[i].setIcon(bloodIcon);
				allMarkers[i].setMap(map);
			}
			else if(resourceActiveArray[4]==1 && allMarkersString[i].search("lead") >-1){
				allMarkers[i].setIcon(leadTestIcon);
				allMarkers[i].setMap(map);
			}
			else if(resourceActiveArray[3]==1 && allMarkersString[i].search("filter") >-1){
				allMarkers[i].setIcon(filterIcon);
				allMarkers[i].setMap(map);
			}
			else if(resourceActiveArray[2]==1 && allMarkersString[i].search("recycle") > -1){
				allMarkers[i].setIcon(recycleIcon);
				allMarkers[i].setMap(map);
			}
			else if(resourceActiveArray[1]==1 && allMarkersString[i].search("water") > -1){
				allMarkers[i].setIcon(waterpickupIcon);
				allMarkers[i].setMap(map);
			}
			if(constructionToggle==1){
				constructionMarker.setMap(map);
				pipePolyLine.setMap(map);
			}
			else{
				constructionMarker.setMap(null);
				pipePolyLine.setMap(null);
			}
		}
	}