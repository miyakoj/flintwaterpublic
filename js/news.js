google.load("feeds", "1");
google.setOnLoadCallback(onStartup);

function onStartup() {
	var query = 'site:mlive.com Flint water';
    google.feeds.findFeeds(query, findEntries);
}

function findEntries(result) {
   if (!result.error) {
	   var html = '';
	   
	   for (var i = 0; i < result.entries.length; i++) {
		   var entry = result.entries[i];
		   
		   html += '<div class="panel panel-default">';
		   html += '<div class="panel-heading"><a href="' + entry.link +'">' + entry.title + '</a></div>';
		   html += '<div class="panel-body">' + entry.contentSnippet + '</div>';
		   html += '</div>';
	   }
	   
	   $("#news").html(html);
   }
}