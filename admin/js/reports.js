var apiKey = "AIzaSyA0qZMLnj11C0CFSo-xo6LwqsNB_hKwRbM";
var fusionTableId = "17nXjYNo-XHrHiJm9oohgxBSyIXsYeXqlnVHnVrrX";

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
	var waterTestsChart = new Chart($("#water_tests_chart"), {
		type: "doughnut",
		data: {
			labels: ["Total Households", "Total Locations Tested"],
			datasets: [{
				data: [40472, 10671],
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
				data: [12, 38],
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
	
	
	/* Line charts for lead level/copper level/lead test data. */
	var timePeriod = ["September 2015", "October 2015", "November 2015", "December 2015", "January 2016", "February 2016", "March 2016", "April 2016", "May 2016", "June 2016"];
	
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
				data: [14.8750, 6.3242, 3.9286, 19.4489, 11.9873, 13.5472, 17.4510, 34.4786, 30.2372, 10.0025],
				backgroundColor: "#5266B0",
				borderColor: "#5266B0",
				fill: false
			},
			{
				label: "Lead Action Level",
				data: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
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
				data: [595, 2087, 495, 3423, 59697, 107023, 85789, 85438, 42967, 3971],
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

/*year	month	avgLeadLevel	avgCopperLevel	totalTests	
2015	9		14.8750		112.2500	595	
2015	10		6.3242		138.2727	2087	
2015	11		3.9286		64.3651		495	
2015	12		19.4489		115.1136	3423	
2016	1		11.9873		94.2229		59697	
2016	2		13.5472		81.7133		107023	
2016	3		17.4510		105.6507	85789	
2016	4		34.4786		116.6392	85438	
2016	5		30.2372		154.4194	42967	
2016	6		10.0025		93.1486		3971*/
	
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