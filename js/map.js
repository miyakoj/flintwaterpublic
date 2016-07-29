/* Google Service Account info */
var clientId = "322504400471-ou3nftefgmhpnbj4v3nv08b16nepdngg.apps.googleusercontent.com";
var apiKey = "AIzaSyA0qZMLnj11C0CFSo-xo6LwqsNB_hKwRbM";

// Access Google Cloud Storage
var default_bucket = "h2o-flint.appspot.com";
var scope = "https://www.googleapis.com/auth/devstorage.read_only";

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var map;
var infoWindow;
var heatmap;
var leadLayer; //fusion table layer to set up lead levels
var leadLayerBirdView_markers = [];
var leadLayerBirdView_info;
var predictiveLayer; //fusion table layer to show predicted lead levels
var leadAndPredictiveLayer; //fusion table layer to show both lead and predicted layer
var heatmapData;

var $location_buttons;

var savedMarkers = [];
var allMarkers = [];
var allMarkersString = [];
var resourceActiveArray = [1, 0, 0, 0, 0, 0, 0, 0];  //lead levels, water pickup, recycle, filter, lead, blood, construction, prediction
var location_marker = [];
var marker_img;
var savedLocationTotal;

//resource marker that is clicked or last clicked
var resource_marker;

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
var savedResourceIcon;
var savedLocationIcon;

var leadLevelOfInput;

/* Size the map popup icons based on whether the device is mobile or not. */
var iconSize;

//localStorage.clear();
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
	$("#resource_card").hide();
	
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
		
		$("#map").css({
			"height": function() {
				window.innerHeight - $("header").outerHeight() - $("#toggles .list").outerHeight();
			}
		});
	});

	google.maps.event
	
	infoWindow = new google.maps.InfoWindow();

	//callStorageAPI("leadlevels.json");
	callStorageAPI("providers.json");
	callStorageAPI("pipedata.json");
	callStorageAPI("leadLevels_birdview.json");
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
	savedResourceIcon = {
		url: 'images/savedresource.png',
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0,0),
		size: new google.maps.Size(64,64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	savedLocationIcon = {
		url: 'images/savedlocation.png',
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0,0),
		size: new google.maps.Size(64,64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	
	greenIcon = {
		url: 'images/green.png',
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0,0),
		size: new google.maps.Size(64,64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	yellowIcon = {
		url: 'images/yellow.png',
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0,0),
		size: new google.maps.Size(64,64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	redIcon = {
		url: 'images/red.png',
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0,0),
		size: new google.maps.Size(64,64),
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

	//If map is clicked hide resource card
	 map.addListener('click', function() {
    	$("#resource_card").hide();
  	});

	 map.addListener('zoom_changed', function() {
	 	var zoomLvl = map.getZoom();
	 	if(resourceActiveArray[0] == 1 && zoomLvl < 16) {
			leadAndPredictiveLayer.setMap(null);
			for(var i = 0; i < leadLayerBirdView_markers.length; i++){
				leadLayerBirdView_markers[i].setMap(map);
			}
		}
		else if (resourceActiveArray[0] == 1 && zoomLvl >= 16) {
			leadAndPredictiveLayer.setMap(map);
			for(var i = 0; i < leadLayerBirdView_markers.length; i++){
				leadLayerBirdView_markers[i].setMap(null);
			}
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
	  if (location_marker.length > 0){
	  		location_marker[0].setMap(map);
	  		location_marker = [];
	  }
	  // Create a marker for the place.
	  location_marker.push(new google.maps.Marker({
		position: place.geometry.location,
		map: map,
		title: place.name,
		icon: marker_icon,
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
		
	  	var inputAddress = place.formatted_address.split(',');
	  	var streetAddress = inputAddress[0].toUpperCase();
	  	var leadMeter;
		var leadPrediction;
		var leadMsg = "OK to use filtered water, except children under 6 and pregnant women.";	


	  	for(var i=0; i < heatmapData.length; i++) {
	  		var tempAddr = heatmapData[i].address.valueOf();
	  		if(tempAddr === streetAddress) {
	  			leadMeter = heatmapData[i].lead + " ppb";
	  			leadLevelOfInput = heatmapData[i].lead;
	  			break;
	  		}
	  		else{
				 leadMeter = "No Reported Reading";
				 leadLevelOfInput = -1;
	  		}
	  	}

	  	if(leadLevelOfInput >= 0 && leadLevelOfInput < 15){
	  		leadPrediction = "Predicted low lead levels";
	  	}
	  	else if(leadLevelOfInput >= 15 && leadLevelOfInput < 150){
	  		leadPrediction = "Predicted medium lead levels";
	  	}
	  	else if(leadLevelOfInput >= 150){
	  		leadPrediction = "Predicted high lead levels";
	  		leadMsg = "Not safe to drink even if filtered."
	  	}

		/* Display appropriate lead rating and message. */
		$("#location_card .card-inner").html("<button type=\"button\" class=\"close\" >&times;</button> <h6>" + leadPrediction + "</h6> <p>" + leadMeter + "</p> <p>" + leadMsg + "</p>");
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
		

	    if (map.getZoom() < 14){
			map.setZoom(25);
		}
		else {
			map.setZoom(20);
		}

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
						if (localStorage.saved_locations_count < 100)
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
					
					var temp = location_marker;
					savedMarkers.push(temp)
					console.log(savedMarkers);
					
				}
				else { // remove location
					var searched_location = $("#search_input").val();
					savedLocationTotal = localStorage.getItem("saved_locations_count");
					localStorage.setItem("saved_locations_count", Number(localStorage.saved_locations_count) - 1);
				
					$("#saved_location_button span").text(save_location_msg);
				    for(var i=0; i < savedLocationTotal; i++){
						if (localStorage.getItem(["saved_location" + Number(localStorage.saved_locations_count)]) == searched_location){
							localStorage.removeItem("saved_location" + Number(localStorage.saved_locations_count));
						    savedMarkers.splice(i,1);
						}
					}
					marker_img = "images/locationicon.png";
					card_marker_img = "images/savedlocation.png";
				}
				
				location_marker[0].setIcon(marker_img);
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
				iconName: "small_yellow"
			}
		}, {
			where: '\'leadlevel\' >= 50 ',
			markerOptions: {
				iconName: "small_red"
			}
		}, {
			where: '\'leadlevel\' >= 0 AND \'leadlevel\' < 15',
			markerOptions: {
				iconName: "small_green"
			}
		}]
	  });

	addFusionListener(leadAndPredictiveLayer);
}

function addFusionListener(object) {
		google.maps.event.addListener(object, 'click', function(e) {
			var html = "<div>";
			e.infoWindow
			html += "<b>Address: </b>" + e.row['Address'].value + "<br>";
			if(e.row['leadlevel'].value != "")
				html += "<b>Lead Level: </b>" + e.row['leadlevel'].value + "<br>";
			else
				html += "<b>Predicted Risk: </b>" + e.row['Prediction'].value + "<br>";
			if(e.row['testDate'].value != "")
				html += "<b>Last Tested: </b>" + e.row['testDate'].value;
			html += "</div>";
			$("#location_card .card-inner").empty();
	   		$("#location_card .card-action").hide();
	   		$("#location_card .card-inner").append(html);
	   		$("#location_card").show();

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
				
				for(i=0; i<js_obj.leadLevels.length; i++) {
					var info = js_obj.leadLevels[i];
					//var weightValue = assignWeight(info.lead_ppb);
					heatmapData.push({lat: info.latitude, lng: info.longitude, lead: info.leadlevel, date: info.dateUpdated, address: info.StAddress});
				}
			}
			/* Provider Data */
			else if (object == "providers.json") {
				js_obj = $.parseJSON(resp.body);
				
				for(i=0; i<js_obj.providers.length; i++) {
					var provider = js_obj.providers[i];
					var latLng = new google.maps.LatLng(provider.latitude, provider.longitude);
					var title = provider.locationName;
					var isSaved = false;
					if(checkIfSaved(title)){
						isSaved = true;
						
					}
					var icon;
					var images = "";
					var resourcesAvailable = "";
					
					if (provider.resType.indexOf("Water Pickup") != -1) {
						marker_img = "images/waterpickupicon.png";
						images += "<img src='" + marker_img + "' class='marker_popup_icons' alt='Water Pickup' />";
						resourcesAvailable += "Water Pickup, ";
						if(icon == null)
							icon = waterpickupIcon;
					}
					if (provider.resType.indexOf("Recycle") != -1) {
						marker_img = "images/recycleicon.png";
						images += "<img src='" + marker_img + "' class='marker_popup_icons' alt='Recycling' />";
						resourcesAvailable += "Recycling, ";
						if(icon == null)
							icon = recycleIcon;
					}
					if (provider.resType.indexOf("Blood Testing") != -1) {
						marker_img = "images/bloodtesticon.png";
						images += "<img src='" + marker_img + "' class='marker_popup_icons' alt='Blood Testing' />";
						resourcesAvailable += "Blood Testing, ";
						if(icon == null)
							icon = bloodIcon;
					}
					if (provider.resType.indexOf("Water Filters") != -1) {
						marker_img = "images/waterfiltericon.png";
						images += "<img src='" + marker_img + "' class='marker_popup_icons' alt='Water Filters' />";
						resourcesAvailable += "Water Filters, ";
						if(icon == null)
							icon = filterIcon
					}
					if (provider.resType.indexOf("Test Kits") != -1) {
						marker_img = "images/leadtesticon.png";
						images += "<img src='" + marker_img + "' class='marker_popup_icons' alt='Water Testing' />";
						resourcesAvailable += "Water Testing";
						if(icon == null)
							icon = leadTestIcon;
					}
					
					allMarkersString.push(images);
					
					var content = "<p><b>" + title + "</b> <br /> " + provider.aidAddress + "</p>";
					
					if (provider.phone.length > 0)
						content += "<p>" + provider.phone + "<br />";
					
					if (provider.hours.length > 0)
						content += provider.hours + "<br />";
					
					if (provider.notes.length > 0)
						content += provider.notes + "</p>";
					
					//content += "<p>" + images + "</p></div>";
					content += "<p id=\"provider_resources\">" + resourcesAvailable + "</p>";

					/*If the resource is saved, display on map always if not then do not display*/
					if(isSaved)
						isDisplayMap = map;
					else
						isDisplayMap = null;
					
					if(!isSaved){
						var marker = new google.maps.Marker({
							position: latLng,
							title: title,
							map: isDisplayMap,
							icon: icon
						});
					}
					else {
						var marker = new google.maps.Marker({
							position: latLng,
							title: title,
							map: isDisplayMap,
							icon: savedResourceIcon
						});
					}
				
					/* Add tooltips to the popup images. */
					
					/* Store the markers in arrays for the add/remove functionality. 
						if saved, put in savedMarkers if not put in allMarkers*/
					if(isSaved){						
						savedMarkers.push(marker);
					}
					else
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
			else if (object == "leadLevels_birdview.json") {
				js_obj = $.parseJSON(resp.body);
				
				leadLayerBirdView_markers = [];
				for(var i=0; i<js_obj.area.length; i++) {
					var temp = js_obj.area[i];
					var latLng = new google.maps.LatLng(temp.latitude, temp.longitude);
					var numOfTests = temp.numOfTests;
					var numOfDangerous = temp.numOfDangerous;
					var icon;

					if(numOfDangerous < 10) {
						icon = greenIcon;
					}
					else if (numOfDangerous < 15) {
						icon = yellowIcon;
					}
					else {
						icon = redIcon;
					}

					var birdMarker = new google.maps.Marker({
						position: latLng,
						icon: icon,
						map: map
					});

					leadLayerBirdView_markers.push(birdMarker);

					var display_html = "";
					display_html += "<div>";
					display_html += "<h5><b>About this area</b></h5>";
					display_html += "<p>There were <b>" + numOfTests + "</b> tests in this area. </p>";
					display_html += "<p>Of these tests, <b>" + numOfDangerous + "</b> tests had dangerous lead levels. </p>"
					display_html += "<p><small>Zoom in see more details</small></p>"
					display_html += "</div>";

					attachLocationCard(birdMarker, map, display_html);

				}
			}
				
		}, function(reason) {
			console.log('Error: ' + reason.result.error.message);
		});
	});
}

function setUpInitialMap(){
		if (localStorage !== "undefined") {
     		var retrieveArray = localStorage.getItem("resource_array");
       		resourceActiveArray = JSON.parse(retrieveArray);


     		var temp = [1,0,0,0,0,0,0,0];
			localStorage.setItem("resource_array", JSON.stringify(temp));
     	}
    	else {
      		resourceActiveArray = [0,0,0,0,0,0,0,0];
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
		if(resourceActiveArray[6] == 1) {
			$("#construction_btn").addClass("active");
		}
		if(resourceActiveArray[7] == 1) {
			$("#risk_factor_btn").addClass("active");
		}

		setMarkers();
}

function attachLocationCard(marker, map, html){
	marker.addListener("click", function() {
	   map.panTo(marker.getPosition());
	   $("#location_card .card-inner").empty();
	   $("#location_card .card-action").hide();
	   $("#location_card .card-inner").append(html);
	   $("#location_card").show();
	   location_marker = marker;
	});
	
}

//needed a function to be able to change if it's saved or not
function bindInfoWindow(marker, map, infowindow, html){
	marker.addListener("click", function(){
		//infowindow.setContent(html);
		//infowindow.open(map, this);
		isSaved = checkIfSaved(marker.getTitle());
		map.panTo(marker.getPosition());
		$("#resource_card .card-inner").empty();
		$("#resource_card .card-inner").append(html);
		$("#resource_card").show();
		if(isSaved){
			$("#resource_card .resource-card-save img").attr("src", "../images/ic_star.png");
		}
		else{
			$("#resource_card .resource-card-save img").attr("src", "../images/ic_star_border.png");
		}
		resource_marker = marker;

	});
}

function unsaveLocation(locationInput) {
		localStorage.setItem("saved_locations_count", Number(localStorage.saved_locations_count) - 1);
		savedLocationTotal = localStorage.getItem("saved_locations_count");
		for(var i=0; i < savedLocationTotal;i++) {
			if(locationStorage.getItem(["saved_location" + Number(localStorage.saved_locations_count)]) == locationInput)
				localStorage.removeItem("saved_location"+i);
		}
		
	/*	if (localStorage.saved_location1 == locationInput) {
			localStorage.removeItem("saved_location1");
		}
		else if (localStorage.saved_location2 == locationInput) {
			localStorage.removeItem("saved_location2");
		}
		else if (localStorage.saved_location3 == locationInput) {
			localStorage.removeItem("saved_location3");
		}*/
}

function displaySavedLocations() {
	$("#location_card").css({
		"width": function() {
			return $("#search_input").outerWidth() + parseInt($("#search_button").outerWidth());
		},
		"bottom": function() {
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
		//for(var i=0; i < ;i++)
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
	
	$("#search_input").css("display", "block"); // display the search box after the page has loaded
	
	//localStorage.clear();
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
		if (resourceActiveArray[7] == 1 && $("#risk_factor_btn").hasClass("active")) {
			resourceActiveArray[7] = 0;
		}
		else {
			resourceActiveArray[7] = 1;
		}
		setMarkers();
	});
	

	$("#water_pickup_btn").on('click', function(){
		if (resourceActiveArray[1] == 1) {
			resourceActiveArray[1] = 0;
		}
		else {
			resourceActiveArray[1] = 1;
		}
		if (map.getZoom() > 15){
			map.setZoom(15);
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
		if (map.getZoom() > 15){
			map.setZoom(15);
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
		if (map.getZoom() > 15){
			map.setZoom(15);
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
		if (map.getZoom() > 14){
			map.setZoom(14);
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
		if (map.getZoom() > 15){
			map.setZoom(15);
		}
		setMarkers();
	});

	$("#pipes_btn").on('click', function(){
		if (resourceActiveArray[6] == 1) {
			resourceActiveArray[6] = 0;
		}
		else {
			resourceActiveArray[6] = 1;
		}
		if (map.getZoom() > 15){
			map.setZoom(15);
		}
		setMarkers();
	});

	//gives directions to a resource location when get dircetions is clicked
	$(document).on("click", "#resource_card .resource-card-directions", function(){
		resource_directions = resource_marker.getPosition();
        window.open('http://maps.google.com/?q='+resource_directions,'_blank');
	});

	//saves resource location when save button is clicked on #resource_card
	$(document).on("click", "#resource_card .resource-card-save", function(){
		//todo save resource_marker
		var locationTitle = resource_marker.getTitle();
		var isSaved = checkIfSaved(locationTitle);
		if(isSaved){
			//remove from saved
			removeFromSaved(locationTitle);
			//change picture on card to star outline
			$("#resource_card .resource-card-save img").attr("src", "../images/ic_star_border.png");
			//remove from savedMarkers 
			for(var i = 0; i < savedMarkers.length; i++){
				if(savedMarkers[i].getTitle() == locationTitle)
					savedMarkers.splice(i,1);
			}
			//add to all markers and reset map
			var temp = resource_marker;
			allMarkers.push(temp);
			setMarkers();
		}
		else{
			saveLocation(locationTitle);
			//todo change picture on card to filled star
			$("#resource_card .resource-card-save img").attr("src", "../images/ic_star.png");
			//remove from allMarkers 
			for(var i = 0; i < allMarkers.length; i++){
				if(allMarkers[i].getTitle() == locationTitle){
					allMarkers.splice(i,1);
				}	
			var temp = resource_marker;
			savedMarkers.push(temp);
			}
		}
	});

	//sends problem reported to db when report issue is selected from #resource_card
	$("#resource_card .dropdown-menu li").on("click", function() {
		//todo get rid of extra spaces at begining of $(this).text()
		//todo submit to db the issue selected and resource_marker or 
	});

	
	/* When a saved location is clicked, put the location in search bar and search. */
	$(document).on('click', '.saved-location', function() {
		$('#search_input').val($(this).text());
		//$('#search_button').click();

		var input = $(this).text();

		google.maps.event.trigger(input, 'focus');
		
		google.maps.event.trigger(input, 'keydown', function() {
			keyCode: 13
		});
			
		updateSaveButtons();
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
});

/* Set markers on the map based on type. */
function setMarkers() {
	var zoomLvl = map.getZoom();
	if(resourceActiveArray[0] == 1 && zoomLvl < 16) {
		leadAndPredictiveLayer.setMap(null);
		for(var i = 0; i < leadLayerBirdView_markers.length; i++){
			leadLayerBirdView_markers[i].setMap(map);
		}
	}
	else if (resourceActiveArray[0] == 1 && zoomLvl >= 16) {
		leadAndPredictiveLayer.setMap(map);
		for(var i = 0; i < leadLayerBirdView_markers.length; i++){
			leadLayerBirdView_markers[i].setMap(null);
		}
	}
	else if (resourceActiveArray[0] == 0) {
		leadAndPredictiveLayer.setMap(null);
		for(var i = 0; i < leadLayerBirdView_markers.length; i++){
			leadLayerBirdView_markers[i].setMap(null);
		}
	}
	else {

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
	}
	if (resourceActiveArray[6] == 1) {
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

function checkIfSaved(obj) {

		var tempNumberSaved = parseInt(localStorage["numberSaved"]);
		var returnVal = false;
		for(var i=0; i <= tempNumberSaved; i++){
			if(localStorage.getItem(["savedLocation"+i]) == obj.substring(0)){
				returnVal = true;
			}
		}
		return returnVal;
}

function removeFromSaved(obj) {
		var tempNumberSaved = parseInt(localStorage["numberSaved"]);
		for(var i=0; i <= tempNumberSaved; i++){
			if(localStorage.getItem(["savedLocation"+i]) == obj.substring(0)){
				localStorage.removeItem(["savedLocation"+i]);
				tempNumberSaved--;
				if(tempNumberSaved == -1) {
					localStorage["numberSaved"] = 0;
				}	
				else
					localStorage["numberSaved"] = tempNumberSaved;
			}
		}
}

function saveLocation(obj) {
		var tempNumberSaved = localStorage["numberSaved"];
		if(tempNumberSaved == null) {
			tempNumberSaved = 0;
		}
		else {
			tempNumberSaved = parseInt(tempNumberSaved);
			tempNumberSaved++;
		}
		localStorage["numberSaved"] = tempNumberSaved;
		localStorage["savedLocation"+tempNumberSaved] = resource_marker.getTitle();
		console.log(localStorage["savedLocation"+tempNumberSaved]);
		console.log(localStorage);
}

