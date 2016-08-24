$(document).ready(function() {
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;
	var $activeNode;
	
	/* Position alert in the middle of the page. */
	$(".alert").css({
		"top": function() {
			return this.top = (windowHeight - $(".alert").height()) / 2;
		},
		"left": function() {
			return this.left = (windowWidth - $(".alert").width()) / 2;
		}
	});
	
	/* Activate tooltips. */
	$(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});
	
	/* Make the line-height of the navbar header h1 match the height of the navbar. */
	//$(".navbar-brand").css("line-height", $("#main_menu ul").css("line-height"));
	
	/* Dynamically adjust the dropdown menu links. */
	$(".dropdown-menu a").css("line-height", $(".dropdown-menu a").css("min-height"));
	//$("#language_menu .dropdown-toggle").css("width", $("#language_menu .dropdown-menu").css("min-width"));
	$("#header_top #language_menu .dropdown-menu").css("min-width", $("#header_top #language_menu").css("min-width"));
	
	/* Position the map in the correct element if it exists on the page. */
	if($("#search_input").length != 0)
		$("#map_container #search_input").after($("#map"));
  
	/* Size the map based on the window size. */
	if (windowHeight >= 480) {
		var mapHeight = windowHeight - $("#header").outerHeight() - $("#toggles").outerHeight() - $("footer").outerHeight() + 10;
	}
	else
		$("#map_container").css("height", "10em");
	
	$("#map_container").css("height", mapHeight + "px");
	
	$("#search_input").val(""); // clear the search input upon refresh
	
	/* Scale the popup markers based on screen size. */
	$(".marker_popup_icons").css({"width": iconSize + "px", "height": "auto"});
	
	/* Dynamically generate page links. */
	var id;
	var page;
	
	$("#main_menu a").each(function(i) {
		id = $(this).attr("id");
		var dropdown = $(this).siblings(".dropdown-menu");
		
		/* If the dropdown is a sibling of the current <a> then generate the links for the items. */
		if (dropdown.length > 0) {
			dropdown.each(function () {
				id = dropdown.find("a").attr("id");
				page = id.slice(0, id.indexOf("_"));
				$(this).attr("href", "page.php?pid=" + page);
			});
		}
		else {
			if (id.indexOf("link") != -1) {
				page = id.slice(0, id.indexOf("_"));

				if (page != "map")
					$(this).attr("href", "page.php?pid=" + page);
				else
					$(this).attr("href", "index.php");
			}
			/*else if (id.indexOf("lang") != -1) {
				page = id.slice(id.indexOf("_") + 1, id.length);
				$(this).attr("href", page);
			}*/
		}
	});
	
	$("footer .card-action a").each(function(i) {
		id = $(this).attr("id");
		page = id.slice(0, id.indexOf("_"));
		
		$(this).attr("href", "page.php?pid=" + page);
	});
	
	id = $("footer #about_link").attr("id");
	page = id.slice(0, id.indexOf("_"));
	
	$("footer #about_link").attr("href", "page.php?pid=" + page);
	
	/* Mark the tab of the current page as active. */
	$pageId = $("body").attr("id").slice(0, $("body").attr("id").indexOf("_"));
	console.log("$pageId = " + $pageId);
	
	if ($pageId.indexOf("index") != -1)
		$("#map_link").parent().addClass("active");
	else {
		$("#" + $pageId + "_link").parent().addClass("active");
		
		// if the linked clicked is in the "show me" dropdown then also make the "show me" tab active
		if ($("#" + $pageId + "_link").parent().parent().parent().attr("id") == "show_me_menu")
			$("#show_me_menu").addClass("active");
	}
	
	/* General layout/CSS differences between the mobile and desktop versions. */
	/* Phones only. */
	if (windowWidth < 600) {
		$("#location_card, #resource_card").css({
			"width": (windowWidth - 10) + "px",
		}).appendTo($("body"));
		
		//$("#resource_card #card_report_menu li:first-child div").removeClass("dropdown").addClass("dropup");
		
		$("#resource_card #card_report_menu").on("click", function() {
			$(this).find("li:first-child").addClass("dropup open");
			$(this).find("#report_button").attr("aria-expanded", "true");
		});
	}
	else {
		$("#location_card").css({
			"width": function() {
				return $("#search_input").outerWidth();
			},
			"top": function() {
				return parseInt($("#search_input").css("top")) + (parseInt($("#search_input").height()) + 20) + "px";
			},
			"left": function() {
				return parseInt($("#search_input").css("left")) + parseInt($("#search_input").css("margin-left")) + "px";
			}
		});
		
		var leftPos = (windowWidth - $("#resource_card").width()) / 2;
		
		$("#resource_card").css({
			"margin-right": "-" + leftPos + "px",
			"left": leftPos + "px"	
		});
	}
	
	/* Layout mods for differences between desktop and mobile for the "show me" pages.	
	/* Size the map/video area depending on the height of the device. */	   
	if (windowHeight < 800)
		$("#topbar").css("height", "20em");
	else
		$("#topbar").css("height", "30em");
	
	if (($pageId.indexOf("index") == -1) && ($pageId.indexOf("news") == -1) && ($pageId.indexOf("about") == -1))
		$activeNode = $(".stepper-vert-inner").find($("div[class*='active']"));
	//else for the index, news, and about pages
		
	/* Resize the provider info popups. */
	//console.log($("#provider_popup").parent());
	//$("#provider_popup").parent().parent().css("width", "300px");
	
	/* Phones and small tablets. */
	if (windowWidth < 768) {
		$("#made_in_Flint").appendTo($("#main_menu"));
		$("#made_in_Flint img").css({
			"margin-left": "auto",
			"margin-right": "auto",
			"margin-top": "20px"			
		});
		
		$("#main_menu .nav").removeClass("nav-justified");
		$("#show_me_menu").removeClass("dropdown");
		$("#show_me_menu ul").removeClass("dropdown-menu");
		
		/* Move the map and help videos above the steppers for phone/small tablet. */
		$("#sidebar").addClass("hide");
		$("#topbar").prepend($("#map"));
		
		if ($pageId.indexOf("filter") != -1) {
			$("#topbar").css("height", "auto");
			
			$(".help_video").each(function() {
				$(this).prependTo($("#topbar"))
			});
		}
		else
			$(".help_video").prependTo($("#topbar"));
		
		/* Apply the initial abbreviated stepper layout for mobile. */
		$(".cancel_button").addClass("hide");
		
		$("#stepper_content").addClass("brief");
		$("#stepper_content h2").css({
			"font-size": "15px",
			"font-weight": "bold"
		});
		$("#stepper_content ul").css({
			"margin-bottom": "0",
			"padding-left": "0"
		});
		$("#stepper_content ul li").css("display", "none");
		$("#stepper_content ul li:first-child").css({
			"white-space": "nowrap",
			"overflow": "hidden",
			"text-overflow": "ellipsis",
			"display": "list-item"
		});
		$("#stepper_content .btn_group").css({
			"margin-top": "0",
			"text-align": "right"
		});
		//$(".stepper-vert .:after, .stepper-vert .stepper:before").addClass("cancel_stepper_border");
		
		$("div[id$='step1_content'] .btn_group").append("<img class='progress_img center-block' src='images/stepper1.png' />");
		$("div[id$='step2'], div[id$='step3']").addClass("hide");
		
		$("div[id$='step1'], div[id$='step2'], div[id$='step3']").css({
			"padding-top": "10px",
			"padding-bottom": "10px"
		});
		
		/*if ($pageId.indexOf("filter") == -1) {
			$(".back_button").css({
				"padding": "0",
				"position": "absolute",
				"top": "0",
				"left": "0"
			}).removeClass("btn-primary").prepend("<span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span> ");
			
			$(".next_button").css({
				"padding": "0",
				"position": "absolute",
				"top": "0",
				"right": "0"
			}).removeClass("btn-primary").append(" <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>");
		}
		else {*/
			$("div[id$='step2_content'] .back_button, div[id$='step3_content'] .back_button").css({
				"padding": "0",
				"position": "absolute",
				"top": "0",
				"left": "0"
			}).removeClass("btn-primary").prepend("<span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span> ");
			
			$("div[id$='step1_content'] .next_button, div[id$='step2_content'] .next_button, div[id$='step3_content'] .next_button").css({
				"padding": "0",
				"position": "absolute",
				"top": "0",
				"right": "0"
			}).removeClass("btn-primary").append(" <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>");
		//}
		
		/* Unhide all step titles when the steppers are expanded and modify appearance of buttons. */
		$("div[id*='step1'], div[id*='step2'], div[id*='step3']").parent().parent().on("click", function() {
			if ($("#stepper_content").hasClass("brief")) {
				var $steppers = $(this).find("div[id*='step']");
				var $total_active = $(this).find("div[class*='active']").length;
				
				/* Mark previous steps as "done". */
				$steppers.each(function(i) {
					if (i < ($total_active-1)*2) {
						if ((i % 2) == 0)
							$(this).removeClass("active").addClass("done");
					}
					else {
						$activeNode = $(this);
						return false;
					}
				});
				
				$("#stepper_content").removeClass("brief").addClass("expanded");
				$("div[id$='step1'], div[id$='step2'], div[id$='step3'], #stepper_content h2, #stepper_content ul, #stepper_content ul li, .stepper-vert-content, #stepper_content .btn_group, #stepper_content .next_button").removeAttr("style");
				$("div[id*='step1'], div[id*='step2'], div[id*='step3']").removeClass("cancel_stepper_border");
				$("div[id$='step1'], div[id$='step2'], div[id$='step3']").css({"padding-left": "inherit"});
				$("div[id$='step1'], div[id$='step2'], div[id$='step3'], .cancel_button").removeClass("hide");
				$("div[id*='step'] .btn_group").remove("img");
				
				if ($pageId.indexOf("filter") == -1) {
					$(".next_button, .back_button").addClass("btn-primary");
				}
				else {
					$("div[id$='step2_content'] .next_button, div[id$='step3_content'] .next_button, div[id$='step2_content'] .back_button, div[id$='step3_content'] .back_button").addClass("btn-primary");
				}
				
				$(".next_button span, .back_button span").remove();
				$(".progress_img").remove();
				
				isExpanded($activeNode);
			}
			else
				return;
		}).on("click", "input, textarea, select, .next_button, .back_button, .cancel_button", function(event) {
			event.stopPropagation();
		});
	}
	else { // Desktop/Laptop
		if (windowWidth < 1024) {
			$("#header_top").addClass("clearfix");
			$("#toggles").removeClass("btn-group btn-group-justified");
		}
	
		$("#main_menu .nav").addClass("nav-justified");
		$("#show_me_menu").addClass("dropdown");
		$("#show_me_menu ul").addClass("dropdown-menu");
		
		/* Make the stepper content span only four columns. */
		$("#" + $pageId + "_page #stepper_content").removeClass("col-xs-12").addClass("col-sm-5");
		
		/* Move the map and help video into the sidebar. */
		$("#topbar").addClass("hide");
		$("#map").prependTo($("#sidebar"));
		
		if ($pageId.indexOf("filter") != -1) {
			$(".help_video").each(function() {
				$(this).prependTo($("#sidebar"));
			});
		}
		else
			$(".help_video").prependTo($("#sidebar"));
		
		/* Show the step titles by default. */
		$("div[id$='step1_content'] .cancel_button, div[id$='step2'], div[id$='step3']").removeClass("hide");
	}
	
	/* Cancel button for all "show me" pages and the third step next button. */
	$(".cancel_button, div[id$='step3_content'] .next_button").on("click", function() {
		if ($pageId.indexOf("report") == -1)
			$(window).attr("location", "index.php");
	});
	
	/* Mobile "expanded" stepper code. */
	function isExpanded(node) {
		$nodeId = node.attr("id");
		$nodeSubstring = $nodeId.slice(0, $nodeId.length-1);
		
		/* Retrieve which type of filter was clicked if on the filter page. */
		var filter_type = "";
		
		if ($pageId.indexOf("filter") != -1) {
			var $temp = $(this).attr("id");
			filter_type = $temp.slice(0, $temp.indexOf("_"));
		}
		
		$(".cancel_button").removeClass("hide");
		
		if (windowHeight < 480)
			$("#topbar").css("height", "15em");
		
		$("#" + $nodeSubstring + "1_content .next_button").on("click", function() {
			$("#" + filter_type + "_" + $nodeSubstring + "1").removeClass("active hide").addClass("done");
			$("#" + filter_type + "_" + $nodeSubstring + "1_content").addClass("hide");
			$("#" + filter_type + "_" + $nodeSubstring + "2").removeClass("hide").addClass("active");
			$("#" + filter_type + "_" + $nodeSubstring + "2_content").removeClass("hide");
			
			if ($pageId.indexOf("test") != -1) {
				$("#map").addClass("hide");
				$(".help_video").removeClass("hide");
			}
		});
		
		$("#" + $nodeSubstring + "2_content .next_button").on("click", function() {
			$("#" + $nodeSubstring + "2").removeClass("active hide").addClass("done");
			$("#" + $nodeSubstring + "2_content").addClass("hide");
			$("#" + $nodeSubstring + "3").removeClass("hide").addClass("active");
			$("#" + $nodeSubstring + "3_content").removeClass("hide");
			
			if ($pageId.indexOf("test") != -1) {
				$(".help_video").addClass();
				$("#map").removeClass("hide");
			}
		});
		
		$("#" + $nodeSubstring + "2_content .back_button").on("click", function() {
			$("#" + $nodeSubstring + "2").removeClass("done").addClass("active");
			$("#" + $nodeSubstring + "2_content").removeClass("hide");
			$("#" + $nodeSubstring + "3").removeClass("active").addClass("hide");
			$("#" + $nodeSubstring + "3_content").addClass("hide");
			
			if ($pageId.indexOf("test") != -1) {
				$(".help_video").removeClass();
				$("#map").addClass("hide");
			}
		});
	}
	
	/* All "show me how" pages and the "report a problem" page. */
	if (($pageId.indexOf("index") == -1) && ($pageId.indexOf("news") == -1) && ($pageId.indexOf("about") == -1)) {
		$nodeId = $activeNode.attr("id");
		$nodeSubstring = $nodeId.slice(0, $nodeId.length-1);
		
		/* Hide the content of steps 2 and 3 when the page loads. */
		$("div[id$='step1_content']").removeClass("hide");
		
		console.log($pageId);
		
		if ($pageId.indexOf("test") != -1) {
			$(".help_video").addClass("hide");
			
			/* Set the map to display only test kits. */
			resourceActiveArray = [0, 0, 0, 0, 1, 0, 0, 0];
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));
		}
		else if ($pageId.indexOf("report") != -1) {
			$(".help_video").addClass("hide");
			
			/* Remove all resource markers from the map. */
			resourceActiveArray = [0, 0, 0, 0, 0, 0, 0, 0];
			localStorage.setItem("resource_array", JSON.stringify(resourceActiveArray));			
		}
		else if ($pageId.indexOf("filter") != -1) {
			$("#PUR_video").addClass("hide");
			$("#map").remove();			
		}			
		else
			$("#map").remove();
		
		if (windowWidth < 768) {
			$(".cancel_button").addClass("hide");
			
			$("div[id*='" + $nodeSubstring + "']").addClass("cancel_stepper_border");
			$(".stepper-vert .stepper::after, .stepper-vert .stepper::before").addClass("cancel_stepper_border");
			
			/* Use a loop to take the filter page into account, which has three clickables in step 1. */
			$("div[id$='step1_content'] .next_button").each(function() {
				$(this).on("click", function() {
					/* Retrieve which type of filter was clicked if on the filter page. */
					var filter_type = "";
					
					if ($pageId.indexOf("filter") != -1) {
						var $temp = $(this).attr("id");
						filter_type = $temp.slice(0, $temp.indexOf("_"));
					}
					
					console.log("filter_type = " + filter_type);
					
					if ($("#stepper_content").hasClass("brief"))
						$("#" + $nodeSubstring + "1, div[id$='step1_content']").addClass("hide");
					else {
						$("#" + $nodeSubstring + "1").removeClass("active").addClass("done");
						$("div[id$='step1_content']").addClass("hide");
					}
					
					$("#" + $nodeSubstring + "2").removeClass("hide").addClass("active");
					$("div[id*='" + filter_type + "_step2_content']").removeClass("hide");
					
					if ($("#stepper_content").hasClass("brief"))
						$("div[id$='" + filter_type + "_step2_content'] .btn_group").append("<img class='progress_img center-block' src='images/stepper2.png' />");
					
					if ($pageId.indexOf("test") != -1) {
						$("#map").addClass("hide");
						$(".help_video").removeClass("hide");
					}
					else if ($pageId.indexOf("filter") != -1) {
						$(".help_video").addClass("hide");
						$("#" + filter_type + "_video").removeClass("hide");
					} 
				});
			});
			
			$("div[id$='step2_content'] .next_button").on("click", function() {
				/* Retrieve which type of filter was clicked if on the filter page. */
				var filter_type = "";
				
				if ($pageId.indexOf("filter") != -1) {
					var $temp = $(this).attr("id");
					filter_type = $temp.slice(0, $temp.indexOf("_"));
				}
				
				if ($("#stepper_content").hasClass("brief"))
					$("#" + $nodeSubstring + "2, div[id*='" + filter_type + "_step2_content']").addClass("hide");
				else {
					$("#" + $nodeSubstring + "2").removeClass("active").addClass("done");
					$("div[id*='" + filter_type + "_step2_content']").addClass("hide");
				}
				
				$("#" + $nodeSubstring + "3, div[id*='" + filter_type + "_step3_content']").removeClass("hide");
				$("#" + $nodeSubstring + "3").addClass("active");
				//$("div[id*='step3_content'] .cancel_button").removeClass("hide");
				$("div[id$='step3_content'] .next_button span").addClass("hide");
				$("div[id$='step3_content'] .btn_group").css("text-align", "center");
				
				if ($("#stepper_content").hasClass("brief")) {
					$("div[id$='" + filter_type + "_step3_content'] .btn_group").prepend("&nbsp;").append("<img class='progress_img center-block' src='images/stepper3.png' />");
				}
				
				$("div[id$='step3_content'] .next_button").css("display", "none");
				
				if ($pageId.indexOf("test") != -1) {
					$(".help_video").addClass("hide");
					$("#map").removeClass("hide");
				}
			});
			
			$("div[id$='step2_content'] .back_button").on("click", function() {
				/* Retrieve which type of filter was clicked if on the filter page. */
				var filter_type = "";
				
				if ($pageId.indexOf("filter") != -1) {
					var $temp = $(this).attr("id");
					filter_type = $temp.slice(0, $temp.indexOf("_"));
				}
				
				if ($("#stepper_content").hasClass("brief"))
					$("#" + $nodeSubstring + "2, div[id*='" + filter_type + "_step2_content']").removeClass("hide");
				else {
					$("#" + $nodeSubstring + "2").removeClass("done").addClass("active");
					$("div[id*='" + filter_type + "_step2_content']").removeClass("hide");
				}
				
				$("#" + $nodeSubstring + "3, div[id*='" + filter_type + "_step3_content']").addClass("hide");
				$("#" + $nodeSubstring + "3").removeClass("active");
				//$("div[id*='step3_content'] .cancel_button").removeClass("hide");
				$("div[id$='step3_content'] .next_button span").removeClass("hide");
				$("div[id$='step3_content'] .btn_group").css("text-align", "center");
				
				if ($("#stepper_content").hasClass("brief")) {
					$("div[id$='" + filter_type + "_step3_content'] .btn_group").prepend("&nbsp;").append("<img class='progress_img center-block' src='images/stepper2.png' />");
				}
				
				$("div[id$='step3_content'] .next_button").css("display", "none");
				
				if ($pageId.indexOf("test") != -1) {
					$(".help_video").removeClass("hide");
					$("#map").addClass("hide");
				}
			});
		}
		else {
			/* Use a loop to take into account the filter page which has three clickables in step 1. */
			$("div[id$='step1_content'] .next_button").each(function() {
				$(this).on("click", function() {
					/* Retrieve which type of filter was clicked if on the filter page. */
					var filter_type = "";
					
					if ($pageId.indexOf("filter") != -1) {
						var $temp = $(this).attr("id");
						filter_type = $temp.slice(0, $temp.indexOf("_"));
					}
					
					$("#" + $nodeSubstring + "1").removeClass("active").addClass("done");
					$("div[id$='step1_content']").addClass("hide");
					$("div[id*='" + filter_type + "_step2_content']").removeClass("hide");
					$("#" + $nodeSubstring + "2").addClass("active");
					
					if ($pageId.indexOf("test") == -1) {
						if ($pageId.indexOf("report") == -1)
							$("#map").addClass("hide");
						
						$(".help_video").removeClass("hide");
						
						if ($pageId.indexOf("filter") == -1)
							$(".help_video").removeClass("hide");
						else
							$("#" + filter_type + "_video").removeClass("hide");
					}
					else if ($pageId.indexOf("filter") != -1) {
						$(".help_video").addClass("hide");
						$("#" + filter_type + "_video").removeClass("hide");
					}
				});
			});
			
			$("div[id$='step2_content'] .next_button").on("click", function() {
				/* Retrieve which type of filter was clicked if on the filter page. */
				var filter_type = "";
				
				if ($pageId.indexOf("filter") != -1) {
					var $temp = $(this).attr("id");
					filter_type = $temp.slice(0, $temp.indexOf("_"));
				}
				
				$("#" + $nodeSubstring + "2").removeClass("active hide").addClass("done");
				$("div[id*='" + filter_type + "_step2_content']").addClass("hide");
				$("#" + $nodeSubstring + "3").addClass("active");
				$("div[id*='" + filter_type + "_step3_content']").removeClass("hide").addClass("cancel_stepper_border");
				
				if ($pageId.indexOf("test") != -1) {
					$(".help_video").remove();
					$("#map").removeClass("hide");
				}
			});
		}
	}
	

	/* Report a Problem page */
	var validator = $("#report_problem form").validate({
		debug: true,
		errorPlacement: function(error, element) {
			//error.appendTo(element.parent());
			element.after(error);
		},
		messages: {
			locationSelector: "Please enter a location.",
			problemSelector: "Please select a problem type.",
			problemText: "Please describe the problem.",
			email_address: "Please enter a valid email address.",
			phone_number: "Please enter the phone number in (555) 555-5555 format."
		}
	});
	
	/* Make sure each form field is reset to default. */
	$("#report_problem #location_selector").val("");
	$("#report_problem #problem_selector").val(0);
	$("#report_problem #problem_text").val("");
	$("#report_problem #email_choice, #report_problem #phone_choice").prop("checked", false);
	$("#report_problem #email_address").val("");
	$("#report_problem #phone_number").val("");
	
	/* Set the validation rules. */
	$("#report_problem #location_selector").rules("add", {required: true});
	$("#report_problem #problem_selector").rules("add", {required: true});
	$("#report_problem #problem_text").rules("add", {required: true, minlength: 5, maxlength: 500});
	$("#email_address").rules("add", {
		required: true,
		email: {
			depends: function(element) {
				return $("#email_choice").is(":checked");
			}
		}
	});
	$.validator.methods.phoneUS = function(value, element) {
		return this.optional(element) || /^(\([2-9]([02-9]\d|1[02-9])\))\ [2-9]([02-9]\d|1[02-9])-\d{4}$/.test(value);
	}
	$("#phone_number").rules("add", {
		required: true,
		phoneUS: {
			depends: function(element) {
				return $("#phone_choice").is(":checked");
			}
		}
	});
	
	/* Fill in location after clicking favorite location marker. */
	$("#report_problem #location_selector").on("focus", function() {
		var autocomplete = initAutocomplete($(this).attr("id"));
		
		autocomplete.addListener('place_changed', function() {
			/*if (this.getPlace().id !== "") {
				//console.log();
				
			}*/
		});
		
		if (validator.element("#report_problem #location_selector"))
			$("#report_step1_content .next_button").removeClass("disabled");
		else
			$("#report_step1_content .next_button").addClass("disabled");
	});
	
	var report_location = document.getElementById("location_selector");
	
	/* Report a Problem form processing. */
	//$("#report_problem form").on("submit", function(event) {
		/*var location = $("#report_problem #locationTextField").val();
		var problemType = $("#report_problem #ProblemSelector").val();
		var description = $("#report_problem #GrowBox").val();
		alert("Thank you for your submission!");
		event.stopPropagation();
		$(window).attr("location", "index.php");*/
		
		/*$.ajax({
			method: "POST",
			url: "includes/functions.php",
			data: {
				type: "report",
				location: $("#report_problem #locationTextField").val(),
				problemType: $("#report_problem #ProblemSelector").val(),
				description: $("#report_problem #GrowBox").val()
			}			
		}).done(function() {
			//$().css("display", "none");			
		}).fail(function() {
			console.log("There was an error submitting the 'Report a Problem' form.");
		});*/
	//});
	
	/* Enable step 2 button once both fields are completed. */	
	/* Count the characters of the problem description and stop the user from entering more characters after 500. */
	$(".char_count").html("<span>Characters remaining:</span> 0");
	$("#report_problem #problem_text").on("keyup", function(event) {
		$(".char_count").html("<span>Characters remaining:</span> " + (500 - $(this).val().length));
	});
	
	$("#report_problem #problem_selector, #report_problem #problem_text").on("focusout", function() {
		if (validator.element("#report_problem #problem_selector") && validator.element("#report_problem #problem_text"))
			$("#report_problem #report_step2_content .next_button").removeClass("disabled");
		else
			$("#report_problem #report_step2_content .next_button").addClass("disabled");
	});		
	
	/* Enable step 3 button once one of the contact fields is completed and valid. */
	$("#report_problem #contact_pref input[type='radio']").on("change", function() {
		var selected = $(this).filter(":checked").val();
		
		if (selected.indexOf("email") != -1) {
			$("#phone_number").addClass("hide");
			$("#email_address").removeClass("hide");
		}
		else if (selected.indexOf("phone") != -1) {
			$("#email_address").addClass("hide");
			$("#phone_number").removeClass("hide");
		}
	});
	
	$("#report_problem #email_address").on("keyup", function() {
		if (validator.element("#report_problem #email_address"))
			$("#report_problem #report_step3_content .next_button").removeClass("disabled");
		else
			$("#report_problem #report_step3_content .next_button").addClass("disabled");
	});
	
	$("#report_problem #phone_number").on("keyup", function() {
		if (validator.element("#report_problem #phone_number"))
			$("#report_problem #report_step3_content .next_button").removeClass("disabled");
		else
			$("#report_problem #report_step3_content .next_button").addClass("disabled");
	});
	
	/* Send the data to the server. */
	$("#report_problem #report_step3_content .next_button").on("click", function(event) {
		event.stopPropagation();
		
		var userInput = "";
		userInput += "{type: 'report', ";
		userInput += "location: '" + $("#location_selector").val().replace(", United States", "") + "', ";
		userInput += "problemType: '" + $("#problem_selector").val() + "', ";
		userInput += "description: '" + $("#problem_text").val() + "', ";
		
		//if ($("#emailAddress").val() != "")
			userInput += "email: '" + $("#email_address").val() + "', ";
		//else
			//data += "email: ''";
		
		//if ($("#phoneNumber").val() != "")
			userInput += "phone: '" + $("#phone_number").val() + "', ";
		//else
			//data += "phone: ''";
		
		//if (($("#emailAddress").val() != "") && ($("#phoneNumber").val() != ""))
			//data += "contactPref: '" + $("#contact_pref").val() + "', ";
		//else
			//data += "contactPref: ''";
		
		console.log(userInput);
				
		/*$.ajax({
		  method: "POST",
		  url: "includes/functions.php",
		  data: userInput
		})
		.done(function() {
			//$().css("display", "none");			
		})
		.fail(function() {
			console.log("There was an error submitting the 'Report a Problem' form.");
		});*/
	});
	
	
	/* Steppers for the submit information page. */
	$("#submit_link").on("click", function() {
	    $("#submit_step1").addClass("active");
		$("#submit_step1_content").removeClass("hide");
		$("#submit_step2_content").addClass("hide");
		$("#submit_step3_content").addClass("hide");
	});
	
    $("#submit_info #step1_click").click(function() {
		$("#submit_step1").removeClass("active").addClass("done");
		$("#submit_step1_content").addClass("hide");
		$("#submit_step2_content").removeClass("hide");
		$("#submit_step2").addClass("active");
	});
	
	$("#submit_info #step2_click").on("click", function() {
		$("#submit_step2").removeClass("active").addClass("done");
		$("#submit_step2_content").addClass("hide");
		$("#submit_step3").addClass("active");
		$("#submit_step3_content").removeClass("hide").addClass("cancel_stepper_border");
	});
	
	$("#submit_info #submit_button").on("submit", function() {
		//var location = $("#report_page #report_info #locationTextField").val();
		//var problemType = $("#report_page #report_info #ProblemSelector").val();
		//var description = $("#report_page #report_info textarea").val();
		console.log("click worked");
		//TODO save these values to the db
		alert("Thank you for your submission!");
		$(window).attr("location", "index.php");
	});
	
	
	/* Dynamically add script tags only to pages where they're relevant. */
	// MAP API
	var js_api = "<script src='https://www.google.com/jsapi'></script>";
	var map_api = "<script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyAr4wgD-8jV8G7gv600mD75Ht1eS3B4siI&libraries=visualization,places' async defer></script>";
	var map_js = "<script src='js/map.js'></script>";
	var client_api = "<script src='https://apis.google.com/js/client.js?onload=setAPIKey'></script>";
	var news_js = "<script src='js/news.js'></script>";
	var alert_js = "<script src='js/alerts.js'></script>";
	
	/*if ($pageId.indexOf("index") != -1) {
		$("head script[src*='script']").before(map_api, client_api);
		$("head script[src*='script']").after(map_js, client_api);
	}*/
	//console.log("$pageId = " + $pageId);
	
	/*if ($pageId.indexOf("news") != -1) {
		//$("head script[src*='script']").before(js_api);
		$("head").append(news_js);
		// + "\n" + alert_js
	}*/
});