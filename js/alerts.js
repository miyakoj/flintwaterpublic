google.load("feeds", "1");
google.setOnLoadCallback(onStartup);

function onStartup() {
	var feed = new google.feeds.Feed("http://www.michigan.gov/rss/0,2348,7-345-75303--91359-,00.xml");
    feed.load(function(result) {
	   if (!result.error) {		   
		   var i;
		   var html = '';
		   
		   for (i in result.feed.entries) {
			   var entry = result.feed.entries[i];
			   
			   html += '<div class="card">';
			   html += '<div class="card-inner"><a href="' + entry.link +'">' + entry.title + '</a> <div>' + entry.publishedDate + '</div></div>';
			   html += '</div>';
		   }
		   
		   $("#alerts").html(html);
	   }
	});
}