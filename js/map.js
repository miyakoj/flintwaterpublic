/* Google Service Account info */
var clientId = "322504400471-ou3nftefgmhpnbj4v3nv08b16nepdngg.apps.googleusercontent.com";
var apiKey = "AIzaSyA0qZMLnj11C0CFSo-xo6LwqsNB_hKwRbM";

// Access Google Cloud Storage
var defaultBucket = "h2o-flint.appspot.com";
var scopes = "https:// www.googleapis.com/auth/devstorage.read_only https://www.googleapis.com/auth/fusiontables.readonly";

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var $pageId = $("body").attr("id").slice(0, $("body").attr("id").indexOf("_"));

var map;
var mapCenter = {lat: 43.021, lng: -83.681};
var zoomLvl;
var geocoder;
var autocomplete;
var infoWindow;
var heatmap;
var fusionTableAllId = "17nXjYNo-XHrHiJm9oohgxBSyIXsYeXqlnVHnVrrX";
var leadLayer; // fusion table layer to set up lead levels
var leadLayerBirdViewMarkers = [];
//var leadLayerBirdView_info;
var leadAndPredictiveLayer; // fusion table layer to show both lead and prediction layer
var heatmapData;

var $locationButtons;

var savedMarkers = [];
var allMarkers = [];
var allMarkersString = [];
var resourceActiveArray = [1, 0, 0, 0, 0, 0, 0, 0];  // lead levels, water pickup, recycle, filter, lead, blood, construction, prediction
var oldResourceActiveArray; // the saved resource array that's stored when the user visits the "test my water" or "report" pages
var savedLocationMarkers = [];
var constructionMarkers = [];
var locationMarker;
var clickedMarker;
var markerImg;
var savedLocationTotal;

var savedIcon;
// resource marker that is clicked or last clicked
var resourceMarker;

// for construction
var constructionMarker;
var pipeToggle = 0;

// for water plant
var waterplantMarker;

// for pipe visualization
var arrayOfLines = new Array();
var masterPipeArray = new Array();
var autoPolyLine;

// icons
var bloodIcon;
var waterPickupIcon;
var leadTestIcon;
var recycleIcon;
var filterIcon;
var pipesIcon;
var constructionIcon;
var waterPlantIcon;
var locationIcon;
var savedResourceIcon;
var savedLocationIcon;
var iconSize = 30;

/* The admin site uses the same map.js so the folder depth has to be compensated for. */
if (location.href.indexOf("admin"))
	$folderPrefix = "../";
else
	$folderPrefix = "";

/* Meters for predicted risk. */
var unknownRiskSrc = $folderPrefix+"images/unknownbar.png";
var lowRiskSrc = $folderPrefix+"images/lowbar.png";
var moderateRiskSrc = $folderPrefix+"images/moderatebar.png";
var highRiskSrc = $folderPrefix+"images/highbar.png";

/* Circles for lead data. */
var unknownRiskCircle = $folderPrefix+"images/unknownrisklevel.png";
var lowRiskCircle = $folderPrefix+"images/lowrisklevel.png";
var medRiskCircle = $folderPrefix+"images/medrisklevel.png";
var highRiskCircle = $folderPrefix+"images/highrisklevel.png";

var leadLevelOfInput;

/* Stores fusion table query callbacks. */
window.jsonpCallbacks = {};

function setAPIKey() {
	gapi.client.setApiKey(apiKey);
	gapi.load("client:auth2", checkAuth);
}

function checkAuth() {
	gapi.auth2.init({
		client_id: clientId,
		scope: scopes
	}).then(function() {
	  initMap();
	});
}

function initMap() {
	$("#resource_card, #location_card").hide();
	
	attachLegendCard();

	/* Position the map in the correct element if it exists on the page. */
	if($("#search_input").length != 0)
		$("#map_container #search_input").after($("#map"));
  
	/* Size the map based on the window size. */
	var mapHeight;
	
	if (windowHeight < 800)
		mapHeight = windowHeight - $("#header").outerHeight() - $("#toggles").outerHeight() - ($("#legend").outerHeight()) - 25;
	else
		mapHeight = windowHeight - $("#header").outerHeight() - $("#toggles").outerHeight() - parseInt($("footer #site_desc").css("line-height"));

	$("#map_container").css("height", mapHeight + "px");
	
	$("#search_input").val(""); // clear the search input upon refresh

	map = new google.maps.Map(document.getElementById('map'), {
	  center: mapCenter,
	  zoom: 13,
	  mapTypeControl: false
	});
    
	//This hides all POIs on map
	var noPoi = [
	{
    featureType: "poi.attraction",
    stylers: [
      { visibility: "off" }
    ]   
	},
	{
    featureType: "poi.business",
    stylers: [
      { visibility: "off" }
    ]   
	},
	{
    featureType: "poi.government",
    stylers: [
      { visibility: "off" }
    ]   
	},
	{
    featureType: "poi.medical",
    stylers: [
      { visibility: "off" }
    ]   
	},
	{
    featureType: "poi.park",
    stylers: [
      { visibility: "off" }
    ]   
	},
	{
    featureType: "poi.place_of_worship",
    stylers: [
      { visibility: "off" }
    ]   
	},
	{
    featureType: "poi.school",
    stylers: [
      { visibility: "off" }
    ]   
	},
	{
    featureType: "poi.sports_complex",
    stylers: [
      { visibility: "off" }
    ]   
	},
	{
    featureType: "transit.station",
    stylers: [
      { visibility: "off" }
    ]   
	}
	];

	map.setOptions({styles: noPoi});
	
	geocoder = new google.maps.Geocoder();
	
	/* Centering and resizing */
	google.maps.event.addDomListener(window, "resize", function() {
		google.maps.event.trigger(map, "resize");
		map.setCenter(mapCenter);
		
		$("#map").css({
			"height": function() {
				window.innerHeight - $("header").outerHeight() - $("#toggles .list").outerHeight();
			}
		});
	});
	
	infoWindow = new google.maps.InfoWindow();

	allMarkers.forEach(function(marker) {
		marker.setMap(null);
	});

	// make icons for each resource
	bloodIcon = {
		url: $folderPrefix+"images/bloodtest_circle_icon.png",
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	waterPickupIcon = {
		url: $folderPrefix+"images/water_pickup_circle_icon.png",
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	leadTestIcon = {
		url: $folderPrefix+"images/lead_test_circle_icon.png",
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	recycleIcon = {
		url: $folderPrefix+"images/recycle_circle_icon.png",
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	filterIcon = {
		url: $folderPrefix+"images/water_filter_circle_icon.png",
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	pipesIcon = {
		url: $folderPrefix+"images/pipes_icon.png",
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	constructionIcon = {
		url: $folderPrefix+"images/construction_icon.png",
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	waterplantIcon = {
		url: $folderPrefix+"images/water_plant_icon.png",
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	savedResourceIcon = {
		url: $folderPrefix+"images/saved_resource_icon.png",
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0,0),
		size: new google.maps.Size(64,64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	locationIcon = {
		url: $folderPrefix+"images/location_icon.png",
		size: new google.maps.Size(64, 64),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	  };
	savedLocationIcon = {
		url: $folderPrefix+"images/saved_location_icon.png",
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0,0),
		size: new google.maps.Size(64,64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	
	if ($pageId.indexOf("dashboard") != -1)
		callStorageAPI("leadLevels_birdview.json");
	
	//callStorageAPI("leadlevels.json");
	
	callStorageAPI("providers.json");
	callStorageAPI("pipedata.json");
	callStorageAPI("construction_sites.json");
	
	setUpFusionTable();
	
	// Create a marker for the place.
	locationMarker = new google.maps.Marker({map: map});
	
	/* Load saved non-resource locations. */
	var numberSaved = parseInt(localStorage["numberSaved"]);
	
	if (!isNaN(numberSaved) && (numberSaved > 0)) {
		for (var i = 1; i <= numberSaved; i++) {
			var query = "SELECT 'latitude', 'longitude', 'abandoned', 'leadLevel', 'testDate', 'prediction' FROM " + fusionTableAllId + " WHERE address LIKE '" 
				+ localStorage.getItem("savedLocationAddress"+i) + "' ORDER BY 'testDate' DESC";
			
			/* Based on code found here: http://stackoverflow.com/questions/21373643/jquery-ajax-calls-in-a-for-loop#21373707 */
			(function(index){
				window.jsonpCallbacks["fusionQueryCallback"+index] = function(data) {
					var locationPosition = localStorage.getItem("savedLocationPosition"+index);
					var latitude = parseFloat(locationPosition.slice(1, locationPosition.indexOf(",")));
					var longitude = parseFloat(locationPosition.slice(locationPosition.indexOf(" ")+1, locationPosition.indexOf(")")));
					
					var tempLocationMarker = new google.maps.Marker({
						position: {lat:latitude, lng:longitude},
						map: map,
						icon: savedLocationIcon
					});
					
					var streetAddress = localStorage.getItem("savedLocationAddress"+index);
					var content = fusionQueryCallback(data, streetAddress);
					attachLocationCard("savedLocation", tempLocationMarker, streetAddress, content);
					
					savedMarkers.push(tempLocationMarker);
					savedLocationMarkers.push(tempLocationMarker);
				};
			})(i);
			
			queryFusionTable(query, "jsonpCallbacks.fusionQueryCallback"+i);
		}
	}
	
	// Water Plant Stuff
	var waterplantLatLng = {lat:43.056269, lng:-83.669625};
	var waterplantTitle = "City of Flint Water Plant";
	var waterplantImage = $folderPrefix+"images/water_plant_icon.png";
	waterplantMarker = new google.maps.Marker({
		position : waterplantLatLng,
		map: map,
		title: waterplantTitle,
		icon: waterplantIcon
	});
	
	var waterplantContent = "<h1>City of Flint Water Plant</h1> <p>4500 N Dort Hwy, Flint, MI 48505</p>";
	bindInfoWindow("waterplant", waterplantMarker, map, infoWindow, waterplantContent);	
	waterplantMarker.setMap(null);
	
	// Create the search box and link it to the UI element.
	var input = document.getElementById('search_input');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	
	// Changes CSS to make search bar visible, making sure it isn't displayed before the map
	map.addListener('idle', function() {
		$("#search_input").css("display", "block");
	});
	
	$("#search_input").keyup(function() {
		if ($("#search_input").val())
			activeSearch = 1;
		else 
			activeSearch = 0;
	});
	
	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});

	// If the map is clicked, hide the resource and location cards, show the legend
	 map.addListener('click', function() {
    	$("#resource_card, #location_card").hide();
		$("#legend_card").show();
  	});
	
	/*if ($pageId.indexOf("dashboard") != -1) {
		map.addListener('zoom_changed', function() {
			var zoomLvl = map.getZoom();
			if (resourceActiveArray[0] == 1 && zoomLvl < 16) {
				leadAndPredictiveLayer.setMap(null);
				for (var i = 0; i < leadLayerBirdViewMarkers.length; i++) {
					leadLayerBirdViewMarkers[i].setMap(map);
				}
			}
			else if (resourceActiveArray[0] == 1 && zoomLvl >= 16) {
				leadAndPredictiveLayer.setMap(map);
				for (var i = 0; i < leadLayerBirdViewMarkers.length; i++) {
					leadLayerBirdViewMarkers[i].setMap(null);
				}
			}
		 });
	}*/
	
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();
		var place = places[0];
		if (places.length == 0)
			return;

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
	  
		// Update the location marker for the address searched.
		locationMarker = new google.maps.Marker({map: map});
		locationMarker.setTitle(place.name);
		locationMarker.setIcon(locationIcon);

		if (place.geometry.viewport)
			bounds.union(place.geometry.viewport);
		else
			bounds.extend(place.geometry.location);
	  
		updateLocationZoom();
	  
		map.fitBounds(bounds);

		/* Display appropriate lead rating and message. */
		var inputAddress = place.formatted_address.split(',');
		var streetAddress = inputAddress[0];
		
		var query = "SELECT 'latitude', 'longitude', 'abandoned', 'leadLevel', 'testDate', 'prediction' FROM " + fusionTableAllId + " WHERE address LIKE '" 
					+ streetAddress + "' ORDER BY 'testDate' DESC";
					
		console.log(query);
					
		/* Based on code found here: http://stackoverflow.com/questions/21373643/jquery-ajax-calls-in-a-for-loop#21373707 */
		window.jsonpCallbacks["searchQueryCallback"] = function(data) {
			if (data.rows != undefined)
				locationMarker.setPosition({lat: data.rows[0][0], lng: data.rows[0][1]});
			else
				locationMarker.setPosition({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
			
			var content = fusionQueryCallback(data, streetAddress);
			createLocationCardContent("location", content);
			attachLocationCard("location", locationMarker, streetAddress, content);
			
			savedMarkers.push(locationMarker);
			savedLocationMarkers.push(locationMarker);
		};
		
		queryFusionTable(query, "jsonpCallbacks.searchQueryCallback");
		checkIfSaved(locationMarker.getPosition());
		
		$("#location_card .card-action").show();
		$("#location_card").show();
	});
	
	// Check the saved locations if enter is pressed while in the search box
	$("#search_input").on("keydown", function(event) {
		$("#resource_card").hide();
		
		if (event.which == 13)
			updateLocationZoom();
	});
	
	// hide the location card if the search box is empty
	$("#search_input").on("change", function(event) {
		$("#resource_card").hide();
		
		if ($(this).val() == "")
			$("#location_card").hide();
	});
	
	/* Show/hide buttons and dymaically set different button text. */
	function updateLocationZoom() {		
		var searched_location = $("#search_input").val();		

	    if (map.getZoom() < 14)
			map.setZoom(25);
		else
			map.setZoom(20);

	}

	$("#location_card #more_info_button").on("click", function() {	
		if ($("#more_info_button span").text() === "More Info")
			$("#more_info_button span").text("Less Info");
		else
			$("#more_info_button span").text("More Info");
	});
	
	setupResourceMarkers();
}

/* Search bar autocomplete. */
function initAutocomplete(inputId) {
	var input = document.getElementById(inputId);
	var autocomplete = new google.maps.places.Autocomplete(input, {
		bounds: new google.maps.LatLngBounds({lat: 43.021, lng: -83.681}),
		types: ['geocode']
	});
	
	return autocomplete;
}

function setUpFusionTable() {
	leadAndPredictiveLayer = new google.maps.FusionTablesLayer({
	    query: {
	      	select: "geometry",
	      	from: "1Kxo2QvMVHbNFPJQ9c9L3wbKrWQJPkbr_Gy90E2MZ"
	    }, 
	    options: {
			suppressInfoWindows: "true"
	    },
		styles: [{
			where: "leadLevel == -1",
			polygonOptions: {
			  fillColor: "#999999",
			  fillOpacity: 0.5,
			  strokeColor: "#999999",
			  strokeWeight: 1
			}
		  },
		  {
			where: "leadLevel >= 0 AND leadLevel <= 15",
			polygonOptions: {
			  fillColor: "#F9D17A",
			  fillOpacity: 1,
			  strokeColor: "#F9D17A",
			  strokeWeight: 3
			}
		  },
		  {
			where: "leadLevel > 15 AND leadLevel <= 150",
			polygonOptions: {
			  fillColor: "#E49C49",
			  fillOpacity: 1,
			  strokeColor: "#E49C49",
			  strokeWeight: 3
			}
		  },
		  {
			where: "leadLevel > 150",
			polygonOptions: {
			  fillColor: "#E2692B",
			  fillOpacity: 1,
			  strokeColor: "#E2692B",
			  strokeWeight: 3
			}
		  }]
	});

	addFusionListener(leadAndPredictiveLayer);
}

function addFusionListener(object) {
	google.maps.event.addListener(object, "click", function(event) {		
		var query = "SELECT 'latitude', 'longitude', 'abandoned', 'leadLevel', 'testDate', 'prediction' FROM " + fusionTableAllId + " WHERE address LIKE '" 
					+ event.row["address"].value + "' ORDER BY 'testDate' DESC";

		/* Based on code found here: http://stackoverflow.com/questions/21373643/jquery-ajax-calls-in-a-for-loop#21373707 */
		window.jsonpCallbacks["fusionLayerQueryCallback"] = function(data) {			
			var content = fusionQueryCallback(data, event.row["address"].value);
			createLocationCardContent("location", content);
			
			var latLng = "(" + event.row["latitude"].value + ", " + event.row["longitude"].value + ")";
			// add hidden lat/long fields after the address
			$("#location_card #address").after("<div id='lat' class='hide'></div> <div id='lng' class='hide'></div>");
			$("#location_card #lat").html(event.row["latitude"].value);
			$("#location_card #lng").html(event.row["longitude"].value);
			checkIfSaved(latLng);
			
			// collapse expanded areas
			$("#previous_results button").addClass("collapsed").attr("aria-expanded", "false");			
			
			$("#location_card, #location_card .card-action").show();
		};
		
		queryFusionTable(query, "jsonpCallbacks.fusionLayerQueryCallback");
	});
}


function attachLegendCard() {
		var placeholderDetails = "<div id='legend'>";
	
		var unknownIcon = "<img src='" + unknownRiskSrc + "' title ='no lead results' class='legend_icons' /> ";
		var lowIcon = "<img src='" + lowRiskSrc + "' title ='low lead' class ='legend_icons' /> ";
		var moderateIcon = "<img src='" + moderateRiskSrc + "' title ='moderate lead' class='legend_icons' /> ";
		var highIcon = "<img src='" + highRiskSrc + "' title ='high lead' class='legend_icons' /> ";
	
		placeholderDetails += "<div class='row'>";
		placeholderDetails += "<div class='col-xs-3 text-center'>";
		placeholderDetails += lowIcon + "<span>Low</span>";
		placeholderDetails += "</div>";
		placeholderDetails += "<div class='col-xs-3 text-center'>";
		placeholderDetails += moderateIcon + "<span>Moderate</span>";
		placeholderDetails += "</div>";
		placeholderDetails += "<div class='col-xs-3 text-center'>";
		placeholderDetails += highIcon + "<span>High</span>";
		placeholderDetails += "</div>";
		placeholderDetails += "<div class='col-xs-3 text-center'>";
		placeholderDetails += unknownIcon + "<span>No Results</span>"; 
		placeholderDetails += "</div>";
		placeholderDetails += "</div>";
		placeholderDetails += "</div>";

		$("#legend_card .card-inner").empty().html(placeholderDetails);		
		$("#legend_card").show();
}
	

/* Calls the Google Cloud Storage API and reads in the JSON files created from the database data. */
function callStorageAPI(object) {
	gapi.client.load('storage', 'v1').then(function() {
		var request = gapi.client.storage.objects.get({
			"bucket": defaultBucket,
			"object": object,
			"alt": "media"
		});
		
		request.then(function(resp) {
			/* Heatmap Data */
			/*if (object == "leadlevels.json") {
				heatmapData = [];
				js_obj = $.parseJSON(resp.body);
				
				for (i=0; i<js_obj.leadLevels.length; i++) {
					var info = js_obj.leadLevels[i];
					// var weightValue = assignWeight(info.lead_ppb);
					heatmapData.push({lat: info.latitude, lng: info.longitude, lead: info.leadlevel, date: info.dateUpdated, address: info.StAddress});
				}
			}*/
			/* Lead level area data. */
			if (object == "leadLevels_birdview.json") {
				js_obj = $.parseJSON(resp.body);
				
				leadLayerBirdViewMarkers = [];
				
				var latDist = 0.00366980384615384615384615384615;
				var lngDist = 0.00409039615384615384615384615385;
				
				for (var i=0; i<js_obj.area.length; i++) {  
					var temp = js_obj.area[i];
					var numOfTests = temp.numOfTests;
					var numOfDangerous = temp.numOfDangerous;
					var warningImg;

					var upperLat = temp.latitude + latDist;
					var lowerLat = temp.latitude - latDist;
					var upperLng = temp.longitude + lngDist;
					var lowerLng = temp.longitude - lngDist;

					var squareCoordinates = [
						{lat: upperLat, lng: upperLng},
						{lat: upperLat, lng: lowerLng},
						{lat: lowerLat, lng: lowerLng},
						{lat: lowerLat, lng: upperLng}
					];

					var color;
					var weirdnessLevel = weirdnessEquation(temp.numOfTests, temp.numOfDangerous);
					if (weirdnessLevel < 0) {
						color = "#F9D17A";
						warningImg = lowRiskCircle;
					}
					else if (weirdnessLevel < .6) {
						color = "#E49C49";
						warningImg = medRiskCircle;
					}
					else {
						color = "#E2692B";
						warningImg = highRiskCircle;
					}

					var opacity = 0.3;

					var leadLevelAreaSquare = new google.maps.Polygon({
						paths: squareCoordinates,
						strokeColor: color,
						strokeOpacity: 0,
						fillColor: color,
						fillOpacity: opacity
					});

					leadLayerBirdViewMarkers.push(leadLevelAreaSquare);

					content = "<h5>About this area</h5>";
					content += "<div class='row'><div class='col-xs-2'><img id='risk_img' src='" + warningImg + "' /></div> <div class='col-xs-10'><strong>" + numOfDangerous + "</strong> out of <strong>" + numOfTests + "</strong> total tests in this area had dangerous lead levels.</div></div>";
					content += "<p>Zoom in for specific lead test results.</p>";
					
					attachLocationCard("leadArea", leadLevelAreaSquare, "", content);
					
					$("#location_card .card-action").hide();
				}
			}
			/* Provider Data */
			else if (object == "providers.json") {
				js_obj = $.parseJSON(resp.body);
				
				for (i=0; i<js_obj.providers.length; i++) {
					var provider = js_obj.providers[i];
					var latLng = new google.maps.LatLng(provider.latitude, provider.longitude);
					var title = provider.locationName;
					
					var isSaved = false;
					
					if (checkIfSaved(latLng))
						isSaved = true;
					
					var icon;
					var images = "";
					var resourcesAvailable = "";
					var marker;
					
					if (provider.resType.indexOf("Water Pickup") != -1) {
						markerImg = $folderPrefix+"images/water_pickup_icon.png";
						images += "<img src='" + markerImg + "' class='marker_popup_icons' title='Water Pickup' /> ";
						resourcesAvailable += "Water Pickup, ";
						
						if (icon == null)
							icon = waterPickupIcon;
					}
					
					if (provider.resType.indexOf("Recycle") != -1) {
						markerImg = $folderPrefix+"images/recycle_icon.png";
						images += "<img src='" + markerImg + "' class='marker_popup_icons' title='Recycling' /> ";
						resourcesAvailable += "Recycling, ";
						
						if (icon == null)
							icon = recycleIcon;
					}
					
					if (provider.resType.indexOf("Blood Testing") != -1) {
						markerImg = $folderPrefix+"images/bloodtest_icon.png";
						images += "<img src='" + markerImg + "' class='marker_popup_icons' title='Blood Testing' /> ";
						resourcesAvailable += "Blood Testing, ";
						
						if (icon == null)
							icon = bloodIcon;
					}
					
					if (provider.resType.indexOf("Water Filters") != -1) {
						markerImg = $folderPrefix+"images/water_filter_icon.png";
						images += "<img src='" + markerImg + "' class='marker_popup_icons' title='Water Filters' /> ";
						resourcesAvailable += "Water Filters, ";
						
						if (icon == null)
							icon = filterIcon
					}
					
					if (provider.resType.indexOf("Test Kits") != -1) {
						markerImg = $folderPrefix+"images/lead_test_icon.png";
						images += "<img src='" + markerImg + "' class='marker_popup_icons' title='Water Testing' />";
						resourcesAvailable += "Water Testing";
						
						if (icon == null)
							icon = leadTestIcon;
					}
					
					allMarkersString.push(resourcesAvailable);
					
					var content = "<p id='provider_resources'>" + images + "</p>";
					content += "<h5 id='provider_title'>" + title + "</h5> <p id='provider_address'>" + provider.aidAddress + "</p>";
					
					if (provider.phone.length > 0)
						content += "<p id='provider_phone'>" + provider.phone + "</p>";
					
					if (provider.hours.length > 0)
						content += "<p id='provider_hours'>" + provider.hours + "</p>";
					
					if (provider.notes.length > 0)
						content += "<p id='provider_notes'>" + provider.notes + "</p>";
					
					// content += "<p>" + images + "</p></div>";
					
					if ($pageId.indexOf("dashboard") == -1)
						content += "<p id='211_info'>Need help? Call the <a href='http://www.centralmichigan211.org' target='_blank'>211 service</a>.</p>";

					/*If the resource is saved, display on map always if not then do not display*/
					if (isSaved)
						isDisplayMap = map;
					else
						isDisplayMap = null;
					
					if (!isSaved) {
						marker = new google.maps.Marker({
							position: latLng,
							title: title,
							map: isDisplayMap,
							icon: icon
						});
					}
					else {
						marker = new google.maps.Marker({
							position: latLng,
							title: title,
							map: isDisplayMap,
							icon: savedResourceIcon
						});
					}
					
					/* Store the markers in arrays for the add/remove functionality. 
						if saved, put in savedMarkers if not put in allMarkers*/
					if (isSaved)
						savedMarkers.push(marker);
					else
						allMarkers.push(marker);

					bindInfoWindow("resource", marker, map, resourcesAvailable, content);
				}
			}
			/* Construction Sites */
			else if (object == "construction_sites.json") {
				js_obj = $.parseJSON(resp.body);
				
				//Adam Working Here
				
				for (var i=0; i<js_obj.construction_sites.length; i++) {
					var marker;
					var address = js_obj.construction_sites[i].ADDRESS;
					var lng = js_obj.construction_sites[i].lng;
					var lat = js_obj.construction_sites[i].lat;
					var latLng = new google.maps.LatLng(lat, lng);
					constructionMarker = new google.maps.Marker({
						position: latLng,
						title: address,
						icon: constructionIcon
					});
					
					// Define the Icon
					markerImg = $folderPrefix+"images/pipes_icon.png";
					images = "<img src='" + markerImg + "' class='marker_popup_icons' title='Construction' />";

					// Set the content of the info card.
					var constructStr = "The city council has approved service line replacement for water service pipes near this location."
					var constructionContent = "<p id='provider_resources'>" + images + "</p>" + "<h5 id='address'>" + address + "</h5>" +  "<p id=constructString>" + constructStr + "</p>";
					
					// Call the info window.
					bindInfoWindow("resource", constructionMarker, map, 'Construction', constructionContent);					
					constructionMarkers.push(constructionMarker);
				}
					//var latLng = new google.maps.LatLng(provider.latitude, provider.longitude);
					//var title = provider.locationName;
				
			}
			// Uploading Pipe Data From JSON in bucket
			else if (object == "pipedata.json") {
				js_obj = $.parseJSON(resp.body);
				var tempArr;
				for (i=0; i<js_obj.pipedata.length; i++) {
					var pipe = js_obj.pipedata[i];
					var tempArray = new Array();
					var currentName = pipe.streetName;
					
					for (j=i; j<js_obj.pipedata.length; j++) {
						var newPipe = js_obj.pipedata[j];
						if (newPipe.streetName == currentName) {
							// Make the 3rd dimension array
							var lngLat = new Array();
							lngLat[0] = parseFloat(newPipe.lat);
							lngLat[1] = parseFloat(newPipe.lng);
							tempArray.push(lngLat);	// Add it to temp arr
						}
						else if (newPipe.streetName == "endOfFile")
						{
							masterPipeArray.push(tempArray);
						}
						else {
							masterPipeArray.push(tempArray);	
							i = j - 1;	
							j = js_obj.pipedata.length;	
						}
					}
				}
				
				var pipeObject = new Object();
				var pipeLine = new Array();
				for (var i = 0; i < masterPipeArray.length; i++) {
					for (var k = 0; k < masterPipeArray[i].length; k++) {
						pipeObject = {lat: masterPipeArray[i][k][0], lng: masterPipeArray[i][k][1]};
						pipeLine.push(pipeObject);
					}
						
					autoPolyLine = new google.maps.Polyline({
						path: pipeLine,
						strokeColor: "#5266B0",
						strokeOpacity: 1,
						strokeWeight: 2
					});
					
					arrayOfLines.push(autoPolyLine);
					pipeLine = [];
				}
			}
				
		}, function(error) {
			console.log('Error: ' + error.body);
		}).then(function() {
			setMarkers();
		});
	});
}

function weirdnessEquation(N, K) {
	var sqrt = Math.sqrt(N);
	var weirdness = (K/sqrt) - (sqrt*.084);
	return weirdness;
}

function setupResourceMarkers() {
	var retrieveArray = localStorage.getItem("resource_array");
	
	console.log(localStorage);

	if ((localStorage !== "undefined") && (retrieveArray != null)) {
		resourceActiveArray = JSON.parse(retrieveArray);
		localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
		localStorage.setItem("saved_resource_array", JSON.stringify(resourceActiveArray));
	}
	else {
		localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
	}

	if (resourceActiveArray[0] == 1) {
		$("#heatmap_btn").addClass("active");
		$("#heatmap_btn img").attr("src", $folderPrefix+"images/lead_info_icon.png");
	}
	
	if (resourceActiveArray[1] == 1) {
		$("#water_pickup_btn").addClass("active");
		$("#water_pickup_btn img").attr("src", $folderPrefix+"images/water_pickup_icon.png");
	}
	
	if (resourceActiveArray[2] == 1) {
		$("#recycling_btn").addClass("active");
		$("#recycling_btn img").attr("src", $folderPrefix+"images/recycle_icon.png");
	}
	
	if (resourceActiveArray[3] == 1) {
		$("#water_filters_btn").addClass("active");
		$("#water_filters_btn img").attr("src", $folderPrefix+"images/water_filter_icon.png");
	}
	
	if (resourceActiveArray[4] == 1) {
		$("#water_testing_btn").addClass("active");
		$("#water_testing_btn img").attr("src", $folderPrefix+"images/lead_test_icon.png");
	}
	
	if (resourceActiveArray[5] == 1) {
		$("#blood_testing_btn").addClass("active");
		$("#blood_testing_btn img").attr("src", $folderPrefix+"images/bloodtest_icon.png");
	}
	
	if (resourceActiveArray[6] == 1) {
		$("#pipes_btn").addClass("active");
		$("#pipes_btn img").attr("src", $folderPrefix+"images/pipes_icon.png");
	}

	setMarkers();
}


function fusionQueryCallback(data, address) {
	return createLocationContent(address, data);
}


function queryFusionTable(query, callback) {	
	$.ajax({
		type: "GET",
		dataType: "jsonp",
		url: "https://www.googleapis.com/fusiontables/v2/query?sql=" + encodeURI(query) + "&key=" + apiKey + "&callback=" + callback,
		jsonpCallback: callback
	});
}

/* Location info card content generation. */
function createLocationContent(streetAddress, dataObj) {
	var leadLevel;
	var testDate;
	var prediction;
	var tempAddr;
	
	/* Data is from a fusion table query. */
	if (dataObj.rows) {
		leadLevel = dataObj.rows[0][3];
		testDate = dataObj.rows[0][4].slice(0, dataObj.rows[0][4].indexOf(" "));
		prediction = dataObj.rows[0][5];
	}
	
	var content = "<h5 id='address'>" + streetAddress + "</h5>";
	var warningMsg;
	var warningImg;
	var suggestedAction;
	
	if (((leadLevel != -1) && (typeof leadLevel !== "undefined")) || (typeof prediction !== "undefined")) {
		if (leadLevel != -1) {
			if (leadLevel <= 15) {
				warningMsg = "Low Lead Level";
				warningImg = lowRiskCircle;
				suggestedAction = "Use filtered or bottled water. Pregnant women and kids under 6 years old, use only bottled water for drinking, cooking, washing food, and brushing teeth.";
			}
			else if (leadLevel <= 150) {
				warningMsg = "Moderate Lead Level";
				warningImg = medRiskCircle;
				suggestedAction = "Use filtered or bottled water. Pregnant women and kids under 6 years old, use only bottled water for drinking, cooking, washing food, and brushing teeth.";
			}
			else {
				warningMsg = "High Lead Level";
				warningImg = highRiskCircle;
				suggestedAction = "Use only bottled water for drinking, cooking, washing food, and brushing teeth.";
			}
			
			content += "<div id='warning' class='emphasis'>" + warningMsg + "</div>";
			content += "<div id='current_results'><strong>Lead Level:</strong> " + leadLevel + " ppb<br /> <strong>Last Tested:</strong> " + testDate + "</div>";
			content += "<div id='more_info_details' class='collapse'>";
			
			/* Show other test results if they exist. */
			if (dataObj.rows.length > 2) {
				content += "<div id='previous_results'><button type='button' class='btn btn-flat' data-toggle='collapse' data-target='#previous_results_details' aria-expanded='false' aria-controls='previous_results_details'><span>Previous results</span> <i class='material-icons'>expand_more</i></button></div>";
				content += "<div class='collapse' id='previous_results_details'>";
				
				for (var i=1; i<dataObj.rows.length; i++) {
					leadLevel = dataObj.rows[i][3];
					
					if (leadLevel != -1) {
						testDate = dataObj.rows[i][4].slice(0, dataObj.rows[i][4].indexOf(" "));
						
						content += "<strong>Lead Level:</strong> " + leadLevel + " ppb<br /> <strong>Test Date:</strong> " + testDate;
						
						i < dataObj.rows.length-2 ? content += "<hr/ >" : content += "";
					}
				}
				
				content += "</div>";
			}
			
			content += "<p id='suggested_action'>" + suggestedAction + "</p>";
		}
		else {
			content += "<div id='results' class='emphasis'>No Test Results</div>";
		
			if (prediction >= 0.20)
				warningMsg = "High risk of elevated lead levels. Testing is recommended.";
			else if ((prediction > 0.10) && (prediction < 0.20))
				warningMsg = "Moderate risk of elevated lead levels. Testing is recommended.";
			else if (prediction <= 0.10)
				warningMsg = "At risk for elevated lead levels. Testing is recommended.";
			
			warningImg = unknownRiskCircle;
			content += "<div id='warning' class='emphasis'>" + warningMsg + "</div>";
			content += "<p id='suggested_action'>Use only bottled water for drinking, cooking, washing food, and brushing teeth.</p>";
		}
		content = "<img id='risk_img' class='pull-left' src='" + warningImg + "' />" + content;
	}	
	else {
		content = "<img id='risk_img' class='pull-left' src='" + unknownRiskCircle + "' />" + content;
		content += "<div>No test results available.<br />";
		content += "No lead prediction available.</div>";
		//content += "<div id='suggested_action' class='hide'>Use only bottled water for drinking, cooking, washing food, and brushing teeth.</div>";
	}
	
	content += "<p id='211_info'>Call the <a href='http://www.centralmichigan211.org' target='_blank'>211 service</a> for questions and help.</p> <hr class='hide' /> <div id='location_questions' class='hide'><h5>Is this your location?</h5> <p>Providing more information can help with diagnosing issues and providing water resources.</p> <a href='page.php?pid=report&address=" + $("#address").text().replace(/\s/g, "+") + "'>Report a water issue</a></div></div>"
	
	return content;
}

/* */
function createLocationCardContent(type, content) {
	$("#location_card .card-inner").empty().html(content);
		
	/*if (type.search(/location/i) != -1) {
		$("#location_card .card-inner").append("<p id='211_info'>Call the <a href='http://www.centralmichigan211.org' target='_blank'>211 service</a> for questions and help.</p> <hr class='hide' /> <div id='location_questions' class='hide'><h5>Is this your location?</h5> <p>Providing more information can help with diagnosing issues and providing water resources.</p> <a href='page.php?pid=report&address=" + $("#address").text().replace(/\s/g, "+") + "'>Report a water issue</a></div>");
	}*/
	
	if (windowWidth >= 600)
		$("#location_card #more_info_details").removeClass("collapse");
	
	if (type.indexOf("leadArea") != -1)
		$("#location_card .card-action").hide();
	else {
		$("#location_card .card-action").show();
	}
}


/* Insert the data into the location card and show it when the marker is clicked. */
function attachLocationCard(type, marker, address, content) {
	marker.addListener("click", function() {
		$("#resource_card, #legend_card").hide();
		
		clickedMarker = marker;
		
		/* Insert the saved location address in the location bar on the report page when clicked. */
		if (($pageId.indexOf("report") != -1) && (type == "savedLocation")) {
			var correctedAddr = capitalizeEachWord(address.toLowerCase());
			$("#location").val(correctedAddr + ", Flint, MI");
			$("#report_step1_content .next_button").removeClass("disabled");
		}
		
		createLocationCardContent(type, content);
		
		if (type.indexOf("leadArea") == -1)
			checkIfSaved(marker.getPosition());
		
		// add hidden lat/long fields after the address
		$("#location_card #address").after("<div id='lat' class='hide'></div> <div id='lng' class='hide'></div>");
		
		if (type.indexOf("leadArea") == -1) {
			$("#location_card #lat").html(clickedMarker.getPosition().lat());
			$("#location_card #lng").html(clickedMarker.getPosition().lng());
		}
		
		$("#location_card").show();
	});
}


function bindInfoWindow(type, marker, map, resourcesAvailable, content) {
	if (type.indexOf("resource") != -1) {
		marker.addListener("click", function() {
			$("#location_card, #legend_card").hide();
			
			isSaved = checkIfSaved(marker.getPosition());
			map.panTo(marker.getPosition());
			$("#resource_card .card-inner").empty().prepend(content);
			
			/* Disable non-relevant report choices. */
			if (resourcesAvailable.indexOf("Blood Testing") == -1) {
				$("#resource_card #card_report_menu a:contains('Blood')").parent().addClass("disabled");
				$("#resource_card #card_report_menu a:contains('Blood')").removeAttr("href");
			}
			else {
				$("#resource_card #card_report_menu a:contains('Blood')").parent().removeClass("disabled");
				$("#resource_card #card_report_menu a:contains('Blood')").attr("href", "#");
			}
			
			if (resourcesAvailable.indexOf("Water Testing") == -1) {
				$("#resource_card #card_report_menu a:contains('Test Kits')").parent().addClass("disabled");
				$("#resource_card #card_report_menu a:contains('Test Kits')").removeAttr("href");
			}
			else {
				$("#resource_card #card_report_menu a:contains('Test Kits')").parent().removeClass("disabled");
				$("#resource_card #card_report_menu a:contains('Test Kits')").attr("href", "#");
			}
			
			if (resourcesAvailable.indexOf("Recycling") == -1) {
				$("#resource_card #card_report_menu a:contains('Recycling')").parent().addClass("disabled");
				$("#resource_card #card_report_menu a:contains('Recycling')").removeAttr("href");
			}
			else {
				$("#resource_card #card_report_menu a:contains('Recycling')").parent().removeClass("disabled");
				$("#resource_card #card_report_menu a:contains('Recycling')").attr("href", "#");
			}
			
			if (resourcesAvailable.indexOf("Water Filters") == -1) {
				$("#resource_card #card_report_menu a:contains('Water Filters')").parent().addClass("disabled");
				$("#resource_card #card_report_menu a:contains('Water Filters')").removeAttr("href");
			}
			else {
				$("#resource_card #card_report_menu a:contains('Water Filters')").parent().removeClass("disabled");
				$("#resource_card #card_report_menu a:contains('Water Filters')").attr("href", "#");
			}
			
			if (resourcesAvailable.indexOf("Water Pickup") == -1) {
				$("#resource_card #card_report_menu a:contains('Water Pickup')").parent().addClass("disabled");
				$("#resource_card #card_report_menu a:contains('Water Pickup')").removeAttr("href");
			}
			else {
				$("#resource_card #card_report_menu a:contains('Water Pickup')").parent().removeClass("disabled");
				$("#resource_card #card_report_menu a:contains('Water Pickup')").attr("href", "#");
			}
			
			if (resourcesAvailable.indexOf("Construction") == -1) {
				$("#resource_card #card_report_menu a:contains('Construction')").parent().addClass("disabled");
				$("#resource_card #card_report_menu a:contains('Construction')").removeAttr("href");
			}
			else {
				$("#resource_card #card_report_menu a:contains('Construction')").parent().removeClass("disabled");
				$("#resource_card #card_report_menu a:contains('Construction')").attr("href", "#");
				$("#resource_card .card-action").hide();
			}
			
			if (windowWidth >= 600) {
				$("#resource_card").css({
					left: (($("#map").width() / 2) - ($("#resource_card").width() / 2)) + "px",
					bottom: (($("#map").height() / 2) + 10) + "px"
				});
			}
			
			$("#resource_card").show();
			
			if (isSaved)
				$("#resource_card #card_save .icon").html("star");
			else
				$("#resource_card #card_save .icon").html("star_border");
			
			resourceMarker = marker;
		});
	}
}


/* Set markers on the map based on type. */
function setMarkers() {
	zoomLvl = map.getZoom();
	
	/*if ($pageId.indexOf("dashboard") != -1) {
		if ((resourceActiveArray[0] == 1) && (zoomLvl < 16)) {
			leadAndPredictiveLayer.setMap(null);
			for (var i = 0; i < leadLayerBirdViewMarkers.length; i++)
				leadLayerBirdViewMarkers[i].setMap(map);
		}
		else if ((resourceActiveArray[0] == 1) && (zoomLvl >= 16)) {
			leadAndPredictiveLayer.setMap(map);
			for (var i = 0; i < leadLayerBirdViewMarkers.length; i++)
				leadLayerBirdViewMarkers[i].setMap(null);
		}
	}
	else {*/
		if (resourceActiveArray[0] == 1)
			leadAndPredictiveLayer.setMap(map);
		else if (resourceActiveArray[0] == 0)
			leadAndPredictiveLayer.setMap(null);
	//}
	
	for (var i = 0; i < allMarkers.length; i++) {
		allMarkers[i].setMap(null);
		
		if ((resourceActiveArray[1] == 1) && (allMarkersString[i].indexOf("Water Pickup") != -1)) {
			allMarkers[i].setIcon(waterPickupIcon);
			allMarkers[i].setMap(map);
		}
		else if ((resourceActiveArray[2] == 1) && (allMarkersString[i].indexOf("Recycling") != -1)) {
			allMarkers[i].setIcon(recycleIcon);
			allMarkers[i].setMap(map);
		}
		else if ((resourceActiveArray[3] == 1) && (allMarkersString[i].indexOf("Water Filters") != -1)) {
			allMarkers[i].setIcon(filterIcon);
			allMarkers[i].setMap(map);
		}
		else if ((resourceActiveArray[4] == 1) && (allMarkersString[i].indexOf("Water Testing") != -1)) {
			allMarkers[i].setIcon(leadTestIcon);
			allMarkers[i].setMap(map);
		}
		else if ((resourceActiveArray[5] == 1) && (allMarkersString[i].indexOf("Blood Testing") != -1)) {
			allMarkers[i].setIcon(bloodIcon);
			allMarkers[i].setMap(map);
		}
	}
	
	if (resourceActiveArray[6] == 1) {
		//waterplantMarker.setMap(map);
		
		for (var i = 0; i < arrayOfLines.length; i++)
			arrayOfLines[i].setMap(map);
		
		for (var i=0; i<constructionMarkers.length; i++)
			constructionMarkers[i].setMap(map);
	}
	else {
		//waterplantMarker.setMap(null);
		
		for (var i = 0; i < arrayOfLines.length; i++)
			arrayOfLines[i].setMap(null);
		
		for (var i=0; i<constructionMarkers.length; i++)
			constructionMarkers[i].setMap(null);
	}
}

function checkIfSaved(latLng) {
	var numberSaved = parseInt(localStorage["numberSaved"]);
	var returnVal = false;
	for (var i=1; i <= numberSaved; i++) {
		if (localStorage.getItem("savedLocationPosition"+i) == latLng) {
			returnVal = true;
			break;
		}
	}
	
	if (returnVal == true)
		$("#location_card #card_save .icon, #resource_card #card_save .icon").html("star");
	else
		$("#location_card #card_save .icon, #resource_card #card_save .icon").html("star_border");
		
	return returnVal;
}

function saveLocation(latLng, address, icon, type) {
	var numberSaved = localStorage.getItem("numberSaved");
	
	if (numberSaved == null)
		numberSaved = 1;
	else {
		numberSaved = parseInt(numberSaved);
		numberSaved++;
	}
	
	localStorage.setItem("numberSaved", numberSaved);
	localStorage.setItem("savedLocationPosition"+numberSaved, latLng);
	localStorage.setItem("savedLocationAddress"+numberSaved, address);
	localStorage.setItem("savedLocationType"+numberSaved, type);
	localStorage.setItem("savedLocationIcon"+numberSaved, icon);
	
	$("#location_card #card_save .icon, #resource_card #card_save .icon").html("star");
	
	console.log(localStorage);
}

function unsaveLocation(latLng) {
	var numberSaved = parseInt(localStorage.getItem("numberSaved"));
	for (var i=1; i <= numberSaved; i++) {
		if (localStorage.getItem("savedLocationPosition"+i) == latLng) {
			localStorage.removeItem("savedLocationPosition"+i);
			localStorage.removeItem("savedLocationAddress"+i);
			localStorage.removeItem("savedLocationType"+i);
			
			numberSaved--;
			
			if (numberSaved == -1)
				localStorage.setItem("numberSaved", 0);
			else
				localStorage.setItem("numberSaved", numberSaved);
		}
	}
	
	$("#location_card #card_save .icon, #resource_card #card_save .icon").html("star_border");
	
	return (numberSaved+1);
}


/* Capialize the first character in each word.
   From: http://alvinalexander.com/javascript/how-to-capitalize-each-word-javascript-string
*/
function capitalizeEachWord(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

$(document).ready(function() {
	//localStorage.clear();
	//console.log(localStorage);

	if (typeof(Storage) !== "undefined") {
		$("#heatmap_btn").on("click", function() {
			$("#resource_card, #location_card").hide();
			
			if (resourceActiveArray[0] == 1) {
				resourceActiveArray[0] = 0;
				$("body[id='dashboard_page'] #heatmap_btn").removeClass("active");
				$("#heatmap_btn img").attr("src", $folderPrefix+"images/lead_info_icon_white.png");
			}
			else {
				resourceActiveArray[0] = 1;
				$("body[id='dashboard_page'] #heatmap_btn").addClass("active");
				$("#heatmap_btn img").attr("src", $folderPrefix+"images/lead_info_icon.png");
			}
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});

		$("#water_pickup_btn").on("click", function() {
			$("#resource_card, #location_card").hide();
			
			if (resourceActiveArray[1] == 1) {
				resourceActiveArray[1] = 0;
				$("body[id='dashboard_page'] #water_pickup_btn").removeClass("active");
				$("#water_pickup_btn img").attr("src", $folderPrefix+"images/water_pickup_icon_white.png");
			}
			else {
				resourceActiveArray[1] = 1;
				$("body[id='dashboard_page'] #water_pickup_btn").addClass("active");
				$("#water_pickup_btn img").attr("src", $folderPrefix+"images/water_pickup_icon.png");
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
				$("body[id='dashboard_page'] #recycling_btn").removeClass("active");
				$("#recycling_btn img").attr("src", $folderPrefix+"images/recycle_icon_white.png");
			}
			else {
				resourceActiveArray[2] = 1;
				$("body[id='dashboard_page'] #recycling_btn").addClass("active");
				$("#recycling_btn img").attr("src", $folderPrefix+"images/recycle_icon.png");
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
				$("body[id='dashboard_page'] #water_testing_btn").removeClass("active");
				$("#water_testing_btn img").attr("src", $folderPrefix+"images/lead_test_icon_white.png");
			}
			else {
				resourceActiveArray[4] = 1;
				$("body[id='dashboard_page'] #water_testing_btn").addClass("active");
				$("#water_testing_btn img").attr("src", $folderPrefix+"images/lead_test_icon.png");
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
				$("body[id='dashboard_page'] #blood_testing_btn").removeClass("active");
				$("#blood_testing_btn img").attr("src", $folderPrefix+"images/bloodtest_icon_white.png");
			}
			else {
				resourceActiveArray[5] = 1;
				$("body[id='dashboard_page'] #blood_testing_btn").addClass("active");
				$("#blood_testing_btn img").attr("src", $folderPrefix+"images/bloodtest_icon.png");
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
				$("body[id='dashboard_page'] #water_filters_btn").removeClass("active");
				$("#water_filters_btn img").attr("src", $folderPrefix+"images/water_filter_icon_white.png");
			}
			else {
				resourceActiveArray[3] = 1;
				$("body[id='dashboard_page'] #water_filters_btn").addClass("active");
				$("#water_filters_btn img").attr("src", $folderPrefix+"images/water_filter_icon.png");
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
				$("body[id='dashboard_page'] #pipes_btn").removeClass("active");
				$("#pipes_btn img").attr("src", $folderPrefix+"images/pipes_icon_white.png");
				
				for (var i=0; i<constructionMarkers.length; i++)
					constructionMarkers[i].setMap(null);
			}
			else {
				resourceActiveArray[6] = 1;
				$("body[id='dashboard_page'] #pipes_btn").addClass("active");
				$("#pipes_btn img").attr("src", $folderPrefix+"images/pipes_icon.png");
				
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

	// gives directions to a resource location when get dircetions is clicked
	$("#resource_card #card_directions").on("click", function() {
		//var resource_directions = resourceMarker.getPosition();
        //window.open('http://maps.google.com/?q='+resourceMarker.getPosition(), '_blank');
		var end = $("#resource_card #provider_address").text().indexOf(",");
		var address;
		
		if (end != -1)
			address = $("#resource_card #provider_address").text().slice(0, end);
		else
			address = $("#resource_card #provider_address").text();
		
		window.open('http://maps.google.com/?q='+address, '_blank');
	});

	// saves/unsaves resource location when save button is clicked on the resource card
	$("#resource_card #card_save").on("click", function() {
		var streetAddress = $("#resource_card #provider_address").html();
		var unsavedIcon = resourceMarker.getIcon().url;
		var savedLocationNum
		//var latLng = "(" + resourceMarker.getPosition().lat().toPrecision(6) + ", " + resourceMarker.getPosition().lng().toPrecision(6) + ")";
		var latLng = "(" + resourceMarker.getPosition().lat() + ", " + resourceMarker.getPosition().lng() + ")";
		var isSaved = checkIfSaved(latLng);
		
		// resource has already been saved
		if (isSaved) {
			var temp = resourceMarker;
			var savedIcon;
			var oldIcon;
			
			// remove from local storage
			savedLocationNum = unsaveLocation(latLng);
			savedIcon = localStorage.getItem("savedLocationIcon"+savedLocationNum);
			localStorage.removeItem(["savedLocationIcon"+savedLocationNum]);
			
			// change image on card to star outline
			$("#resource_card #card_save .icon").html("star_outline");
			
			// remove from savedMarkers 
			for (var i = 0; i < savedMarkers.length; i++) {
				if (savedMarkers[i].getPosition() == latLng)
					savedMarkers.splice(i, 1);
			}
			
			// restore unsaved location icon			
			if (savedIcon.indexOf(waterPickupIcon.url) != -1) 
				oldIcon = waterPickupIcon;
			else if (savedIcon.indexOf(recycleIcon.url) != -1)
				oldIcon = recycleIcon;
			else if (savedIcon.indexOf(leadTestIcon.url) != -1)
				oldIcon = leadTestIcon;
			else if (savedIcon.indexOf(bloodIcon.url) != -1)
				oldIcon = bloodIcon;
			else if (savedIcon.indexOf(filterIcon.url) != -1)
				oldIcon = filterIcon;
			
			temp.setIcon(oldIcon);
			
			// add to all markers and reset map
			allMarkers.push(temp);
		}
		// resource has not been saved
		else {
			var temp;
			
			// add to local storage
			saveLocation(latLng, streetAddress, unsavedIcon, "Resource");
			
			// change image on card to filled star
			$("#resource_card #card_save .icon").html("star");
			
			// remove from allMarkers 
			for (var i = 0; i < allMarkers.length; i++) {
				if (allMarkers[i].getPosition() == latLng)
					allMarkers.splice(i,1);
				
				temp = resourceMarker;
				
				// change the resource icon to the saved icon
				temp.setIcon(savedResourceIcon);
				
				savedMarkers.push(temp);
			}
		}
		
		console.log(localStorage);
	});

	// sends problem reported to db when report issue is selected from #resource_card
	$("#resource_card .dropdown-menu a").on("click", function(event){
		var selectedReason = $(this).text(); // Get the text of the element
		var resourceAddress = $("#resource_card #provider_address").html();	// Get the address of the element
		
		if ($(this).parent().hasClass("disabled"))
			return false;

		$.ajax({
			type: "POST",
			url: "includes/functions.php",
			data: {
				type: "resource_report",
				reason: selectedReason,
				address: resourceAddress
			},
			complete: function(response) {				
				if (response.responseText.indexOf("1") != -1)
					console.log("Resource report data successfully submitted.");
				else
					console.log("Resource report data wasn't submitted.");
			}
		});
	});
	
	// saves/unsaves a non-resource location when save button is clicked on the location card
	$("#location_card #card_save").on("click", function(event) {
		var streetAddress = $("#location_card #address").text();
		var latLng;
		var numberSaved = parseInt(localStorage.getItem("numberSaved"));
		var isSaved = false;
		var unsavedIcon = locationIcon.url;
		var savedLocationNum;
		
		// an address was searched for
		if (locationMarker.getPosition()) {
			//latLng = "(" + locationMarker.getPosition().lat().toPrecision(6) + ", " + locationMarker.getPosition().lng().toPrecision(6) + ")";
			latLng = "(" + locationMarker.getPosition().lat() + ", " + locationMarker.getPosition().lng() + ")";
			isSaved = checkIfSaved(latLng);
			
			// location has already been saved
			if (isSaved) {
				// remove from local storage
				savedLocationNum = unsaveLocation(latLng);
				localStorage.removeItem(["savedLocationIcon"+savedLocationNum]);

				// change the marker to the generic location marker
				var tempLocationMarker = locationMarker;
				tempLocationMarker.setIcon(locationIcon);
				tempLocationMarker.setMap(map);
				
				// remove from savedMarkers 
				for (var i = 0; i < savedMarkers.length; i++) {
					if (savedMarkers[i].getPosition() == latLng)
						savedMarkers.splice(i, 1);
				}
				
				// add to all markers and reset map
				allMarkers.push(tempLocationMarker);
			}
			// location has not been saved
			else {				
				// add to local storage
				saveLocation(latLng, streetAddress, unsavedIcon, "Non-Resource");
				
				// remove from allMarkers 
				for (var i = 0; i < allMarkers.length; i++) {
					if (allMarkers[i].getPosition() == latLng)
						allMarkers.splice(i,1);
				}
				
				// change the location icon to the saved icon
				var tempLocationMarker = locationMarker;
				tempLocationMarker.setIcon(savedLocationIcon);
				tempLocationMarker.setMap(map);
				savedMarkers.push(tempLocationMarker);
			}
		}
		// a saved location maker or fusion layer marker were clicked
		else {
			geocoder.geocode({
				address: streetAddress,
				bounds: new google.maps.LatLngBounds({lat: 43.021, lng: -83.681})
			}, function(results, status) {				
				if ($("#location_card #lat").length > 0)
					latLng = "(" + $("#location_card #lat").html() + ", " + $("#location_card #lng").html() + ")";
				else
					latLng = results[0].geometry.location.toString();
				
				//latLng = "(" + $("#location_card #lat").html().toPrecision(6) + ", " + $("#location_card #lng").html().toPrecision(6) + ")";
				isSaved = checkIfSaved(latLng);
			
				// location has already been saved
				if (checkIfSaved(latLng)) {
					// remove from local storage
					savedLocationNum = unsaveLocation(latLng);
					localStorage.removeItem(["savedLocationIcon"+savedLocationNum]);
					
					// change the marker to the generic location marker					
					var tempLocationMarker = clickedMarker;
					tempLocationMarker.setIcon(locationIcon);
					tempLocationMarker.setMap(map);
					
					// remove from savedMarkers 
					for (var i = 0; i < savedMarkers.length; i++) {
						if (savedMarkers[i].getPosition() == latLng)
							savedMarkers.splice(i, 1);
					}
					
					// add to all markers
					allMarkers.push(tempLocationMarker);
				}
				// location has not been saved
				else {					
					// add to local storage
					saveLocation(latLng, streetAddress, unsavedIcon, "Non-Resource");
					
					// remove from allMarkers 
					for (var i = 0; i < allMarkers.length; i++) {
						if (allMarkers[i].getPosition() == latLng)
							allMarkers.splice(i,1);
					}
					
					var tempLocationMarker = clickedMarker;
					tempLocationMarker.setIcon(savedLocationIcon);
					
					var query = "SELECT 'latitude', 'longitude', 'abandoned', 'leadLevel', 'testDate', 'prediction' FROM " + fusionTableAllId + " WHERE address LIKE '" + streetAddress + "' ORDER BY 'testDate' DESC";
					
					/* Based on code found here: http://stackoverflow.com/questions/21373643/jquery-ajax-calls-in-a-for-loop#21373707 */
					window.jsonpCallbacks["fusionMarkerQueryCallback"] = function(data) {
						tempLocationMarker.setPosition({lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()});
						
						//console.log(place.geometry.location.lat().toPrecision(7) + " - " + place.geometry.location.lng().toPrecision(7));
						
						var content = fusionQueryCallback(data, streetAddress);
						createLocationCardContent("location", content);
						attachLocationCard("location", tempLocationMarker, streetAddress, content);
						
						savedMarkers.push(tempLocationMarker);
						savedLocationMarkers.push(tempLocationMarker);
					};
					
					queryFusionTable(query, "jsonpCallbacks.fusionMarkerQueryCallback");
				}
			});
		}
	});
	

	$("#location_card .close, #resource_card .close").on("click", function() {
		$(this).parent().hide();
		$("#legend_card").show();
	});
});