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
			   
			   html += '<div class="panel panel-default">';
			   html += '<div class="panel-body"><a href="' + entry.link +'">' + entry.title + '</a> (' + entry.publishedDate + ')</div>';
			   html += '</div>';
		   }
		   
		   $("#alerts").html(html);
	   }
	});
}