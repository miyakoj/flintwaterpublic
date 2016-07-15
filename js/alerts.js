google.load("feeds", "1");
google.setOnLoadCallback(onStartup);

function onStartup() {
	var oReq = new XMLHttpRequest(); //New request object
	oReq.open("get", "alertDataAccess.php", true); //Access my PHP file for query
	oReq.send();   //Send request
	var jsonFeed;
    var i = 0;
    var html = '';
	oReq.onload = function() {
		//This is where you handle what to do with the response from the SQL query.
		//The actual data is found on this.responseText
		jsonFeed = JSON.parse(this.responseText); 
	   while(i < jsonFeed.length - 1) {			//output all of the alerts found for a given query (currently all alerts in database) HTML
		   i += 1;
		   html += '<div class="card">';
		   html += '<aside class="card-side pull-left"> 
		   				+<img src="../images/ic_report.png"/> </aside>';
		   html += '<div class="card-main">'
						+'<li> '+ jsonFeed[i].alertType.toString() +'</li>'
						+'<div>'+ jsonFeed[i].description.toString()+'</div>'
						+'<div>' + jsonFeed[i].alertDate.toString() + '</div></div>';
		   html += '</div>';
	   }
	   $("#alerts").html(html);
	};

}

