/* Google Service Account info */
var clientId = '807599170352-afiu7fosjp2hg4n6gs3ghc99momgfica.apps.googleusercontent.com';
var apiKey = "AIzaSyAr4wgD-8jV8G7gv600mD75Ht1eS3B4siI";

// Access Google Cloud Storage
var default_bucket = "flint-water-project.appspot.com";
var scope = "https://www.googleapis.com/auth/devstorage.read_only";

var map;
var infoWindow;
var heatmap;

var allMarkers = [];
var allMarkersString = [];
var resourceActiveArray = [0, 0, 0, 0, 0, 0];

//for construction
var constructionMarker ;
var constructionToggle = 0;
var pipePolyLine;

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
	//callStorageAPI("construction.json");

	allMarkers.forEach(function(marker) {
		marker.setMap(null);
	});
	
	//Construction Junk
	var constructionLatLng = {lat:43.019368, lng:-83.668522 };
	var constructionTitle = "Construction Zone";
	var constructionImage = "images/constructionicon.png";
	constructionMarker  = new google.maps.Marker({
		position: constructionLatLng,
		map: map,
		title: constructionTitle,
		icon: constructionImage
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
	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});

	var markers = [];
	
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		// Clear out the old markers.
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		
		markers = [];

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

		// Create a marker for each place.
		markers.push(new google.maps.Marker({
		  map: map,
		  icon: icon,
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
	});
	
	// Trigger search on button click
    $("#search_button").click(function () {
		if(activeSearch){
			var input = document.getElementById('pac-input');

			google.maps.event.trigger(input, 'focus');
			google.maps.event.trigger(input, 'keydown', {
				keyCode: 13
			});
		}
    });
	
	// Save a location to HTML5 local storage
    $("#save_button").click(function() {
		if ($("#pac-input").val() != "") {
			if (typeof(Storage) !== "undefined") {
				if (localStorage.saved_locations_count) {
					if (localStorage.saved_locations_count < 3)
						localStorage.saved_locations_count = Number(localStorage.saved_locations_count) + 1;
					else
						console.log("There are no free saved locations.");
				}
				else
					localStorage.saved_locations_count = 1;
				
				localStorage.setItem("saved_location" + Number(localStorage.saved_locations_count), $("#pac-input").val());
				
				//<li>[saved locations]</li> #saved_locations
			}
			else {
				console.log("There is no local storage support.");
				
				for (var i=1; i<=localStorage.saved_locations_count; i++)
					localStorage.removeItem("saved_location" + i);
			}
		}
		else
			console.log("The search input is empty.");
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
				
				for(i=0; i<js_obj.leadLevels.length; i++) {
					var info = js_obj.leadLevels[i];
					var weightValue = assignWeight(info.leadLevel);
					heatmapData.push({location: new google.maps.LatLng(info.latitude, info.longitude), weight: weightValue});
				}
				
				function assignWeight(levelIn){
					if (levelIn < 5){
						return 0;
					}
					else if (levelIn < 14){
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

				heatmap.setMap(map);
			}
			/* Provider Data */
			else if (object == "providers.json") {
				js_obj = $.parseJSON(resp.body);
				
				for(i=0; i<js_obj.providers.length; i++) {
					var provider = js_obj.providers[i];
					var latLng = new google.maps.LatLng(provider.lat, provider.long);
					var title = provider.title;
					
					var images = "";
					
					if (provider.hasWater === "true") {			
						var image = "images/waterpickupicon.png";
						images += "<img src='" + image + "' /> ";
					}
					if (provider.hasRecycle === "true") {
						var image = "images/recycleicon.png";
						images += "<img src='" + image + "' /> ";
					}
					if (provider.hasBloodTesting === "true") {
						var image = "images/bloodtesticon.png";
						images += "<img src='" + image + "' /> ";
					}
					if (provider.hasFilters === "true") {
						var image = "images/waterfiltericon.png";
						images += "<img src='" + image + "' /> ";
					}
					if (provider.hasWaterTestKits === "true") {
						var image = "images/leadtesticon.png";
						images += "<img src='" + image + "' /> ";
					}
					
					allMarkersString.push(images);
					var content = "<h1>" + provider.title + "</h1><p>" + provider.details + "</p><p>" + images + "</p>";
								
					var marker = new google.maps.Marker({
						position: latLng,
						title: title,
						map: map,
						icon: image
					});
					
					/* Store the markers in arrays for the add/remove functionality. */
					allMarkers.push(marker);
					
					bindInfoWindow(marker, map, infoWindow, content);
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

function bindInfoWindow(marker, map, infowindow, html){
	marker.addListener("click", function(){
		infowindow.setContent(html);
		infowindow.open(map, this);
	});
}

$(document).ready(function() {
	$(".alert-warning").css("display", "none"); // hide the alert box by default
	
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
	
	$("[name='heatmap']").on('click', function() {		
		if (heatmap.getMap() != null) {
			heatmap.setMap(null);
		}
		else {
			heatmap.setMap(map);
		}
	})

	$("[name='water_pickup']").on('click', function(){
		if (resourceActiveArray[1] == 1) {
			resourceActiveArray[1] = 0;
		}
		else {
			resourceActiveArray[1] = 1;
		}
		setMarkers();
	})

	$("[name='recycling']").on('click', function(){
		if (resourceActiveArray[2] == 1) {
			resourceActiveArray[2] = 0;
		}
		else {
			resourceActiveArray[2] = 1;
		}
		setMarkers();
	})

	$("[name='water_testing']").on('click', function(){
		if (resourceActiveArray[4] == 1) {
			resourceActiveArray[4] = 0;
		}
		else {
			resourceActiveArray[4] = 1;
		}
		setMarkers();
	})

	$("[name='blood_testing']").on('click', function(){
		if (resourceActiveArray[5] == 1) {
			resourceActiveArray[5] = 0;
		}
		else {
			resourceActiveArray[5] = 1;
		}
		setMarkers();
	})

	$("[name='water_filters']").on('click', function(){
		if (resourceActiveArray[3] == 1) {
			resourceActiveArray[3] = 0;
		}
		else {
			resourceActiveArray[3] = 1;
		}
		setMarkers();
	})

	$("[name='construction']").on('click', function(){
		if (constructionToggle == 1) {
			constructionToggle = 0;
		}
		else {
			constructionToggle = 1;
		}
		setMarkers();
	})
		

	/* Set markers on the map based on type. */
	function setMarkers() {  
		for (var i = 0; i < allMarkers.length; i++){
			allMarkers[i].setMap(null);
			if(resourceActiveArray[5]==1 && allMarkersString[i].search("blood") >-1){
				allMarkers[i].setIcon("images/bloodtesticon.png");
				allMarkers[i].setMap(map);
			}
			else if(resourceActiveArray[4]==1 && allMarkersString[i].search("lead") >-1){
				allMarkers[i].setIcon("images/leadtesticon.png");
				allMarkers[i].setMap(map);
			}
			else if(resourceActiveArray[3]==1 && allMarkersString[i].search("filter") >-1){
				allMarkers[i].setIcon("images/waterfiltericon.png");
				allMarkers[i].setMap(map);
			}
			else if(resourceActiveArray[2]==1 && allMarkersString[i].search("recycle") > -1){
				allMarkers[i].setIcon("images/recycleicon.png");
				allMarkers[i].setMap(map);
			}
			else if(resourceActiveArray[1]==1 && allMarkersString[i].search("water") > -1){
				allMarkers[i].setIcon("images/waterpickupicon.png");
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

	
	$("#pac-input").keyup(function() {
		if($("#pac-input").val()) {
			$("#search_button").css("color", "#FFF");
			activeSearch = 1;
		}
		else {
			$("#search_button").css("color", "#61b1ff");
			activeSearch = 0;
		}
	});
});

