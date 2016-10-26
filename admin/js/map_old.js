 /* Google Service Account info */
var clientId = "322504400471-ou3nftefgmhpnbj4v3nv08b16nepdngg.apps.googleusercontent.com";
var apiKey = "AIzaSyA0qZMLnj11C0CFSo-xo6LwqsNB_hKwRbM";

// Access Google Cloud Storage
var defaultBucket = "h2o-flint.appspot.com";
var scopes = "https:// www.googleapis.com/auth/devstorage.read_only https://www.googleapis.com/auth/fusiontables.readonly";
  
var width = window.innerWidth;
var height = window.innerHeight;
var $pageId = $("body").attr("id").slice(0, $("body").attr("id").indexOf("_"));

var map;
var adminResourceActiveArray = [0, 0, 0, 0, 0, 0, 0, 0];  // lead levels, water pickup, recycle, filter, lead, blood, construction, prediction
var clickedMarker;
var leadLayerBirdViewMarkers = [];
var constructionMarkers = [];

// icons
var constructionIcon;
var iconSize = 30;

/* Circles for lead data. */
var lowRiskCircle = "../images/lowrisklevel.png";
var medRiskCircle = "../images/medrisklevel.png";
var highRiskCircle = "../images/highrisklevel.png";
  
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
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 43.021, lng: -83.681},
	  zoom: 13
	});

	/* Centering and resizing */
	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);
	});
	
	constructionIcon = {
		url: '../images/construction_icon.png',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 0),
		size: new google.maps.Size(64, 64),
		scaledSize: new google.maps.Size(iconSize, iconSize)
	};
	
	callStorageAPI("leadLevels_birdview.json");
	callStorageAPI("construction_sites.json");
	
	map.addListener('zoom_changed', function() {
	 	var zoomLvl = map.getZoom();
	 	if (resourceActiveArray[0] == 1 && zoomLvl < 16 && typeof(leadLayerBirdViewMarkers) !== "undefined") {
			for (var i = 0; i < leadLayerBirdViewMarkers.length; i++)
				leadLayerBirdViewMarkers[i].setMap(map);
		}
		else if (resourceActiveArray[0] == 1 && zoomLvl >= 16 && typeof(leadLayerBirdViewMarkers) !== "undefined") {
			for (var i = 0; i < leadLayerBirdViewMarkers.length; i++)
				leadLayerBirdViewMarkers[i].setMap(null);
		}
	});
};

function weirdnessEquation(N, K) {
	var sqrt = Math.sqrt(N);
	var weirdness = (K/sqrt) - (sqrt*.084);
	return weirdness;
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
						color = "#FFFF99";
						warningImg = lowRiskCircle;
					}
					else if (weirdnessLevel < .6) {
						color = "#CC9866";
						warningImg = medRiskCircle;
					}
					else {
						color = "#FF6565";
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
					
					attachLocationCard("leadArea", leadLevelAreaSquare, "", content);
					
					$("#location_card .card-action").hide();
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
					
					constructionMarkers.push(constructionMarker);
				}
				
			}
		});
	});
}

/* */
function createLocationCardContent(type, content) {
	$("#location_card .card-inner").empty().html(content);
		
	if (type.search(/location/i) != -1) {
		$("#location_card .card-inner").append("<p id='211_info'>Call the <a href='http://www.centralmichigan211.org' target='_blank'>211 service</a> for questions and help.</p> <hr /> <div id='location_questions'><h5>Is this your location?</h5> <p>Providing more information can help with diagnosing issues and providing water resources.</p> <a href='page.php?pid=report&address=" + $("#address").text().replace(/\s/g, "+") + "'>Report a water issue</a></div>");
	}
}

/* Insert the data into the location card and show it when the marker is clicked. */
function attachLocationCard(type, marker, address, content) {
	marker.addListener("click", function() {		
		clickedMarker = marker;
		
		createLocationCardContent(type, content);
		
		$("#map").append($("#location_card"));
		
		$("#location_card").show();
	});
}

function bindInfoWindow(marker, map, infowindow, html) {
	marker.addListener("click", function(){
		infowindow.setContent(html);
		infowindow.open(map, this);
	});
}

/* Set markers on the map based on type. */
function setMarkers() {
	var zoomLvl = map.getZoom();
	
}

$(document).ready(function() {
	localStorage.clear();
	console.log(localStorage);
	
	var retrieveArray = localStorage.getItem("admin_resource_array");
	
	if ((localStorage !== "undefined") && (retrieveArray != null)) {
		adminResourceActiveArray = JSON.parse(retrieveArray);
		localStorage.setItem("admin_resource_array", JSON.stringify(adminResourceActiveArray));
		localStorage.setItem("saved_admin_resource_array", JSON.stringify(adminResourceActiveArray));
	}
	else {
		localStorage.setItem("admin_resource_array", JSON.stringify(adminResourceActiveArray));
	}

	if (typeof(Storage) !== "undefined") {
		$("#area_layer").on("click", function() {
			if (adminResourceActiveArray[0] == 1) {
				adminResourceActiveArray[0] = 0;
				$("#area_layer").removeClass("active");
				
				for (var i = 0; i < leadLayerBirdViewMarkers.length; i++)
					leadLayerBirdViewMarkers[i].setMap(null);
				
				$("#location_card").hide();
			}
			else {
				adminResourceActiveArray[0] = 1;
				$("#area_layer").addClass("active");
				
				for (var i = 0; i < leadLayerBirdViewMarkers.length; i++)
					leadLayerBirdViewMarkers[i].setMap(map);
			}
			
			localStorage.setItem("admin_resource_array", JSON.stringify(adminResourceActiveArray));
			//setMarkers();
		});
		
		$("#construction_layer").on("click", function() {			
			if (adminResourceActiveArray[6] == 1) {
				adminResourceActiveArray[6] = 0;
				$("#construction_layer").removeClass("active");
				
				for (var i=0; i<constructionMarkers.length; i++)
					constructionMarkers[i].setMap(null);
			}
			else {
				adminResourceActiveArray[6] = 1;
				$("#construction_layer").addClass("active");
				
				for (var i=0; i<constructionMarkers.length; i++)
					constructionMarkers[i].setMap(map);
			}
			
			if (map.getZoom() > 15)
				map.setZoom(15);
			
			localStorage.setItem("admin_resource_array", JSON.stringify(adminResourceActiveArray));
			//setMarkers();
		});
		
		/* Initialize buttons. */
		if (adminResourceActiveArray[0] == 1)
			$("#area_layer").addClass("active");
		else
			$("#area_layer").removeClass("active");
		
		if (adminResourceActiveArray[6] == 1)
			$("#construction_layer").addClass("active");
		else
			$("#construction_layer").removeClass("active");
	}
	
	$("#location_card .close").on("click", function() {
		$(this).parent().hide();
	});
});