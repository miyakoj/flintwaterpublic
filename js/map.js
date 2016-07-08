/* Google Service Account info */
var clientId = "807599170352-afiu7fosjp2hg4n6gs3ghc99momgfica.apps.googleusercontent.com";
var apiKey = "AIzaSyAr4wgD-8jV8G7gv600mD75Ht1eS3B4siI";

// Access Google Cloud Storage
var default_bucket = "flint-water-project.appspot.com";
var scope = "https://www.googleapis.com/auth/devstorage.read_only";

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var map;
var infoWindow;
var heatmap;
var leadLayer; //fusion table layer to set up lead levels
var predictiveLayer; //fusion table layer to show predicted lead levels
var heatmapData;

var $location_buttons;

var allMarkers = [];
var allMarkersString = [];
var resourceActiveArray = [1, 0, 0, 0, 0, 0];  //heatmap, water pickup, recycle, filter, lead, blood
var location_marker = [];
var marker_img;

//for construction
var constructionMarker;
var pipeToggle = 0;

//for water plant
var waterplantMarker;

// for pipe visualization
var arrayOfLines = new Array();
var masterPipeArray = new Array();
var autoPolyLine;

//icons
var bloodIcon;
var waterpickupIcon;
var leadTestIcon;
var recycleIcon;
var filterIcon;
var constructionIcon;
var waterPlantIcon;

var leadLevelOfInput;

/* Size the map popup icons based on whether the device is mobile or not. */
var iconSize;

if (windowWidth < 992)
	iconSize = 25;
else
	iconSize = 30;

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

	callStorageAPI("leadlevels.json");
	callStorageAPI("providers.json");
	callStorageAPI("pipedata.json");
	setUpFusionTable();

	allMarkers.forEach(function(marker) {
		marker.setMap(null);
	});

	//make icons for each resource
	bloodIcon = {
		url: 'images/bloodtesticon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	waterpickupIcon = {
		url: 'images/waterpickupicon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	leadTestIcon = {
		url: 'images/leadtesticon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	recycleIcon = {
		url: 'images/recycleicon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	filterIcon = {
		url: 'images/waterfiltericon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	constructionIcon = {
		url: 'images/constructionicon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	waterplantIcon = {
		url: 'images/waterplanticon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	
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
	bindInfoWindow(constructionMarker, map, infoWindow, constructionContent);

	constructionMarker.setMap(null);
	
	//Water Plant Junk
	var waterplantLatLng = {lat:43.056269, lng:-83.669625};
	var waterplantTitle = "City of Flint Water Plant";
	var waterplantImage = "images/waterplanticon.png";
	waterplantMarker = new google.maps.Marker({
		position : waterplantLatLng,
		map: map,
		title: waterplantTitle,
		icon: waterplantIcon
	});
	
	var waterplantContent = "<h1>City of Flint Water Plant</h1> <p>4500 N Dort Hwy, Flint, MI 48505</p>";
	bindInfoWindow(waterplantMarker, map, infoWindow, waterplantContent);
	
	waterplantMarker.setMap(null);
	
	// Create the search box and link it to the UI element.
	var input = document.getElementById('search_input');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});

	google.maps.event.addListener(map, 'zoom_changed', function() {
	    zoomLevel = map.getZoom();
	    if (zoomLevel >= 17 && resourceActiveArray[0] == 1) {
	        predictiveLayer.setMap(map);
	        leadLayer.setMap(map);
	    } 
	    else if (zoomLevel < 17) {
	    	predictiveLayer.setMap(null);
	    } 
	});
	
	/* Saved Location Selection Card */
	if ((localStorage.getItem("saved_locations_count") !== null) && (localStorage.saved_locations_count > 0)) {
		$("#location_card .card-inner").html("<h6>Saved Locations</h6>");
		$("#location_card .card-action").css("font-size", "0.5rem");
		
		var saved_locations = "<div id=\"saved_locations\">";
		
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
	}
	
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();
		var place = places[0];
		if (places.length == 0)
			return;

	  // For each place, get the icon, name and location.
	  var bounds = new google.maps.LatLngBounds();
	  
	  var marker_icon = {
		url: 'images/locationicon.png',
		size: new google.maps.Size(64, 64),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(17, 34),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	  };
	  
	  updateSaveButtons();

	  //get rid of previous markers if they exist
	  if(location_marker.length > 0){
	  		location_marker[0].setMap(null);
	  		location_marker = [];
		}
	  // Create a marker for the place.
	  location_marker.push(new google.maps.Marker({
		position: place.geometry.location,
		map: map,
		title: place.name,
		icon: marker_icon
	  }));

	  if (place.geometry.viewport) {
		// Only geocodes have viewport.
		bounds.union(place.geometry.viewport);
	  }
	  else {
		bounds.extend(place.geometry.location);
	  }
	  
	  /*places.forEach(function(place) {
		var marker_icon = {
		  url: 'images/locationicon.png',
		  size: new google.maps.Size(64, 64),
		  origin: new google.maps.Point(0, 0),
		  anchor: new google.maps.Point(17, 34),
		  scaledSize: new google.maps.Size(iconSize, iconSize)
		};
		
		updateSaveButtons();

		// Create a marker for the place.
		location_marker.push(new google.maps.Marker({
			position: place.geometry.location,
			map: map,
			title: place.name,
			icon: marker_icon
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

	  /* Location Info Card */
	  $("#location_card").css({
			"display": "block"
		});
		
		if (windowWidth < 992) {
			$("#location_card").css({
				"margin": "0 5px",
				"bottom": "5px"
			});
			
			$("#location_card").appendTo("body");
		}
		else {
			$("#location_card").css({
				"width": function() {
					return $("#search_input").outerWidth() + parseInt($("#search_button").outerWidth());
				},
				"top": function() {
					return parseInt($("#search_input").css("top")) + (parseInt($("#search_input").height()) + 20) + "px";
				},
				"left": function() {
					return parseInt($("#search_input").css("left")) + parseInt($("#search_input").css("margin-left")) + "px";
				}
			});
		}
		
	  	var inputAddress = place.formatted_address.split(',');
	  	var streetAddress = inputAddress[0].toUpperCase();
	  	var lead_meter;
		var lead_prediction;
		var lead_msg = "OK to use filtered water, except children under 6 and pregnant women.";	


	  	for(var i=0; i < heatmapData.length; i++) {
	  		var tempAddr = heatmapData[i].address.valueOf();
	  		if(tempAddr === streetAddress) {
	  			lead_meter = heatmapData[i].lead + " ppb";
	  			leadLevelOfInput = heatmapData[i].lead;
	  			break;
	  		}
	  		else{
				 lead_meter = "No Reported Reading";
				 leadLevelOfInput = -1;
	  		}
	  	}

	  	if(leadLevelOfInput >= 0 && leadLevelOfInput < 15){
	  		lead_prediction = "Predicted low lead levels";
	  	}
	  	else if(leadLevelOfInput >= 15 && leadLevelOfInput < 150){
	  		lead_prediction = "Predicted medium lead levels";
	  	}
	  	else if(leadLevelOfInput >= 150){
	  		lead_prediction = "Predicted high lead levels";
	  		lead_msg = "Not safe to drink even if filtered."
	  	}

		/* Display appropriate lead rating and message. */
		$("#location_card .card-inner").html("<button type=\"button\" class=\"close\" >&times;</button> <h6>" + lead_prediction + "</h6> <p>" + lead_meter + "</p> <p>" + lead_msg + "</p>");
	});
	
	//303 E Kearsley St, Flint, MI, United States
	
	
	$("#search_button").css({
		"top": function() {
				return $("header").outerHeight() + $("#toggles").outerHeight() + 20;
			   }
	});
	
	// Check the saved locations if enter is pressed while in the search box
	$("#search_input").on("keydown", function(event) {
		if (event.which == 13)
			updateSaveButtons();
	});
	
	// hide the location card if the search box is empty
	$("#search_input").on("change", function(event) {
		if ($(this).val() == "")
			$("#location_card").css("display", "none");
	});
	
	// Trigger search on button click
    $("#search_button").on("click", function() {
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
		//var searched_location_sub = searched_location.substring(1, searched_location.length);

		//console.log(localStorage.saved_location1);
		//console.log(searched_location_sub);
		//console.log(searched_location);
		
		marker_img = "images/savedlocation.png"; // saved location icon by default
		
		if (localStorage.saved_location1 === searched_location) {
			$("#saved_location_button span").text(saved_location_msg);
			//$("#saved_location_button img").src("images/locationicon.png");
		}
		else if (localStorage.saved_location2 === searched_location) {
			$("#saved_location_button span").text(saved_location_msg);
			//$("#saved_location_button img").src("images/locationicon.png");
		}
		else if (localStorage.saved_location3 === searched_location) {
			$("#saved_location_button span").text(saved_location_msg);
			//$("#saved_location_button img").src("images/locationicon.png");
		}
		else {
			$("#saved_location_button span").text(save_location_msg);
			marker_img = "images/locationicon.png";
		}
		
		 // change the location card icon dynamically
		
		console.log(localStorage);


		map.setZoom(25);
		console.log("zooming");
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
					card_marker_img = "images/locationicon.png";
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
					marker_img = "images/locationicon.png";
					card_marker_img = "images/savedlocation.png";
				}
				
				location_marker[0].setIcon(marker_img);
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
		if($("#more_info_button span").text() === "More Info"){
			$("#more_info_button span").text("Less Info");
			$("#location_card .card-inner").append("<p class=\"more-info\">More Info About " + leadLevelOfInput + "</p>");
		}
		else{
			$("#more_info_button span").text("More Info");
			$(".more-info").remove();
		}
	});

	setUpInitialMap();
	setMarkers();
}

function setUpFusionTable() {
	

	predictiveLayer = new google.maps.FusionTablesLayer({
	    query: {
	      select: '\'Latitude\'',
	      from: '1R_o5DbTIn73NQwaZvCw9V-I1zHh1FMk44p4ofwHJ'
	    }/*, 
	    styles: [{
			markerOptions: {
				iconName: "measle_grey"
			}
		}]*/
	  });

	google.maps.event.addListener(predictiveLayer, 'click', function(e) {
		e.infoWindowHtml = "<b>Address: </b>" + e.row['goog_address'].value + "<br>";
		var riskLevel;
			riskLevel = 'Low';
		}
			riskLevel = 'Medium';
		}
		else {
			riskLevel = 'High';
		}
		e.infoWindowHtml += "<b>Predicted Risk: </b>" + riskLevel + "<br>";

	});	

	leadLayer = new google.maps.FusionTablesLayer({
	    query: {
	      select: '\'latitude\'',
	      from: '1dO36ANyD5kyN3gSZ0jzv5cEYkmH4WXR861ufmLMg'
	    }, 
	    styles: [{
			where: '\'Lead Level\' >= 15  AND \'Lead Level\' < 50',
			markerOptions: {
				iconName: "small_yellow"
			}
		}, {
			where: '\'Lead Level\' >= 50 ',
			markerOptions: {
				iconName: "small_red"
			}
		}, {
			where: '\'Lead Level\' >= 0 AND \'Lead Level\' < 15',
			markerOptions: {
				iconName: "small_green"
		}
		}]
	  });

	google.maps.event.addListener(leadLayer, 'click', function(e) {
		e.infoWindowHtml = "<b>Address: </b>" + e.row['Address'].value + "<br>";
		e.infoWindowHtml += "<b>Lead Level: </b>" + e.row['Lead Level'].value + "<br>";
		e.infoWindowHtml += "<b>Date Tested: </b>" + e.row['Date Tested'].value;

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
				heatmapData = [];
				js_obj = $.parseJSON(resp.body);
				
				/*for(i=0; i<js_obj.leadLevels.length; i++) {
					var info = js_obj.leadLevels[i];
					var weightValue = assignWeight(info.leadLevel);
					heatmapData.push({location: new google.maps.LatLng(info.latitude, info.longitude), weight: weightValue});
				}*/
				for(i=0; i<js_obj.leadLevels.length; i++) {
					var info = js_obj.leadLevels[i];
					//var weightValue = assignWeight(info.lead_ppb);
					heatmapData.push({lat: info.latitude, lng: info.longitude, lead: info.leadlevel, date: info.dateUpdated, address: info.StAddress});
				}
				
				/*function assignWeight(levelIn){
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
				console.log("heatmap is initiated");
				//heatmap.setMap(map);*/
			}
			/* Provider Data */
			else if (object == "providers.json") {
				js_obj = $.parseJSON(resp.body);
				
				
				console.log(js_obj.providers[27].locationName);
				
				for(i=0; i<js_obj.providers.length; i++) {
					var provider = js_obj.providers[i];
					var latLng = new google.maps.LatLng(provider.latitude, provider.longitude);
					var title = provider.locationName;
					
					var images = "";
					var resourcesAvailable = "";

					if (provider.resType.indexOf("Water Pickup") != -1) {
						marker_img = "images/waterpickupicon.png";
						images += "<img src='" + marker_img + "' class='marker_popup_icons' alt='Water Pickup' />";
						resourcesAvailable += "Water Pickup, ";
					}
					if (provider.resType.indexOf("Recycle") != -1) {
						marker_img = "images/recycleicon.png";
						images += "<img src='" + marker_img + "' class='marker_popup_icons' alt='Recycling' />";
						resourcesAvailable += "Recycling, ";
					}
					if (provider.resType.indexOf("Blood Testing") != -1) {
						marker_img = "images/bloodtesticon.png";
						images += "<img src='" + marker_img + "' class='marker_popup_icons' alt='Blood Testing' />";
						resourcesAvailable += "Blood Testing, ";
					}
					if (provider.resType.indexOf("Water Filters") != -1) {
						marker_img = "images/waterfiltericon.png";
						images += "<img src='" + marker_img + "' class='marker_popup_icons' alt='Water Filters' />";
						resourcesAvailable += "Water Filters, ";
					}
					if (provider.resType.indexOf("Test Kits") != -1) {
						marker_img = "images/leadtesticon.png";
						images += "<img src='" + marker_img + "' class='marker_popup_icons' alt='Water Testing' />";
						resourcesAvailable += "Water Testing";
					}
					
					allMarkersString.push(images);
					
					var content = "<div id=\"provider_popup\"><h1>" + title + "</h1> <p id=\"provider_address\">" + provider.aidAddress + "</p>";
					
					if (provider.phone.length > 0)
						content += "<p id=\"provider_phone\">" + provider.phone + "</p>";
					
					if (provider.hours.length > 0)
						content += "<p id=\"provider_hours\">" + provider.hours + "</p>";
					
					if (provider.notes.length > 0)
						content += "<p id=\"provider_notes\">" + provider.notes + "</p>";
					
					//content += "<p>" + images + "</p></div>";
					content += "<p id=\"provider_resources\">" + resourcesAvailable + "</p>";
					content += "<div><a id=\"directions_btn\" class=\"btn btn-flat\">Get Directions</a></div></div>"

					var marker = new google.maps.Marker({
						position: latLng,
						title: title,
						map: null
					});
					
					/* Add tooltips to the popup images. */
					
					/* Store the markers in arrays for the add/remove functionality. */
					allMarkers.push(marker);
					
					bindInfoWindow(marker, map, infoWindow, content);

				}

				setMarkers();
			}
			
			// Uploading Pipe Data From JSON in bucket
			else if(object == "pipedata.json"){
				js_obj = $.parseJSON(resp.body);
				var tempArr;
				for(i=0; i<js_obj.pipedata.length; i++) {
					var pipe = js_obj.pipedata[i];
					var tempArray = new Array();
					var currentName = pipe.streetName;
					
					for(j=i; j<js_obj.pipedata.length; j++){
						var newPipe = js_obj.pipedata[j];
						if(newPipe.streetName == currentName){
							// Make the 3rd deminsion Array
							var lngLat = new Array();
							lngLat[0] = parseFloat(newPipe.lat);
							lngLat[1] = parseFloat(newPipe.lng);
							tempArray.push(lngLat);	//Add it to temp arr
						}
						else if(newPipe.streetName == "endOfFile")
						{
							masterPipeArray.push(tempArray);
						}
						else{
							masterPipeArray.push(tempArray);	
							i = j - 1;	
							j = js_obj.pipedata.length;	
						}
					}
				}
				var pipeObject = new Object();
				var pipeLine = new Array();
				for(var i = 0; i <= masterPipeArray.length; i++)
				{
					for(var k = 0; k < masterPipeArray[i].length; k++){
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

function setUpInitialMap(){
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
		if(pipeToggle == 1) {
			$("#construction_btn").addClass("active");
		}
}

function bindInfoWindow(marker, map, infowindow, html){
	marker.addListener("click", function(){
		infowindow.setContent(html);
		infowindow.open(map, this);
	});
}

function unsaveLocation(locationInput) {
		localStorage.setItem("saved_locations_count", Number(localStorage.saved_locations_count) - 1);

		if (localStorage.saved_location1 == locationInput) {
			localStorage.removeItem("saved_location1");
		}
		else if (localStorage.saved_location2 == locationInput) {
			localStorage.removeItem("saved_location2");
		}
		else if (localStorage.saved_location3 == locationInput) {
			localStorage.removeItem("saved_location3");
		}
}

function displaySavedLocations() {
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
	}
}

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
	$("#heatmap_btn").on('click', function() {	
		if (resourceActiveArray[0] == 1 && $("#heatmap_btn").hasClass("active")) {
			resourceActiveArray[0] = 0;
		}
		else {
			resourceActiveArray[0] = 1;
		}
		setMarkers();
	});
	
	$("#risk_factor_btn").on('click', function() {		
		if (riskmap.getMap() != null) {
			riskmap.setMap(null);
		}
		else {
			riskmap.setMap(map);
		}
	});
	
	
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

	$("#pipes_btn").on('click', function(){
		if (pipeToggle == 1) {
			pipeToggle = 0;
		}
		else {
			pipeToggle = 1;
		}
		setMarkers();
	});

	$(document).on("click", "#provider_popup #directions_btn", function(){
		term = $("#provider_address").text();
        window.open('http://maps.google.com/?q='+term,'_blank');
	});

	/* When a saved location is clicked, put the location in search bar and search. */
	$(document).on('click', '.saved-location', function() {
		$('#search_input').val($(this).text());
		$('#search_button').click();
	});

	//closes the location card and removes the marker
	$(document).on('click', '#location_card .card-inner button', function() {
		location_marker[0].setMap(null);
		$("#location_card").css("display", "none");
		$("#search_input").val('');
		displaySavedLocations();
	});

	$(document).on('click', '#saved_locations .close', function() {
		var addressToUnsave = $(this).parent().children('.saved-location').children('span').text();
		$(this).parent().css('display', 'none');
		unsaveLocation(addressToUnsave);
		//todo if no locations saved get rid of card
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
	if(resourceActiveArray[0] == 1 && leadLayer.getMap() != map) {
			leadLayer.setMap(map);
	}
	else if (resourceActiveArray[0] == 0 && leadLayer.getMap() == map) {
		leadLayer.setMap(null);
		if(predictiveLayer.getMap() == map)
			predictiveLayer.setMap(null);
	}
	else if (resourceActiveArray[0] == 1 && leadLayer.getMap() == map){
		//console.log("heatmap is set and will stay set");
	}
	else {
		//console.log("heatmap is not set and will stay not set");
		leadLayer.setMap(null);
	}
	
	console.log(allMarkers.length);
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
	}
	if (pipeToggle == 1) {
		constructionMarker.setMap(map);
		for(var i = 0; i < arrayOfLines.length; i++)
		{
			arrayOfLines[i].setMap(map);
		}
		
		waterplantMarker.setMap(map);
	}
	else {
		constructionMarker.setMap(null);
		waterplantMarker.setMap(null);
		for(var i = 0; i < arrayOfLines.length; i++)
		{
			arrayOfLines[i].setMap(null);
		}
	}
}