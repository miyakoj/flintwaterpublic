/* Load alerts and news articles. */

google.setOnLoadCallback(onStartup);

var html;
var date_added;
var months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

function onStartup() {	
	if ($("body").attr("id").indexOf("news_page") != -1) {
		googleRssFeed();
		loadAlerts();		
	}
}

/* Retrieve news articles from Google News and parse. */
function googleRssFeed() {
	var url = "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&q=Flint+Water+Crisis&cf=all&ncl=&output=rss";
	
	feednami.load(url, function(result) {
		if (result.error) {
      		console.log(result.error);
    	}
    	else {			
			var html = "<p class='text-center'>News articles courtesy of <a href='https://news.google.com'>Google News</a>.</p>";
      		var entries = result.feed.entries;
			var entry;
			
			for (var i = 0; i < entries.length; i++) {
        		entry = entries[i];
				date_added = new Date(entry.date_ms);
				
				html += '<div class="card">';
				html += '<div class="card-main">';
				html += '<div class="card-header"><div class="card-inner"><span class="pull-left"><strong>' + articleAuthor(entry.title) + '</strong></span>' + '<p id="date" class="pull-right"><span>' + months[date_added.getMonth()] + ' ' + getDay(date_added) + ", " + date_added.getFullYear() + '</span> <span>' + getHours(date_added)[0] + ':' + getSeconds(date_added) + ' ' + getHours(date_added)[1] + '</span></p></div></div>';
				
				html += '<div class="card-inner"><h5 style="clearfix"><a href="' + entry.link +'" target="_blank">' + articleTitle(entry.title) + '</a></h5>' + summaryText(entry.summary) + '</div>';
				html += '</div></div>';
      		}
	   		$("#news").html(html);
			
			if ($("#news .card").length == 0)
				$("#news").prepend("<p class='text-center'>There are no news articles available.</p>");
		}
	});
}

/* Retrieve alerts from the database and parse. */
function loadAlerts() {
	var client = gapi.auth2.getAuthInstance();
	
	client.then(function() {
		gapi.client.load("storage", "v1").then(function() {
			var request = gapi.client.storage.objects.get({
				"bucket": "h2o-flint.appspot.com",
				"object": "alerts.json",
				"alt": "media"
			});
			
			request.then(function(resp) {
				html = "";
				var js_obj = $.parseJSON(resp.body);
				var link;
				var expiration;
				
				for (var i=0; i<js_obj.alerts.length; i++) {
					var alert = js_obj.alerts[i];
					date_added = new Date(alert.added);
					date_expiration = new Date(alert.expiration);

					if (alert.url === '')
						link = alert.title;
					else
						link = '<a href="' + alert.url + '" target="_blank">' + alert.title + '</a>';
					
					html += '<div class="card">';
					html += '<div class="card-main">';
					html += '<div class="card-header"><div class="card-inner"><span class="pull-left"><strong>' + link + '</strong></span>' + '<p id="date" class="pull-right"><span>' + months[date_added.getMonth()] + ' ' + getDay(date_added) + ", " + date_added.getFullYear() + '&nbsp;</span> <span>' + getHours(date_added)[0] + ':' + getSeconds(date_added) + ' ' + getHours(date_added)[1] + '</span></p></div></div>';
					
					if (alert.expiration.indexOf('0000') != -1)
						expiration = '';
					else
						expiration = '<p id="expiration"><span>Expiration: </span>' + months[date_expiration.getMonth()] + ' ' + getDay(date_added) + ", " + date_added.getFullYear() + ' ' + getHours(date_added)[0] + ':' + getSeconds(date_added) + ' ' + getHours(date_added)[1] + '</p>';
					
					html += '<div class="card-inner" style="clearfix"><p>' + alert.body + '</p>' + expiration + '</div>';
					html += '</div></div>';
				}
				
				$("#alerts").html(html);
				
				if ($("#alerts .card").length == 0)
					$("#alerts").prepend("<p class='text-center'>There are no alerts available.</p>");
			});
		});
	});
}

function getDay(date) {
	if (date.getDate() < 10)
		newDay = "0"+date.getDate();
	else
		newDay = date.getDate();
	
	return newDay;
}

function getHours(date) {
	if (date.getHours() >= 12) {
		newHours = date.getHours() - 12;
		
		if (newHours == 0)
			newHours = 12;
		
		timeOfDay = "pm";
	}
	else {
		newHours = date.getHours();
		timeOfDay = "am";
	}
	
	return [newHours, timeOfDay];
}

function getSeconds(date) {
	if (date.getSeconds() < 10)
		newSeconds = "0"+date.getSeconds();
	else
		newSeconds = date.getSeconds();
	
	return newSeconds;
}

function articleAuthor(input) {
	return input.split("- ")[1];
}

function articleTitle(input) {
	return input.split("-")[0];
}

function summaryText(input) {
	var retVal = input.split('size="-1">')[2].split("...")[0] + "...</font>";
	retVal = retVal.replace(/<[/]*b>/g, "");
	//retVal += "...";
	
	//console.log(retVal);

	return retVal;
}