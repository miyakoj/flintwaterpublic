/* Google Service Account info */
var clientId = "322504400471-ou3nftefgmhpnbj4v3nv08b16nepdngg.apps.googleusercontent.com";
var apiKey = "AIzaSyA0qZMLnj11C0CFSo-xo6LwqsNB_hKwRbM";

// Access Google Cloud Storage
var defaultBucket = "h2o-flint.appspot.com";
var scopes = "https:// www.googleapis.com/auth/devstorage.read_only";

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var map;
var autocomplete;
var infoWindow;
var heatmap;
var leadLayer; // fusion table layer to set up lead levels
var leadLayerBirdView_markers = [];
var leadLayerBirdView_info;
var predictiveLayer; // fusion table layer to show predicted lead levels
var leadAndPredictiveLayer; // fusion table layer to show both lead and predicted layer
var heatmapData;

var $locationButtons;

var savedMarkers = [];
var allMarkers = [];
var allMarkersString = [];
var resourceActiveArray = [1, 0, 0, 0, 0, 0, 0, 0];  // lead levels, water pickup, recycle, filter, lead, blood, construction, prediction
var savedLocationMarkers = [];
var locationMarker;
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
var constructionIcon;
var waterPlantIcon;
var locationIcon;
var savedResourceIcon;
var savedLocationIcon;
var iconSize = 30;

var leadLevelOfInput;

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
	$("#resource_card, #location_card, #legend_card").hide();
	
	console.log("initMap() map = " + map);
	
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 43.021, lng: -83.681},
	  zoom: 13,
	  mapTypeControl:false
	});
	
	/* Centering and resizing */
	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);
		
		$("#map").css({
			"height": function() {
				window.innerHeight - $("header").outerHeight() - $("#toggles .list").outerHeight();
			}
		});
	});
	
	infoWindow = new google.maps.InfoWindow();

	callStorageAPI("leadlevels.json");
	callStorageAPI("leadLevels_birdview.json");
	callStorageAPI("providers.json");
	callStorageAPI("pipedata.json");
	
	setUpFusionTable();

	allMarkers.forEach(function(marker) {
		marker.setMap(null);
	});

	// make icons for each resource
	bloodIcon = {
		url: 'images/bloodtest_circle_icon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	waterPickupIcon = {
		url: 'images/water_pickup_circle_icon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	leadTestIcon = {
		url: 'images/lead_test_circle_icon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	recycleIcon = {
		url: 'images/recycle_circle_icon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	filterIcon = {
		url: 'images/water_filter_circle_icon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	constructionIcon = {
		url: 'images/construction_icon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	waterplantIcon = {
		url: 'images/water_plant_icon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	savedResourceIcon = {
		url: 'images/saved_resource_icon.png',
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0,0),
		size: new google.maps.Size(64,64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	locationIcon = {
		url: 'images/location_icon.png',
		size: new google.maps.Size(64, 64),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	  };
	savedLocationIcon = {
		url: 'images/saved_location_icon.png',
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0,0),
		size: new google.maps.Size(64,64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	
	// Create a marker for the place.
	locationMarker = new google.maps.Marker({map: map});
	
	/* Load saved non-resource locations. */
	var numberSaved = parseInt(localStorage["numberSaved"]);
	
	if (!isNaN(numberSaved) && (numberSaved > 0)) {
		var locationPosition;
		var tempLocationMarker;
		var content;
		
		for (var i = 1; i <= numberSaved; i++) {
			if (localStorage.getItem("savedLocationType"+i).indexOf("Non-Resource") != -1) {
				locationPosition = localStorage.getItem("savedLocationPosition"+i);
				latitude = parseFloat(locationPosition.slice(1, locationPosition.indexOf(",")));
				longitude = parseFloat(locationPosition.slice(locationPosition.indexOf(" ")+1, locationPosition.indexOf(")")));
				
				tempLocationMarker = new google.maps.Marker({
					position: {lat:latitude, lng:longitude},
					map: map,
					icon: savedLocationIcon
				});
				
				//content = createLocationContent(tempLocationMarker, localStorage.getItem("savedLocationAddress"+i));
				
				/*var streetAddress = localStorage.getItem("savedLocationAddress"+i);
				var leadMeter;
				var leadPrediction;
				var leadMsg = "OK to use filtered water, except children under 6 and pregnant women.";

				for (var i=0; i < heatmapData.length; i++) {
					var tempAddr = heatmapData[i].address.valueOf();
					if (tempAddr === streetAddress) {
						leadMeter = heatmapData[i].lead + " ppb";
						leadLevelOfInput = heatmapData[i].lead;
						break;
					}
					else {
						 leadMeter = "No Reported Reading";
						 leadLevelOfInput = -1;
					}
				}

				if (leadLevelOfInput >= 0 && leadLevelOfInput < 15) {
					leadPrediction = "Predicted low lead levels";
				}
				else if (leadLevelOfInput >= 15 && leadLevelOfInput < 150) {
					leadPrediction = "Predicted medium lead levels";
				}
				else if (leadLevelOfInput >= 150) {
					leadPrediction = "Predicted high lead levels";
					leadMsg = "Not safe to drink even if filtered."
				}
				
				var content = "<h5 id='address'>" + streetAddress + "</h5> <h6 id='prediction'>" + leadPrediction + "</h6> <p id='lead_meter'>" + leadMeter + "</p> <p id='lead_msg'>" + leadMsg + "</p>";*/
				
				$("#location_card #card_save .material-icons").html("star");
				//attachLocationCard("location", tempLocationMarker, map, content);
				attachLocationCard("location", tempLocationMarker, localStorage.getItem("savedLocationAddress"+i), "");
				
				savedMarkers.push(tempLocationMarker);
				savedLocationMarkers.push(tempLocationMarker);
			}
		}
	}
	
	$("#location_card #card_save .material-icons").html("star");

	// Construction Junk
	var constructionLatLng = {lat:43.019368, lng:-83.668522};
	var constructionTitle = "Construction Zone";
	var constructionImage = "images/construction_icon.png";
	constructionMarker  = new google.maps.Marker({
		position: constructionLatLng,
		map: map,
		title: constructionTitle,
		icon: constructionIcon
	});
	
	var constructionContent = "<h1>Construction Zone</h1> <p>Replacing Pipes. Estimated to last 2 weeks</p>";
	bindInfoWindow("construction", constructionMarker, map, infoWindow, constructionContent);
	constructionMarker.setMap(null);
	
	// Water Plant Junk
	var waterplantLatLng = {lat:43.056269, lng:-83.669625};
	var waterplantTitle = "City of Flint Water Plant";
	var waterplantImage = "images/water_plant_icon.png";
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
	
	// Changes CSS to make search bar visible, making sure it doesn't load before the map does
	map.addListener('idle', function(){
		$("#search_input").css("display", "block");
	});
	
	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});

	// If the map is clicked, hide the resource and location cards
	 map.addListener('click', function() {
    	$("#resource_card, #location_card, #legend_card").hide();
  	});

	 map.addListener('zoom_changed', function() {
	 	var zoomLvl = map.getZoom();
	 	if (resourceActiveArray[0] == 1 && zoomLvl < 16) {
			leadAndPredictiveLayer.setMap(null);
			for (var i = 0; i < leadLayerBirdView_markers.length; i++) {
				leadLayerBirdView_markers[i].setMap(map);
			}
		}
		else if (resourceActiveArray[0] == 1 && zoomLvl >= 16) {
			leadAndPredictiveLayer.setMap(map);
			for (var i = 0; i < leadLayerBirdView_markers.length; i++) {
				leadLayerBirdView_markers[i].setMap(null);
			}
		}
	 });
	
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();
		var place = places[0];
		if (places.length == 0)
			return;

	  // For each place, get the icon, name and location.
	  var bounds = new google.maps.LatLngBounds();

	  // get rid of previous markers if they exist
	  /*if (locationMarker.length > 0) {
	  		locationMarker[0].setMap(map);
	  		locationMarker = [];
	  }
	  
	  // Create a marker for the place.
	  locationMarker.push(new google.maps.Marker({
		position: place.geometry.location,
		map: map,
		title: place.name,
		icon: markerIcon,
	  }));*/
	  
	// Update the location marker for the address searched.
	locationMarker.setPosition(place.geometry.location);
	locationMarker.setTitle(place.name);
	locationMarker.setIcon(locationIcon);

	  if (place.geometry.viewport) {
		// Only geocodes have viewport.
		bounds.union(place.geometry.viewport);
	  }
	  else {
		bounds.extend(place.geometry.location);
	  }
	  
	  updateLocationZoom();
	  
	  /*places.forEach(function(place) {
		var markerIcon = {
		  url: 'images/locationicon.png',
		  size: new google.maps.Size(64, 64),
		  origin: new google.maps.Point(0, 0),
		  anchor: new google.maps.Point(17, 34),
		  scaledSize: new google.maps.Size(iconSize, iconSize)
		};
		
		updateLocationZoom();

		// Create a marker for the place.
		locationMarker.push(new google.maps.Marker({
			position: place.geometry.location,
			map: map,
			title: place.name,
			icon: markerIcon
		}));

		if (place.geometry.viewport) {
		  // Only geocodes have viewport.
		  bounds.union(place.geometry.viewport);
		}
		else {
		  bounds.extend(place.geometry.location);
		}
	  }); */

	  
		map.fitBounds(bounds);

		/* Display appropriate lead rating and message. */
		//$("#location_card .card-inner").html("<h5>" + streetAddress + "</h5> <h6>" + leadPrediction + "</h6> <p>" + leadMeter + "</p> <p>" + leadMsg + "</p>");
		//$("#location_card, #location_card .card-action").show();
		
		var inputAddress = place.formatted_address.split(',');
		var streetAddress = inputAddress[0].toUpperCase();		
		var content = createLocationContent(locationMarker, streetAddress);
		
		/*var leadMeter;
		var leadPrediction;
		var leadMsg = "OK to use filtered water, except children under 6 and pregnant women.";

		for (var i=0; i < heatmapData.length; i++) {
			var tempAddr = heatmapData[i].address.valueOf();
			if (tempAddr === streetAddress) {
				leadMeter = heatmapData[i].lead + " ppb";
				leadLevelOfInput = heatmapData[i].lead;
				break;
			}
			else {
				 leadMeter = "No Reported Reading";
				 leadLevelOfInput = -1;
			}
		}

		if (leadLevelOfInput >= 0 && leadLevelOfInput < 15) {
			leadPrediction = "Predicted low lead levels";
		}
		else if (leadLevelOfInput >= 15 && leadLevelOfInput < 150) {
			leadPrediction = "Predicted medium lead levels";
		}
		else if (leadLevelOfInput >= 150) {
			leadPrediction = "Predicted high lead levels";
			leadMsg = "Not safe to drink even if filtered."
		}
		
		var content = "<h5 id='address'>" + streetAddress + "</h5> <h6 id='prediction'>" + leadPrediction + "</h6> <p id='lead_meter'>" + leadMeter + "</p> <p id='lead_msg'>" + leadMsg + "</p>";*/
		
		$("#location_card .card-inner").html(content, "<p id='211_info'>Need help? Call the <a href='http://www.centralmichigan211.org' target='_blank'>211 service</a>.</p>");;
		$("#location_card #card_save .material-icons").html("star_border");
		$("#location_card").show();
		
		//attachLocationCard("location", locationMarker, map, content);
		attachLocationCard("location", locationMarker, streetAddress, "");
	});
	
	// Check the saved locations if enter is pressed while in the search box
	$("#search_input").on("keydown", function(event) {
		$("#resource_card").hide();
		
		if (event.which == 13)
			updateLocationZoom();
	});
	
	// hide the location card if the search box is empty
	$("#search_input").on("change", function(event) {
		$("#resource_card, #legend_card").hide();
		
		if ($(this).val() == "")
			$("#location_card").hide();
	});
	
	// Trigger search on button click
    /*$("#search_button").on("click", function() {
		// if (activeSearch) {
			var input = document.getElementById('search_input');

			google.maps.event.trigger(input, 'focus');
			google.maps.event.trigger(input, 'keydown', {
				keyCode: 13
			});
			
			updateLocationZoom();
		// }	
    /*});
	
	// var save_location_msg = "Save This Location";
	// var saved_location_msg = "Saved Location";
	
	/* Disable the save button if there are already three saved locations. */
	/*if ((Number(localStorage.saved_locations_count) == 3) && ($("#saved_location_button span").text() == save_location_msg))
		$("#saved_location_button").attr("disabled", "disabled");*/
	
	/* Show/hide buttons and dymaically set different button text. */
	function updateLocationZoom() {
		// $("#saved_locations").css("display", "none"); // hide saved locations
		// $("#location_buttons").css("display", "block"); // unhide location buttons
		
		var searched_location = $("#search_input").val();
		// var searched_location_sub = searched_location.substring(1, searched_location.length);

		// console.log(localStorage.saved_location1);
		// console.log(searched_location_sub);
		// console.log(searched_location);
		
		// markerImg = "images/savedlocation.png"; // saved location icon by default
		
		/*if (localStorage.saved_location1 === searched_location) {
			$("#saved_location_button span").text(saved_location_msg);
			// $("#saved_location_button img").src("images/locationicon.png");
		}
		else if (localStorage.saved_location2 === searched_location) {
			$("#saved_location_button span").text(saved_location_msg);
			// $("#saved_location_button img").src("images/locationicon.png");
		}
		else if (localStorage.saved_location3 === searched_location) {
			$("#saved_location_button span").text(saved_location_msg);
			// $("#saved_location_button img").src("images/locationicon.png");
		}
		else {
			$("#saved_location_button span").text(save_location_msg);
			markerImg = "images/locationicon.png";
		}*/
		
		 // change the location card icon dynamically
		

	    if (map.getZoom() < 14)
			map.setZoom(25);
		else
			map.setZoom(20);

	}
	
	/*if (localStorage.getItem("saved_location2") !== null) {
		localStorage.removeItem("saved_location2");
		localStorage.setItem("saved_locations_count", Number(localStorage.saved_locations_count) - 1);
	}*/
	
	// Save a location to HTML5 local storage when the save button is clicked	
    /*$("#saved_location_button").on("click", function() {
		if ($("#search_input").val() != "") {
			if (typeof(Storage) !== "undefined") {
				if ($("#location_card #saved_location_button span").text() == save_location_msg) {
					if (localStorage.getItem("saved_locations_count") !== null) {
						// if (localStorage.saved_locations_count < 100)
							localStorage.saved_locations_count = Number(localStorage.saved_locations_count) + 1;
							// TODO - also save the current icon img url
						// else
							// console.log("There are no free saved locations.");
					}
					else
						localStorage.saved_locations_count = 1;
					
					localStorage.setItem("saved_location" + Number(localStorage.saved_locations_count), $("#search_input").val());
					markerImg = "images/savedlocation.png";
					card_markerImg = "images/locationicon.png";
					$("#location_card #saved_location_button span").text(saved_location_msg);
					
					var temp = locationMarker;
					savedMarkers.push(temp)
					console.log(savedMarkers);
					
				}
				else { // remove location
					var searched_location = $("#search_input").val();
					savedLocationTotal = localStorage.getItem("saved_locations_count");
					localStorage.setItem("saved_locations_count", Number(localStorage.saved_locations_count) - 1);
				
					$("#saved_location_button span").text(save_location_msg);
				    for (var i=0; i < savedLocationTotal; i++) {
						if (localStorage.getItem(["saved_location" + Number(localStorage.saved_locations_count)]) == searched_location) {
							localStorage.removeItem("saved_location" + Number(localStorage.saved_locations_count));
						    savedMarkers.splice(i,1);
						}
					}
					markerImg = "images/locationicon.png";
					card_markerImg = "images/savedlocation.png";
				}
				
				locationMarker[0].setIcon(markerImg);
				console.log(localStorage);
			}
			else {
				console.log("There is no local storage support.");
			}
		}
		else
			console.log("The search input is empty.");
	});*/


	$("#more_info_button").on("click", function() {	
		if ($("#more_info_button span").text() === "More Info") {
			$("#more_info_button span").text("Less Info");
			$("#location_card .card-inner").empty().append("<p class=\"more-info\">More Info About " + leadLevelOfInput + "</p>");
		}
		else {
			$("#more_info_button span").text("More Info");
			$(".more-info").remove();
		}
	});
	
	setUpInitialMap();
}

function initAutocomplete(inputId) {
	var input = document.getElementById(inputId);
	var autocomplete = new google.maps.places.Autocomplete(input, {
		types: ['geocode']
	});
	autocomplete.setBounds(new google.maps.LatLngBounds({lat: 43.021, lng: -83.681}));
	
	return autocomplete;
}

function setUpFusionTable() {
	leadAndPredictiveLayer = new google.maps.FusionTablesLayer({
	    query: {
	      	select: '\'latitude\'',
	      	from: '17nXjYNo-XHrHiJm9oohgxBSyIXsYeXqlnVHnVrrX'
	    }, 
	    options: {
			suppressInfoWindows: "true"
	    },
	    styles: [{
			markerOptions: {
				iconName: "measle_grey"
			}
		}, {
			where: '\'leadlevel\' >= 15  AND \'leadlevel\' < 50',
			markerOptions: {
				iconName: "measle_brown"
			}
		}, {
			where: '\'leadlevel\' >= 50 ',
			markerOptions: {
				iconName: "small_red"
			}
		}, {
			where: '\'leadlevel\' >= 0 AND \'leadlevel\' < 15',
			markerOptions: {
				iconName: "small_yellow"
			}
		}]
	  });

	addFusionListener(leadAndPredictiveLayer);
}

function addFusionListener(object) {
		google.maps.event.addListener(object, 'click', function(e) {

			//var html = "<div>";
									
			//var icon1 = 'http://pix.iemoji.com/lg33/0271.png';
			//var image1 = "<img src='" + icon1 + "' title ='banana' /> ";
			
			var unknownRiskSrc = 'images/unknownrisklevel.png';
			var unknownRisk = "<img src='" + unknownRiskSrc + "' title ='unknownRisk' class='riskMeter' /> ";
			
			var lowRiskSrc = 'images/lowrisklevel.png';
			var lowRisk = "<img src='" + lowRiskSrc + "' title ='lowRisk' class ='riskMeter' /> ";
			
			var mediumRiskSrc = 'images/medrisklevel.png';
			var mediumRisk = "<img src='" + mediumRiskSrc + "' title ='medRisk' class='riskMeter' /> ";
			
			var highRiskSrc = 'images/highrisk.png';
			var highRisk = "<img src='" + highRiskSrc + "' title ='highRisk' class='riskMeter' /> ";
			
			//$(".riskMeter").css({"max-width": "50%", "max-height": "50%"});
						

			var content = "<div>";
			var details = ""
			var tempLegendInfo = "<div class='legend'>";
			
			e.infoWindow
			content += "<b>Address: </b>" + e.row['Address'].value + "<br>";
			if (e.row['leadlevel'].value != "") {
				content += "<b>Lead Level: </b>" + e.row['leadlevel'].value + "<br>";
				content += "<b>Last Tested: </b>" + e.row['testDate'].value;
				hideLegendCard();
			}

			else if (e.row['Prediction'].value >= 0.20) {
				//html += "<b>Predicted Risk: </b>" + e.row['Prediction'].value + "<br>";
				content += "<b>Predicted Risk: </b>" + highRisk + "<br>";
				details=attachLegendCard(tempLegendInfo);
			}
			else if (e.row['Prediction'].value > 0.10 && e.row['Prediction'].value < .20) {
				//html += "<b>Predicted Risk: </b>" + e.row['Prediction'].value + "<br>";
				content += "<b>Predicted Risk: </b>" + mediumRisk + "<br>";
				details=attachLegendCard(tempLegendInfo);
			}
			else if (e.row['Prediction'].value <= .10) {
				//html += "<b>Predicted Risk: </b>" + e.row['Prediction'].value + "<br>";
				content += "<b>Predicted Risk: </b>" + lowRisk + "<br>";
				details=attachLegendCard(tempLegendInfo);
			}
			else {
				content += "<b>Predicted Risk: </b>" + unknownRisk + "<br>";
				hideLegendCard();
			}
			
			content += "</div>";
	   		$("#location_card .card-inner").empty().html(content).append("<p id='211_info'>Need help? Call the <a href='http://www.centralmichigan211.org' target='_blank'>211 service</a>.</p>");
			if(windowWidth <= 600)
				$("#location_card .card-inner").append("<br>" + details);
			$("#location_card .card-action").hide();
	   		$("#location_card").show();
			

		});	
}

function attachLegendCard(tempLegendInfo){
		
		var placeholderDetails = tempLegendInfo;
			
		var unknownIconSrc = 'images/unknown_icon.png';
		var unknownicon = "<img src='" + unknownIconSrc + "' title ='unknown risk' class='legend_icons center-block' /> ";
			
		var lowIconSrc = 'images/low_icon.png';
		var lowicon = "<img src='" + lowIconSrc + "' title ='low risk' class ='legend_icons center-block' /> ";
			
		var mediumIconSrc = 'images/medium_icon.png';
		var mediumicon = "<img src='" + mediumIconSrc + "' title ='medium risk' class='legend_icons center-block' /> ";
			
		var highIconSrc = 'images/high_icon.png';
		var highicon = "<img src='" + highIconSrc + "' title ='high risk' class='legend_icons center-block' /> ";
		
		if(windowWidth <= 600){
			placeholderDetails += "<div class='row'>";
			placeholderDetails += "<div class='col-xs-3 text-center'>";
			placeholderDetails += unknownicon + "<span>Unknown</span>"; 
			placeholderDetails += "</div>";
			placeholderDetails += "<div class='col-xs-3 text-center'>";
			placeholderDetails += lowicon + "<span>Low</span>";
			placeholderDetails += "</div>";
			placeholderDetails += "<div class='col-xs-3 text-center'>";
			placeholderDetails += mediumicon + "<span>Medium</span>";
			placeholderDetails += "</div>";
			placeholderDetails += "<div class='col-xs-3 text-center'>";
			placeholderDetails += highicon + "<span>High</span>";
			placeholderDetails += "</div>";
			placeholderDetails += "</div>";
			placeholderDetails += "</div>";
			//$("location_card .card-inner").html(details);
			/*$("#legend_card .card-inner").empty().html(details);
			$("#legend_card .card-action").hide();
			$("#legend_card").show();*/
		}
		else {
			placeholderDetails += "<div class=row>";
			placeholderDetails += "<div class='col-md-5 text-center'>"
			placeholderDetails += unknownicon + "<span>Unknown</span>"; 
			placeholderDetails += mediumicon + "<span>Medium</span>";
			placeholderDetails += "</div>";
			placeholderDetails += "<div class='col-md-5 text-center'>"
			placeholderDetails += lowicon + "<span>Low</span>";
			placeholderDetails += highicon + "<span>High</span>"
			placeholderDetails += "</div>";
			placeholderDetails += "</div>";
			placeholderDetails += "</div>";
			$("#legend_card .card-inner").empty().html(placeholderDetails);
			$("#legend_card .card-action").hide();
			$("#legend_card").show();
			return 0;
		}

		return placeholderDetails;
}

function hideLegendCard() {
		$("#legend_card").hide();
		console.log(windowWidth);
		if(windowWidth <= 600){
			$("#location_card").css("bottom", "5px");
		}
}
/* Calls the Google Cloud Storage API and reads in the JSON files created from the database data. */
function callStorageAPI(object) {
	gapi.client.load('storage', 'v1').then(function() {
		var request = gapi.client.storage.objects.get({
			'bucket': defaultBucket,
			'object': object,
			'alt': 'media'
		});
		
		request.then(function(resp) {
			/* Heatmap Data */
			if (object == "leadlevels.json") {
				console.log("loading heatmap data");
				
				heatmapData = [];
				js_obj = $.parseJSON(resp.body);
				
				for (i=0; i<js_obj.leadLevels.length; i++) {
					var info = js_obj.leadLevels[i];
					// var weightValue = assignWeight(info.lead_ppb);
					heatmapData.push({lat: info.latitude, lng: info.longitude, lead: info.leadlevel, date: info.dateUpdated, address: info.StAddress});
				}
			}
			/* Lead level area data. */
			else if (object == "leadLevels_birdview.json") {
				js_obj = $.parseJSON(resp.body);
				
				leadLayerBirdView_markers = [];
				var latDist = 0.00366980384615384615384615384615;
				var lngDist = 0.00409039615384615384615384615385;
				for (var i=0; i<js_obj.area.length; i++) {  
					var temp = js_obj.area[i]; 					
					var numOfTests = temp.numOfTests;
					var numOfDangerous = temp.numOfDangerous;

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
						color = "#99FF99";
					}
					else if (weirdnessLevel < .6) {
						color = "#FFFF99 ";
					}
					else {
						color = "#FF6565 ";
					}

					var opacity;
					if (numOfTests < 25) {
						opacity = .2;
					}
					else if (numOfTests < 50) {
						opacity = .2;
					}
					else if (numOfTests < 100) {
						opacity = .2;
					}
					else if (numOfTests < 150) {
						opacity = .2;
					}
					else {
						opacity = .2;
					}

					var leadLevelAreaSquare = new google.maps.Polygon({
						paths: squareCoordinates,
						strokeColor: color,
						strokeOpacity: 0,
						fillColor: color,
						fillOpacity: opacity,
						map: map
					});

					leadLayerBirdView_markers.push(leadLevelAreaSquare);

					var content = "";
					content += "<div>";
					content += "<h5><b>About this area</b></h5>";
					content += "<p>There were <b>" + numOfTests + "</b> tests in this area. </p>";
					content += "<p>Of these tests, <b>" + numOfDangerous + "</b> tests had dangerous lead levels. </p>"
				/*	content += "<p><small>Zoom in see more details</small></p>"*/
					content += "</div>";
					
					attachLocationCard("lead", leadLevelAreaSquare, "", content);
					//attachLocationCard("lead", leadLevelAreaSquare, map, content);
					// attachLocationCard(birdMarker, map, content);
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
						markerImg = "images/water_pickup_icon.png";
						images += "<img src='" + markerImg + "' class='marker_popup_icons' title='Water Pickup' /> ";
						resourcesAvailable += "Water Pickup, ";
						
						if (icon == null)
							icon = waterPickupIcon;
					}
					
					if (provider.resType.indexOf("Recycle") != -1) {
						markerImg = "images/recycle_icon.png";
						images += "<img src='" + markerImg + "' class='marker_popup_icons' title='Recycling' /> ";
						resourcesAvailable += "Recycling, ";
						
						if (icon == null)
							icon = recycleIcon;
					}
					
					if (provider.resType.indexOf("Blood Testing") != -1) {
						markerImg = "images/bloodtest_icon.png";
						images += "<img src='" + markerImg + "' class='marker_popup_icons' title='Blood Testing' /> ";
						resourcesAvailable += "Blood Testing, ";
						
						if (icon == null)
							icon = bloodIcon;
					}
					
					if (provider.resType.indexOf("Water Filters") != -1) {
						markerImg = "images/water_filter_icon.png";
						images += "<img src='" + markerImg + "' class='marker_popup_icons' title='Water Filters' /> ";
						resourcesAvailable += "Water Filters, ";
						
						if (icon == null)
							icon = filterIcon
					}
					
					if (provider.resType.indexOf("Test Kits") != -1) {
						markerImg = "images/lead_test_icon.png";
						images += "<img src='" + markerImg + "' class='marker_popup_icons' title='Water Testing' />";
						resourcesAvailable += "Water Testing";
						
						if (icon == null)
							icon = leadTestIcon;
					}
					
					allMarkersString.push(resourcesAvailable);
					
					var content = "<h5 id='provider_title'>" + title + "</h5> <p id='provider_address'>" + provider.aidAddress + "</p>";
					
					if (provider.phone.length > 0)
						content += "<p id='provider_phone'>" + provider.phone + "</p>";
					
					if (provider.hours.length > 0)
						content += "<p id='provider_hours'>" + provider.hours + "</p>";
					
					if (provider.notes.length > 0)
						content += "<p id='provider_notes'>" + provider.notes + "</p>";
					
					// content += "<p>" + images + "</p></div>";
					content += "<p id='provider_resources'>" + images + "</p>"
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

				setMarkers();
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
				for (var i = 0; i <= masterPipeArray.length; i++) {
					for (var k = 0; k < masterPipeArray[i].length; k++) {
						pipeObject = {lat: masterPipeArray[i][k][0], lng: masterPipeArray[i][k][1]};
						pipeLine.push(pipeObject);}
						
						autoPolyLine = new google.maps.Polyline({
						path: pipeLine,
						strokeColor: '#511883',
						strokeOpacity: .9,
						strokeWeight: 2
						});
						
						arrayOfLines.push(autoPolyLine);
						pipeLine = [];
				}
			}
				
		}, function(reason) {
			console.log('Error: ' + reason.result.error.message);
		});
	});
}

function weirdnessEquation(N, K) {
	var sqrt = Math.sqrt(N);
	var weirdness = (K/sqrt) - (sqrt*.084);
	return weirdness;
}

function setUpInitialMap() {
	var retrieveArray = localStorage.getItem("resource_array");
		
	console.log(localStorage);

	if ((localStorage !== "undefined") && (retrieveArray != null)) {
		resourceActiveArray = JSON.parse(retrieveArray);
		localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
	}
	else {
		localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
	}

	if (resourceActiveArray[0] == 1) {
		$("#heatmap_btn").addClass("active");
		$("#heatmap_btn img").attr("src", "../images/lead_info_icon.png");
	}
	if (resourceActiveArray[1] == 1) {
		$("#water_pickup_btn").addClass("active");
		$("#water_pickup_btn img").attr("src", "../images/water_pickup_icon.png");
	}
	if (resourceActiveArray[2] == 1) {
		$("#recycling_btn").addClass("active");
		$("#recycling_btn img").attr("src", "../images/recycle_icon.png");
	}
	if (resourceActiveArray[3] == 1) {
		$("#water_filters_btn").addClass("active");
		$("#water_filters_btn img").attr("src", "../images/water_filter_icon.png");
	}
	if (resourceActiveArray[4] == 1) {
		$("#water_testing_btn").addClass("active");
		$("#water_testing_btn img").attr("src", "../images/lead_test_icon.png");
	}
	if (resourceActiveArray[5] == 1) {
		$("#blood_testing_btn").addClass("active");
		$("#blood_testing_btn img").attr("src", "../images/bloodtest_icon.png");
	}
	if (resourceActiveArray[6] == 1) {
		$("#pipes_btn").addClass("active");
		$("#pipes_btn img").attr("src", "../images/pipes_icon.png");
	}

	setMarkers();
}

function attachLocationCard(type, marker, address, content) {
	marker.addListener("click", function() {		
		$("#resource_card, #legend_card").hide();
		
		if ((address.length != 0) && content.length == 0)
			content = createLocationContent(marker, address)
		
		// map.panTo(marker.getPosition());
		$("#location_card .card-inner").html(content, "<p id='211_info'>Need help? Call the <a href='http://www.centralmichigan211.org' target='_blank'>211 service</a>.</p>");;
		
		if (type.indexOf("location") != -1)
			$("#location_card .card-action").show();
		else
			$("#location_card .card-action").hide();
		
		$("#location_card").show();
		
		savedLocationMarkers.push(marker);
	});
}

/* Location info card content generation. */
function createLocationContent(tempLocationMarker, address) {
	var streetAddress = address;
	var leadMeter = "No reported reading.";
	var leadPrediction = "No prediction available.";
	//var leadMsg = "OK to use filtered water, except children under 6 and pregnant women.";
	var leadMsg = "";
	var tempAddr;

	for (var i=0; i < heatmapData.length; i++) {
		tempAddr = heatmapData[i].address.valueOf();
		if (tempAddr === streetAddress) {
			leadMeter = heatmapData[i].lead + " ppb";
			leadLevelOfInput = heatmapData[i].lead;
			break;
		}
		else
			leadLevelOfInput = -1;
	}

	if (leadLevelOfInput >= 0 && leadLevelOfInput < 15) {
		leadPrediction = "Predicted low lead levels";
	}
	else if (leadLevelOfInput >= 15 && leadLevelOfInput < 150) {
		leadPrediction = "Predicted medium lead levels";
	}
	else if (leadLevelOfInput >= 150) {
		leadPrediction = "Predicted high lead levels";
		leadMsg = "Not safe to drink even if filtered."
	}
	
	return "<h5 id='address'>" + streetAddress + "</h5> <h5 id='prediction'>" + leadPrediction + "</h5> <p id='lead_meter'>" + leadMeter + "</p> <p id='lead_msg'>" + leadMsg + "</p>";
}

function bindInfoWindow(type, marker, map, resourcesAvailable, content) {
	if (type.indexOf("resource") != -1) {
		marker.addListener("click", function() {
			$("#location_card, #legend_card").hide();
			
			isSaved = checkIfSaved(marker.getPosition());
			map.panTo(marker.getPosition());
			$("#resource_card .card-inner").empty().prepend(content);
			
			console.log(resourcesAvailable);
			
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
			
			//console.log(map.getBounds());
			//console.log("#map_container offset top = " + $("#map_container").offset().top);
			//console.log(marker.getPosition());
			
			$("#resource_card").show();
			
			if (isSaved)
				$("#resource_card #card_save .material-icons").html("star");
			else
				$("#resource_card #card_save .material-icons").html("star_border");
			
			resourceMarker = marker;
		});
	}
}

// function displaySavedLocations() {
	/*$("#location_card").css({
		"width": function() {
			return $("#search_input").outerWidth() + parseInt($("#search_button").outerWidth());
		},
		"bottom": function() {
			return parseInt($("#search_input").css("top")) + parseInt($("#search_input").height()) + 20 + "px";
		},
		"left": function() {
			return parseInt($("#search_input").css("left")) + parseInt($("#search_input").css("margin-left")) + "px";
		}
	});*/
	
	/* Saved Location Selection Card */
	/*if ((localStorage.getItem("saved_locations_count") !== null) && (localStorage.saved_locations_count > 0)) {
		$("#location_card .card-inner").html("<h6>Saved Locations</h6>");
		$("#location_card .card-action").css("font-size", "0.5rem");
		
		var saved_locations = "<div id=\"saved_locations\">";
		// for (var i=0; i < ;i++)
		if (localStorage.getItem("saved_location1") !== null) {
			saved_locations += "<div class=\"card-action\"><button type=\"button\" class=\"close\" >&times;</button> <button type=\"button\" name=\"saved_location1\" class=\"btn btn-flat btn-brand saved-location\"><img src=\"images/savedlocation.png\" /> <span>" + localStorage.getItem("saved_location1") + "</span></button></div>";
		}
		
		if (localStorage.getItem("saved_location2") !== null) {
			saved_locations += "<div class=\"card-action\"><button type=\"button\" class=\"close\" >&times;</button> <button type=\"button\" name=\"saved_location2\" class=\"btn btn-flat btn-brand saved-location\"><img src=\"images/savedlocation.png\" /> <span>" + localStorage.getItem("saved_location2") + "</span></button></div>";
		}
		
		if (localStorage.getItem("saved_location3") !== null) {
			saved_locations += "<div class=\"card-action\"><button type=\"button\" class=\"close\" >&times;</button> <button type=\"button\" name=\"saved_location3\" class=\"btn btn-flat btn-brand saved-location\"><img src=\"images/savedlocation.png\" /> <span>" + localStorage.getItem("saved_location3") + "</span></button></div>";
		}
		
		saved_locations += "</div>";
		
		$("#location_buttons").css("display", "none");
		$("#location_card .card-action").append(saved_locations);
		$("#location_card").css("display", "block");
	}*/
// }

/* Set markers on the map based on type. */
function setMarkers() {
	console.log("setMarkers() map = " + map);
	var zoomLvl = map.getZoom();
	
	// fusion table data
	if ((resourceActiveArray[0] == 1) && (zoomLvl < 16)) {
		leadAndPredictiveLayer.setMap(null);
		for (var i = 0; i < leadLayerBirdView_markers.length; i++)
			leadLayerBirdView_markers[i].setMap(map);
	}
	else if ((resourceActiveArray[0] == 1) && (zoomLvl >= 16)) {
		leadAndPredictiveLayer.setMap(map);
		for (var i = 0; i < leadLayerBirdView_markers.length; i++)
			leadLayerBirdView_markers[i].setMap(null);
	}
	else if (resourceActiveArray[0] == 0) {
		leadAndPredictiveLayer.setMap(null);
		for (var i = 0; i < leadLayerBirdView_markers.length; i++)
			leadLayerBirdView_markers[i].setMap(null);
	}
	
	for (var i = 0; i < allMarkers.length; i++) {
		allMarkers[i].setMap(null);
		
		// console.log("allMarkersString[i] = " + allMarkersString[i]);
		
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
		constructionMarker.setMap(map);
		for (var i = 0; i < arrayOfLines.length; i++)
			arrayOfLines[i].setMap(map);
		
		waterplantMarker.setMap(map);
	}
	else {
		constructionMarker.setMap(null);
		waterplantMarker.setMap(null);
		for (var i = 0; i < arrayOfLines.length; i++)
			arrayOfLines[i].setMap(null);
	}
}

function checkIfSaved(latLong) {
	var numberSaved = parseInt(localStorage["numberSaved"]);
	var returnVal = false;
	for (var i=1; i <= numberSaved; i++) {
		if (localStorage.getItem("savedLocationPosition"+i) == latLong)
			return true;
	}
}

function saveLocation(latLong, address, icon, type) {
	var numberSaved = localStorage.getItem("numberSaved");
	
	if (numberSaved == null)
		numberSaved = 1;
	else {
		numberSaved = parseInt(numberSaved);
		numberSaved++;
	}
	
	localStorage.setItem("numberSaved", numberSaved);
	localStorage.setItem("savedLocationPosition"+numberSaved, latLong);
	localStorage.setItem("savedLocationAddress"+numberSaved, address);
	localStorage.setItem("savedLocationType"+numberSaved, type);
	localStorage.setItem("savedLocationIcon"+numberSaved, icon);
}

function unsaveLocation(latLong) {
	var numberSaved = parseInt(localStorage.getItem("numberSaved"));
	for (var i=1; i <= numberSaved; i++) {
		if (localStorage.getItem("savedLocationPosition"+i) == latLong) {
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
	
	return (numberSaved+1);
}

/*function unsaveLocation(locationInput) {
	localStorage.setItem("saved_locations_count", Number(localStorage.saved_locations_count) - 1);
	savedLocationTotal = localStorage.getItem("saved_locations_count");
	
	for (var i=0; i < savedLocationTotal;i++) {
		if (locationStorage.getItem(["saved_location" + Number(localStorage.saved_locations_count)]) == locationInput)
			localStorage.removeItem("saved_location"+i);
	}
		
		if (localStorage.saved_location1 == locationInput) {
			localStorage.removeItem("saved_location1");
		}
		else if (localStorage.saved_location2 == locationInput) {
			localStorage.removeItem("saved_location2");
		}
		else if (localStorage.saved_location3 == locationInput) {
			localStorage.removeItem("saved_location3");
		}
	
}*/

$(document).ready(function() {
	/* Get the data from the database and save it into JSON files. */
	/*$.ajax({
		method: "POST",
		url: "includes/json_processing.php",
		complete: function(resp) {
			if (resp.responseText == "error") {
				$(".alert-warning").append("<strong>Error:</strong> The map data didn't load successfully.")
				$(".alert-warning").css("display", "block");
			}
		}
	});
	*/
	
	//localStorage.clear();
	console.log(localStorage);

	if (typeof(Storage) !== "undefined") {
		$("#heatmap_btn").on('click', function() {
			$("#resource_card, #location_card, #legend_card").hide();
			
			//if (resourceActiveArray[0] == 1 && $("#heatmap_btn").hasClass("active")) {
			if (resourceActiveArray[0] == 1) {
				resourceActiveArray[0] = 0;
				$("#heatmap_btn img").attr("src", "../images/lead_info_icon_white.png");
			}
			else {
				resourceActiveArray[0] = 1;
				$("#heatmap_btn img").attr("src", "../images/lead_info_icon.png");
			}
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});

		$("#water_pickup_btn").on('click', function() {
			$("#resource_card, #location_card, #legend_card").hide();
			
			if (resourceActiveArray[1] == 1) {
				resourceActiveArray[1] = 0;
				$("#water_pickup_btn img").attr("src", "../images/water_pickup_icon_white.png");
			}
			else {
				resourceActiveArray[1] = 1;
				$("#water_pickup_btn img").attr("src", "../images/water_pickup_icon.png");
			}
			
			if (map.getZoom() > 15)
				map.setZoom(15);
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});

		$("#recycling_btn").on('click', function() {
			$("#resource_card, #location_card, #legend_card").hide();
			
			if (resourceActiveArray[2] == 1) {
				resourceActiveArray[2] = 0;
				$("#recycling_btn img").attr("src", "../images/recycle_icon_white.png");
			}
			else {
				resourceActiveArray[2] = 1;
				$("#recycling_btn img").attr("src", "../images/recycle_icon.png");
			}
			
			if (map.getZoom() > 15)
				map.setZoom(15);
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});

		$("#water_testing_btn").on('click', function() {
			$("#resource_card, #location_card, #legend_card").hide();
			
			if (resourceActiveArray[4] == 1) {
				resourceActiveArray[4] = 0;
				$("#water_testing_btn img").attr("src", "../images/lead_test_icon_white.png");
			}
			else {
				resourceActiveArray[4] = 1;
				$("#water_testing_btn img").attr("src", "../images/lead_test_icon.png");
			}
			
			if (map.getZoom() > 15)
				map.setZoom(15);
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});

		$("#blood_testing_btn").on('click', function() {
			$("#resource_card, #location_card, #legend_card").hide();
			
			if (resourceActiveArray[5] == 1) {
				resourceActiveArray[5] = 0;
				$("#blood_testing_btn img").attr("src", "../images/bloodtest_icon_white.png");
			}
			else {
				resourceActiveArray[5] = 1;
				$("#blood_testing_btn img").attr("src", "../images/bloodtest_icon.png");
			}
			
			if (map.getZoom() > 14)
				map.setZoom(14);
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});

		$("#water_filters_btn").on('click', function() {
			$("#resource_card, #location_card, #legend_card").hide();
			
			if (resourceActiveArray[3] == 1) {
				resourceActiveArray[3] = 0;
				$("#water_filters_btn img").attr("src", "../images/water_filter_icon_white.png");
			}
			else {
				resourceActiveArray[3] = 1;
				$("#water_filters_btn img").attr("src", "../images/water_filter_icon.png");
			}
			
			if (map.getZoom() > 15)
				map.setZoom(15);
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});

		$("#pipes_btn").on('click', function() {
			$("#resource_card, #location_card, #legend_card").hide();
			
			if (resourceActiveArray[6] == 1) {
				resourceActiveArray[6] = 0;
				$("#pipes_btn img").attr("src", "../images/pipes_icon_white.png");
			}
			else {
				resourceActiveArray[6] = 1;
				$("#pipes_btn img").attr("src", "../images/pipes_icon.png");
			}
			
			if (map.getZoom() > 15)
				map.setZoom(15);
			
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
			setMarkers();
		});
	}
	else {
		console.log("No local storage support.");
		window.stop(); // stop loading the page
	}

	// gives directions to a resource location when get dircetions is clicked
	$("#resource_card #card_directions").on("click", function() {
		resource_directions = resourceMarker.getPosition();
        window.open('http://maps.google.com/?q='+resource_directions,'_blank');
	});

	// saves/unsaves resource location when save button is clicked on the resource card
	$("#resource_card #card_save").on("click", function() {
		var latLong = resourceMarker.getPosition();
		var streetAddress = $("#resource_card #provider_address").html();
		var unsavedIcon = resourceMarker.getIcon().url;
		var savedLocationNum
		var isSaved = checkIfSaved(latLong);
		
		console.log("streetAddress = " + streetAddress);
		
		// resource has already been saved
		if (isSaved) {
			var temp = resourceMarker;
			var savedIcon;
			var oldIcon;
			
			// remove from local storage
			savedLocationNum = unsaveLocation(latLong);
			console.log("savedLocationNum = " + savedLocationNum);
			savedIcon = localStorage.getItem("savedLocationIcon"+savedLocationNum);
			localStorage.removeItem(["savedLocationIcon"+savedLocationNum]);			
			console.log("savedIcon = " + savedIcon);
			
			// change image on card to star outline
			$("#resource_card #card_save .material-icons").html("star_outline");
			
			// remove from savedMarkers 
			for (var i = 0; i < savedMarkers.length; i++) {
				if (savedMarkers[i].getPosition() == latLong)
					savedMarkers.splice(i, 1);
			}
			
			// restore unsaved location icon
			console.log(temp);
			console.log("temp.getIcon().url = " + temp.getIcon().url);
			console.log(waterPickupIcon);
			
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
			console.log("temp.getIcon().url = " + temp.getIcon().url);
			
			// add to all markers and reset map
			allMarkers.push(temp);
			// setMarkers();
		}
		// resource has not been saved
		else {
			var temp;
			
			// add to local storage
			saveLocation(latLong, streetAddress, unsavedIcon, "Resource");
			
			// change image on card to filled star
			$("#resource_card #card_save .material-icons").html("star");
			
			// remove from allMarkers 
			for (var i = 0; i < allMarkers.length; i++) {
				if (allMarkers[i].getPosition() == latLong)
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
	$("#resource_card .dropdown-menu li").on("click", function(event){
		var selectedReason = $(event.target).text(); // Get the text of the element
		var resourceAddress = $("#resource_card #provider_address").html();	// Get the address of the element
		var problemObject = {type:"resource", reason: selectedReason, address: resourceAddress};

		$.ajax({
			method: "POST",
			url: "includes/functions.php",
			data: problemObject,
			success: function(data){
				console.log("Resource report data successfully saved.");
			},
			error: function(response) {
				console.log("Resource report data wasn't saved.");
			}
		});
	});
	
	/* When a saved location is clicked, put the location in search bar and search. */
	/*$(document).on('click', '.saved-location', function() {
		$('#search_input').val($(this).text());
		// $('#search_button').click();

		var input = $(this).text();

		google.maps.event.trigger(input, 'focus');
		
		google.maps.event.trigger(input, 'keydown', function() {
			keyCode: 13
		});
			
		updateLocationZoom();
	});*/
	
	// saves/unsaves a non-resource location when save button is clicked on the location card
	$("#location_card #card_save").on("click", function() {
		var latLong;
		
		if (locationMarker)
			latLong = locationMarker.getPosition();
		
		var streetAddress = $("#location_card #address").text();
		var numberSaved = parseInt(localStorage.getItem("numberSaved"));
		var isSaved = false;
		var unsavedIcon = locationIcon.url;
		var savedLocationNum;
		
		//console.log("geocoded latLong:");
		//console.log(latLong.lat() + ", " + latLong.lng());
		
		if (latLong)
			isSaved = checkIfSaved(latLong);
		else {
			for (var i = 1; i <= numberSaved; i++) {
				if (localStorage.getItem("savedLocationAddress"+i).indexOf(streetAddress) != -1) {
					console.log(localStorage.getItem("savedLocationPosition"+i));
					latLong = localStorage.getItem("savedLocationPosition"+i);
					isSaved = true;
				}
			}
		}
		
		// location has already been saved
		if (isSaved) {
			var temp = locationMarker;
			
			// remove from local storage
			savedLocationNum = unsaveLocation(latLong);
			localStorage.removeItem(["savedLocationIcon"+savedLocationNum]);			
			temp.setIcon(locationIcon);
			
			// change image on card to star outline
			$("#location_card #card_save .material-icons").html("star_outline");
			
			// remove from savedMarkers 
			for (var i = 0; i < savedMarkers.length; i++) {
				if (savedMarkers[i].getPosition() == latLong)
					savedMarkers.splice(i, 1);
			}
			
			// add to all markers and reset map
			allMarkers.push(temp);
			// setMarkers();
		}
		// location has not been saved
		else {
			var temp;
			
			// add to local storage
			saveLocation(latLong, streetAddress, unsavedIcon, "Non-Resource");
			
			// change image on card to filled star
			$("#location_card #card_save .material-icons").html("star");
			
			// remove from allMarkers 
			for (var i = 0; i < allMarkers.length; i++) {
				if (allMarkers[i].getPosition() == latLong)
					allMarkers.splice(i,1);
				
				temp = locationMarker;
				
				// change the location icon to the saved icon
				temp.setIcon(savedLocationIcon);
				
				savedMarkers.push(temp);
			}
		}
		
		console.log(localStorage);
	});

	// closes the location card and removes the marker
	/*$("#location_card .card-inner button").on("click", function() {
		locationMarker[0].setMap(null);
		$("#location_card").css("display", "none");
		$("#search_input").val('');
		displaySavedLocations();
	});*/

	$("#location_card .close, #resource_card .close, #legend_card .close").on("click", function() {
		$(this).parent().hide();
	});
	
	$("#search_input").keyup(function() {
		if ($("#search_input").val()) {
			$("#search_button").css("color", "#FFF");
			activeSearch = 1;
		}
		else {
			$("#search_button").css("color", "#61b1ff");
			activeSearch = 0;
		}
	});
});