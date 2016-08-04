google.load("feeds", "1");
google.setOnLoadCallback(onStartup);
/* Google Service Account info */
var clientId = "807599170352-afiu7fosjp2hg4n6gs3ghc99momgfica.apps.googleusercontent.com";
// Access Google Cloud Storage
var default_bucket = "h2o-flint.appspot.com";
var scope = "https://www.googleapis.com/auth/devstorage.read_only";

function onStartup() {
	var oReq = new XMLHttpRequest(); //New request object
	oReq.open("get", "alertDataAccess.php", true); //Access my PHP file for query
	oReq.send();   //Send request
	var jsonFeed;
    var i = 0;
    var html = '';
	oReq.onload = function() {
		gapi.client.load('storage', 'v1').then(function() {
		var responseText = gapi.client.storage.objects.get({
			'bucket': default_bucket,
			'object': object,
			'alt': 'media'
		});
		//This is where you handle what to do with the response from the SQL query.
		//The actual data is found on this.responseText
		console.log(this.responseText);
		jsonFeed = $.parseJSON(this.responseText); 
	   while(i < jsonFeed.length - 1) {			//output all of the alerts found for a given query (currently all alerts in database) HTML
		   i += 1;
		   html += '<div class="card">';
		   html += '<aside class="card-side pull-left">'
		   			+ '<img src="../images/ic_report.png" /> </aside>';
		   html += '<div class="card-main">'
					+'<li> '+ jsonFeed[i].alertType.toString() +'</li>'
					+'<div>'+ jsonFeed[i].description.toString()+'</div>'
					+'<div>' + jsonFeed[i].alertDate.toString() + '</div></div>';
		   html += '</div>';
	   }
	   $("#alerts").html(html);
	});
	}
}