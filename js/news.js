google.load("feeds", "1");
google.setOnLoadCallback(onStartup);

function onStartup() {
	mLive();
    michiganRadio();
	
	if ($("body").attr("id").includes("news_page"))
		if ($("#news .card").length() == 0)
			$("#news .card").prepend("<p class='text-center'>There are no news articles available.</p>");
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
			if(entry.categories.indexOf("tag:flint-water") != -1) {
				placeholder = entry;
				html += '<div class="card">';
				html += '<div class="card-main">';
				html += '<div class="card-header"><div class="card-inner"><img class="pull-left" src="../images/Mlive.jpg" alt="MLive">' + '<span class="pull-left">MLive</span>' + '<span class="pull-right">' + date(entry.publishedDate) + '</span></div></div>';
				html += '<div class="card-inner"><h5 style="clearfix"><a href="' + entry.link +'" target="_blank">' + entry.title + " " + '</a></h5>' + entry.contentSnippet + '</div>';
				html += '</div></div>';
			}
	   }
	   
	   $("#news").html(html);
	   }	
	});
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
				placeholder = entry;				
				html += '<div class="card">';
				html += '<div class="card-main">';
				html += '<div class="card-header"><div class="card-inner"><img class="pull-left" src="../images/michigan_radio.png" alt="Michigan Radio">' + '<span class="pull-left">Michigan Radio</span>' + '<span class="pull-right">' + date(entry.publishedDate) + '</span></div></div>';
				html += '<div class="card-inner"><h5 style="clearfix"><a href="' + entry.link +'" target="_blank">' + entry.title + " " + '</a></h5>' + entry.contentSnippet + '</div>';
				html += '</div></div>';
			}
	   }

	   $("#news").append(html);
		
		}	
	})
}

function date(input) {
	return input.substring(0,16);
}