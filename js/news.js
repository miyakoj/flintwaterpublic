google.load("feeds", "1");
google.setOnLoadCallback(onStartup);

function onStartup() {
	//mLive();
    //michiganRadio();
    googleRssFeed();
	
	if ($("body").attr("id").indexOf("news_page") != -1) {
		if ($("#news .card").length == 0)
			$("#news .card").prepend("<p class='text-center'>There are no news articles available.</p>");
	}
}

function googleRssFeed() {
	var url = 'https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&q=Flint+Water+Crisis&cf=all&ncl=&output=rss';
	console.log("in googleRssFeed");
	var html = '';
	feednami.load(url,function(result){
    	if(result.error){
      		console.log(result.error)
      		console.log("error");
    	}
    	else{
      		var entries = result.feed.entries
      		console.log("starting loop");
      		for(var i = 0; i < entries.length; i++){
        		var entry = entries[i]
        		console.log(entry)
        		html += '<div class="card">';
				html += '<div class="card-main">';
				html += '<div class="card-header"><div class="card-inner"><span class="pull-left">' + articleAuthor(entry.title) + '</span>' + '<span class="pull-right">' + date(entry.pubdate, 10) + '</span></div></div>';
				html += '<div class="card-inner"><h5 style="clearfix"><a href="' + entry.link +'" target="_blank">' + articleTitle(entry.title) + " " + '</a></h5>' + summaryText(entry.summary) + '</div>';
				html += '</div></div>';
      		}
	   		$("#news").html(html);
    	}
  	})
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

function date(input, length) {
	return input.substring(0, length);
}

function articleTitle(input) {
	return input.split("-")[0];
}

function articleAuthor(input) {
	return input.split("- ")[1];
}

function summaryText(input) {
	var retVal = input.split('size="-1">')[2].split("...")[0] + "...</b>";
	console.log(retVal);
	return retVal;
}