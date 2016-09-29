var apiKey = "AIzaSyA0qZMLnj11C0CFSo-xo6LwqsNB_hKwRbM";
var fusionTableId = "17nXjYNo-XHrHiJm9oohgxBSyIXsYeXqlnVHnVrrX";
var $pageId = $("body").attr("id").slice(0, $("body").attr("id").indexOf("_"));

/* Stores fusion table query callbacks. */
window.jsonpCallbacks = {};

function queryFusionTable(query, callback) {	
	$.ajax({
		type: "GET",
		dataType: "jsonp",
		url: "https://www.googleapis.com/fusiontables/v2/query?sql=" + encodeURI(query) + "&key=" + apiKey + "&callback=" + callback,
		jsonpCallback: callback
	});
}

$(document).ready(function () {
	/* Global Chart Config */
	Chart.defaults.global.defaultFontSize = 14;
	Chart.defaults.global.title.fontSize = 18;
	
	/* Dashboard doughnut status charts. */
	if ($pageId.indexOf("dashboard") != -1) {
		var waterTestsChart = new Chart($("#water_tests_chart"), {
			type: "doughnut",
			data: {
				labels: ["Total Households", "Total Locations Tested"],
				datasets: [{
					data: [40472, 23972],
					backgroundColor: ["#CCC", "#5266B0"]
				}]
			},
			options: {
				title: {
					display: true,
					text: 'Water Tests'
				}
			}
		});
	
		var repairsChart = new Chart($("#repairs_chart"), {
			type: "doughnut",
			data: {
				labels: ["Pending Repairs", "Completed Repairs"],
				datasets: [{
					data: [203, 38],
					backgroundColor: ["#CCC", "#5266B0"]
				}]
			},
			options: {
				title: {
					display: true,
					text: 'Water Infrastructure Repairs'
				}
			}
		});
	}
	
	
	/* Line charts for lead level/copper level/lead test data. */
	if ($pageId.indexOf("reports") != -1) {
		var timePeriod = ["September 2015", "October 2015", "November 2015", "December 2015", "January 2016", "February 2016", "March 2016", "April 2016", "May 2016", "June 2016", "July 2016", "August 2016", "September 2016"];
		
		var levelsChart = new Chart($("#levels_trend"), {
			type: "line",
			data: {
				labels: timePeriod,
				datasets: [/*{
					label: "Copper Action Level",
					data: [1300, 1300, 1300, 1300, 1300, 1300, 1300, 1300, 1300, 1300],
					borderColor: "#FFFF00",
					fill: false
				}},
				{
					label: "Average Copper Level",
					data: [112.2500, 138.2727, 64.3651, 115.1136, 94.2229, 81.7133, 105.6507, 116.6392, 154.4194, 93.1486],
					borderColor: "#5266B0",
					fill: false
				},*/
				{
					label: "Average Lead Level",
					data: [15.1892, 6.4149, 3.7951, 20.2424, 12.4007, 13.5444, 17.5068, 34.8227, 30.9329, 10.8779, 14.5364, 14.1623, 9.3133],
					backgroundColor: "#5266B0",
					borderColor: "#5266B0",
					fill: false
				},
				{
					label: "Lead Action Level",
					data: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
					backgroundColor: "#FF0000",
					borderColor: "#FF0000",
					fill: false
				}]
			},
			options: {
				title: {
					display: true,
					text: 'Lead Levels by Month'
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Month'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'ppb'
						}
					}]
				}
			}
		});
		
		var waterTests = new Chart($("#water_tests_trend"), {
			type: "line",
			data: {
				labels: timePeriod,
				datasets: [{
					label: "Total Water Tests",
					data: [562, 2634, 3097, 6437, 65266, 169531, 253511, 338339, 381181, 389731, 399514, 407629, 409799],
					backgroundColor: "#FF0000",
					borderColor: "#FF0000",
					fill: false
				},
				{
					label: "Monthly Water Tests",
					data: [562, 2072, 463, 3340, 58829, 104265, 83980, 84828, 42842, 8550, 9783, 8115, 2170],
					backgroundColor: "#5266B0",
					borderColor: "#5266B0",
					fill: false
				}]
			},
			options: {
				title: {
					display: true,
					text: 'Water Tests by Month'
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Month'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: false
						}
					}]
				}
			}
		});
	}

/*
year 	month 	avgLeadLevel 	avgCopperLevel 	totalTests 	
2015 	9 		15.1892 		84.3243 		562
2015 	10 		6.4149 			139.7523 		2072
2015 	11 		3.7951 			63.5246 		463
2015 	12 		20.2424 		104.7273 		3340
2016 	1 		12.4007 		92.4557 		58829
2016 	2 		13.5444 		79.0562 		104265
2016 	3 		17.5068 		103.9917 		83980
2016 	4 		34.8227 		116.5484 		84828
2016 	5 		30.9329 		156.4397 		42842
2016 	6 		10.8779 		81.5776 		8550
2016 	7 		14.5364 		70.2080 		9783
2016 	8 		14.1623 		59.2670 		8115
2016 	9 		9.3133 			61.9313 		2170
*/
	
	/*var years = ["2015", "2016"];
	var months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
	var count = 0;
	var sum = 0;
	
	for (var i=0; i<years.length; i++) {
		for (var j=0; j<months.length; j++) {
			var query = "SELECT `testDate`, `leadlevel`, `copperlevel` FROM " + fusionTableId + " WHERE `testDate` LIKE '" + months[j] + "/%/" + years[i] + "'";
			
			/* Based on code found here: http://stackoverflow.com/questions/21373643/jquery-ajax-calls-in-a-for-loop#21373707 
			(function(i, j) {
				window.jsonpCallbacks["fusionQueryCallback"+months[j]+"-"+years[i]] = function(data) {
					console.log(data);
				};
			})(i, j);
			
			queryFusionTable(query, "jsonpCallbacks.fusionQueryCallback"+months[j]+"-"+years[i]);
		}
	}*/
});