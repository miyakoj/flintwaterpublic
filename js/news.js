google.load("feeds", "1");
google.setOnLoadCallback(onStartup);

var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

function onStartup() {	
	if ($("body").attr("id").indexOf("news_page") != -1) {
		googleRssFeed();
		
		if ($("#news .card").length == 0)
			$("#news").prepend("<p class='text-center'>There are no news articles available.</p>");
	}
}

function googleRssFeed() {
	var url = "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&q=Flint+Water+Crisis&cf=all&ncl=&output=rss";
	
	feednami.load(url, function(result) {
    	if (result.error) {
      		console.log(result.error);
    	}
    	else {
			var html = "";
      		var entries = result.feed.entries;
			var entry;
			var date;
			var newDay;
			var newHours;
			var newSeconds;
			var timeOfDay;
			
      		for (var i = 0; i < entries.length; i++) {
        		entry = entries[i];
				date = new Date(entry.pubdate);
				
				if (date.getDate() < 10)
					newDay = "0"+date.getDate();
				else
					newDay = date.getDate();
				
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
				
				if (date.getSeconds() < 10)
					newSeconds = "0"+date.getSeconds();
				else
					newSeconds = date.getSeconds();
				
				html += '<div class="card">';
				html += '<div class="card-main">';
				html += '<div class="card-header"><div class="card-inner"><span class="pull-left"><strong>' + articleAuthor(entry.title) + '</strong></span>' + '<p class="pull-right"><span>' + month[date.getMonth()-1] + ' ' + newDay + ", " + date.getFullYear() + '</span> <span>' + newHours + ':' + newSeconds + ' ' + timeOfDay + '</span></p></div></div>';
				
				html += '<div class="card-inner"><h5 style="clearfix"><a href="' + entry.link +'" target="_blank">' + articleTitle(entry.title) + '</a></h5>' + summaryText(entry.summary) + '</div>';
				html += '</div></div>';
      		}
	   		$("#news").html(html);
    	}
  	});
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