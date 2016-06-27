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
		   
		   html += '<div class="card">';
		   html += '<div class="card-main"><div class="card-inner">';
		   html += '<a href="' + entry.link +'">' + entry.title + '</a> <p>' + entry.contentSnippet + '</p> </div> </div>';
		   html += '</div>';
	   }
	   
	   $("#news").html(html);
   }
}

