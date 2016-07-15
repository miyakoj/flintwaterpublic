google.load("feeds", "1");
google.setOnLoadCallback(onStartup);

function onStartup() {
	mLive();
	michiganRadio();
}

function mLive() {
	var feed = new google.feeds.Feed("http://blog.mlive.com/newsnow_impact/atom.xml");
	feed.setNumEntries(50);
	feed.load(function(result) {
	   if (!result.error) {
		   var html = '';
			result.feed.entries.sort(function (a,b){
			return new Date(b.publishedDate) - new Date(a.publishedDate);
			});
	   for (var i = 0; i < result.feed.entries.length; i++) {
		   var entry = result.feed.entries[i];
			if(entry.categories.indexOf("tag:flint-water") != -1){
				html += '<div class="card">';
				html += '<div class="card-inner"><img src="../images/Mlive.jpg" alt="Mlive">' + '<span>Mlive</span>' + '<span class="news_date">' + date(entry.publishedDate) + '</span>';
				html += '<div><a href="' + entry.link +'">' + entry.title + " " + '</a><p>' + entry.contentSnippet + '</p></div> </div>';
				html += '</div>';
			}
	   }
	   $("#news").html(html);
		
		}	
	})
}


function michiganRadio()  {
	var feed = new google.feeds.Feed("http://michiganradio.org/rss.xml");
	feed.setNumEntries(50);
	feed.load(function(result) {
	   if (!result.error) {
		   var html = '';
			result.feed.entries.sort(function (a,b){
			return new Date(b.publishedDate) - new Date(a.publishedDate);
			});
	   for (var i = 0; i < result.feed.entries.length; i++) {
		   var entry = result.feed.entries[i];
			if(entry.title.search(/(Flint)+(')*[\w\s\d]+(water)*/) > 0){
				html += '<div class="card">';
				html += '<div class="card-inner"><img src="../images/michigan_radio.png" alt="Michigan radio">' + '<span>Michigan Radio</span>' + '<span class="news_date">' + date(entry.publishedDate) + '</span>';
				html += '<div><a href="' + entry.link +'">' + entry.title + " " + '</a><p>' + entry.contentSnippet + '</p></div>';
				html += '</div>';
			}
	   }
	   $("#news").append(html);
		
		}	
	})
}

function date(input) {
	return input.substring(0,16);
}

