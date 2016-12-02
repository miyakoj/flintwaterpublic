var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var $pageId = $("body").attr("id").slice(0, $("body").attr("id").indexOf("_"));

var config;
var app;
var auth;
var db;
var userObj;

var browserError = "<div class='alert alert-danger' role='alert'>You are using an unsupported browser. We recommend using Firefox 45.3+ or Chrome 53+ for the best experience.</div>";
var genericError = "<div class='alert alert-danger' role='alert'>There was an error. Please try again later.</div>";

/* Dynamically load remote scripts only on pages where they're relevant. */
var form_validation_api = "https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/jquery.validate.min.js";
var form_validation_addl_js = "https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/additional-methods.min.js";

$("#loading_screen").removeClass("hide");

(function() {
    "use strict";
	
	/* Position the spinner based upon the size of the screen. */
	$(".loader").css("margin-top", windowHeight/2 - $(".loader").height()/2 + "px");
	
	$('#supported').text('Supported/allowed: ' + !!screenfull.enabled);

	if (!screenfull.enabled) {
		return false;
	}

	$('#toggle').click(function () {
		screenfull.toggle($('#container')[0]);
	});
	
	// Initialize Firebase
	config = {
		apiKey: "AIzaSyAphuqStHEGm66EUi4fsdaU8OtOwuUnOrY",
		authDomain: "uniteflint.firebaseapp.com",
		databaseURL: "https://uniteflint.firebaseio.com",
		storageBucket: "uniteflint.appspot.com",
		messagingSenderId: "402781339047"
	};
	app = firebase.initializeApp(config);
	auth = firebase.auth();
	db = app.database();
	
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			db.ref("users/" + user.uid).once("value").then(function(snapshot) {
				var firstName = snapshot.val().firstName;
				var lastName = snapshot.val().lastName;
				var email = snapshot.val().email;
				var phone = snapshot.val().phone;
				var dept = snapshot.val().dept;
				var address = snapshot.val().address;
				var title = snapshot.val().title;
				var showInfo = snapshot.val().showInfo;
				var role = snapshot.val().role;
				
				var authUser = {
					uid: user.uid,
					email: email,
					firstName: firstName,
					lastName: lastName,
					phone: phone,
					dept: dept,
					address: address,
					title: title,
					showInfo: showInfo,
					role: role
				};					
				userObj = authUser;
				
				if (authUser.firstName)
					$(".name-caret").text("Hello, " + authUser.firstName);
				else
					$(".name-caret").text("Hello, User");
				
				$("#login_link").addClass("hide");
				
				//$("#main_menu").removeClass("hide");
				$("#wrapper").removeClass("hide");
				if ($("#wrapper").length != 0)
					$("#loading_screen").addClass("hide");
			}).then(function() {
				/* Position alert in the middle of the page. */
				$("#page_alert").css({
					"top": function() {
						return this.top = (windowHeight - $("#page_alert").height()) / 2;
					},
					"left": function() {
						return this.left = (windowWidth - $("#page_alert").width()) / 2;
					}
				});
				
				if ($pageId.indexOf("dashboard") != -1) {
					/* Size the map based on the window width and height. */		
					var mapWidth;
					var mapHeight;

					if (windowWidth < 768) {
						mapWidth = $("#map_container").parent().width();
						mapHeight = mapWidth * 0.5;
					}
					else {			
						mapWidth = $("#map_container").parent().width();
						mapHeight = mapWidth * 0.65
					}
					
					$("#map_container").css({"width": mapWidth, "height": mapHeight});
					
					google.maps.event.trigger(map, "resize");
					map.setCenter({lat: 43.021, lng: -83.681});
					
					if (windowWidth < 768) {
					}
					else {
						$("#location_card").css({
							left: (($("#map_container").width() / 2) - ($("#location_card").width() / 2)) + "px",
							bottom: (($("#map_container").height() / 2) + 10) + "px"
						});
					}
				}
				else if ($pageId.indexOf("profile") != -1) {
					var user_group;
					var show_info;
					
					if (parseInt(userObj.role) == 1)
						user_group = "Admin";
					else if (parseInt(userObj.role) == 2)
						user_group = "Edit and View";
					else
						user_group = "View Only";
					
					$("#user_form form #user_group").val(user_group);
					$("#user_form form #first_name").val(userObj.firstName);
					$("#user_form form #last_name").val(userObj.lastName);
					$("#user_form form #title").val(userObj.title);
					$("#user_form form #email").val(userObj.email);
					$("#user_form form #phone").val(userObj.phone);
					$("#user_form form #dept").val(userObj.dept);
					$("#user_form form #bldg").val(userObj.address.bldg);
					$("#user_form form #address").val(userObj.address.streetAddr);
					$("#user_form form #city").val(userObj.address.city);
					$("#user_form form #zipcode").val(userObj.address.zipcode);
					$("#user_form form #state").val(userObj.address.state);
					
					if (userObj.showInfo)
						show_info = "yes";
					else
						show_info = "no";
					
					$("#user_form form #show_info input").val([show_info]);
				}
			});
		}
		else {
			// hide the header for about and disclaimer if the user isn't logged in
			if (($pageId.indexOf("login") == -1) && !userObj) {
				$("#main_menu").addClass("hide");
				$("#login_link").removeClass("hide");
				$("#wrapper").removeClass("hide");
				if ($("#wrapper").length != 0)
					$("#loading_screen").addClass("hide");
			}
		}
	});
	
	/* Various device size differences. */
	if (windowWidth < 768) {
	}
	else {
	}
	
	// mark the current page's navigation button as active
	$("#" + $pageId + "_link").addClass('active');
	
	$.ajax({
		type: "GET",
		url: form_validation_api,
		dataType: "script",
		cache: true
	}).done(function() {
		$.ajax({
			type: "GET",
			url: form_validation_addl_js,
			dataType: "script",
			cache: true
		}).done(function() {
			var validator;
			
			/* From: http://regexlib.com/REDetails.aspx?regexp_id=1111 */
			$.validator.addMethod("password", function(value, element) {
				return this.optional(element) || /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/.test(value);
			}, "Your password is too simple.");
			$.validator.classRuleSettings.password = {password: true};
			
			$.validator.addMethod("password_confirm", function(value, element) {
				return this.optional(element) || value == $("#password").val();
			}, "The passwords do not match.");
			$.validator.classRuleSettings.password_confirm = {password_confirm: true};
			
			$.validator.addMethod("email_confirm", function(value, element) {
				return this.optional(element) || value == $("#email").val();
			}, "The emails do not match.");
			$.validator.classRuleSettings.password_confirm = {password_confirm: true};
			
			$.validator.addMethod("address", function(value, element) {
				return this.optional(element) || /^((G-)?[0-9]+)?\s([NSEW]\.\s)?[A-Za-z]+\s[A-Za-z]{2,4}\.$/.test(value);
			}, "Please enter a valid street address.");
			$.validator.classRuleSettings.address = {address: true};
			
			$.validator.addMethod("geocode", function(value, element) {
				return this.optional(element) || /^[-]?[0-9]{2}.[0-9]{4}$/.test(value);
			}, "Please enter a geocode in the format ##.####.");
			$.validator.classRuleSettings.geocode = {geocode: true};
			
			$.validator.methods.phone = function(value, element) {
				return this.optional(element) || /\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}/.test(value);
			};
			$.validator.messages.phone = "Please enter a valid phone number.";
			
			var messages = {
				site: "Please enter the name of the location.",
				category: "Please choose at least one category.",
				state: {
					statesUS: "Please enter a valid two-letter state abbreviation."
				},
				zipcode: {
					required: "Zipcode is required.",
					digits: "Only numbers are allowed.",
					minlength: "The zipcode must be exactly five digits.",
					maxlength: "The zipcode must be exactly five digits."
				},
				latitude: {
					required: "Latitude is required."
				},
				longitude: {
					required: "Longitude is required."
				},
				phone: {
					phone: "Please enter a valid phone number."
				},
				notes: {
					maxlength: "Only 600 characters are allowed."
				}
			};
			
			/* EDIT PAGE FORMS */
			if ($pageId.indexOf("edit") != -1) {
				$("#location_form .char_count").html("<span>Characters remaining:</span> " + (600 - $("#location_form #notes").val().length));
				$("#location_form #notes").on("keyup", function(event) {
					$(".char_count").html("<span>Characters remaining:</span> " + (600 - $(this).val().length));
				});
			
				$("#edit_resources").on("show.bs.collapse", function() {
					$("#location_form").resetForm();
					// add instructions
					$("#edit_resources .panel-body #instructions").removeClass("hide");
					// hide all alerts
					$("#location_form .alert").remove();
					// move the form into the edit section when opened
					$("#edit_resources .panel-body").append($("#location_form"));
					// hide the location list for the edit form
					$("#location_form #location_list").removeClass("hide");
					// enable the address field
					$("#location_form #address").attr("disabled", "disabled");
					$("#location_form #address").next().addClass("hide");
				});
				
				$("#new_resources").on("show.bs.collapse", function() {
					$("#location_form").resetForm();					
					// remove instructions
					$("#edit_resources .panel-body #instructions").addClass("hide");
					// hide all alerts
					$("#location_form .alert").remove();
					// move the form into the new section when opened
					$("#new_resources .panel-body").append($("#location_form"));
					// display the location list for the edit form
					$("#location_form #location_list").addClass("hide");
					// enable the address field
					$("#location_form #address").removeAttr("disabled");
					$("#location_form #address").next().removeClass("hide");
				});
				
				if ($("#location_form #location_list select").children().length == 0)
					$("#location_form #location_list button").addClass("disabled");
				else
					$("#location_form #location_list button").removeClass("disabled");
				
				$("#location_form #location_list button").on("click", function() {
					$.ajax({
						type: "POST",
						url: "includes/functions.php",
						data: {"type": "edit_resource_load", "location": $("#location_form #location_list select").val()}
					}).done(function(data) {
						//reset the form
						$("#location_form").resetForm();
						
						var js_obj = $.parseJSON(data);
						$("#location_form #location_list select").val(js_obj.location[0].aidAddress);
						
						$("#location_form #site").val(js_obj.location[0].locationName);
						$("#location_form #category_options input").val(js_obj.location[0].resType);
						$("#location_form #address").val(js_obj.location[0].aidAddress);
						$("#location_form #city").val(js_obj.location[0].city);
						$("#location_form #zipcode").val(js_obj.location[0].zipcode);
						$("#location_form #latitude").val(js_obj.location[0].latitude);
						$("#location_form #longitude").val(js_obj.location[0].longitude);
						$("#location_form #phone").val(js_obj.location[0].phone);
						$("#location_form #hours").val(js_obj.location[0].hours);
						$("#location_form #notes").val(js_obj.location[0].notes);
					});
				});
			
				$("#location_form").validate({
					debug: false,
					errorPlacement: function(error, element) {
						element.parent().append(error);
					},
					rules: {
						site: "required",
						address: {
							required: true,
							address: true
						},
						category: {
							required: true,
							minlength: 1
						},
						state: {
							stateUS: true
						},
						zipcode: {
							required: true,
							digits: true,
							minlength: 5,
							maxlength: 5
						},
						latitude: {
							required: true,
							geocode: true
						},
						longitude: {
							required: true,
							geocode: true
						},
						phone: {
							required: false,
							phone: true
						},
						notes: {
							required: false,
							maxlength: 600
						}
					},
					messages: messages,
					submitHandler: function(form) {
						var location_form_type;
						
						if ($("#new_resources #location_form").length == 1)
							location_form_type = "new_resource";
						else
							location_form_type = "edit_resource_submit";
							
						$(form).ajaxSubmit({
							type: "POST",
							url: "includes/functions.php",
							data: {"type": location_form_type, "address": form.address.value},
							success: function(resp) {
								if (resp.indexOf("0") != -1) {
									$("#location_form").append(genericError);
								}
								else {
									$("#location_form .alert").remove();
									
									var msg;
									
									if ($("#new_resources").hasClass("in")) {
										msg = "<div class='alert alert-success' role='alert'>\"" + form.address.value + "\" was successfully added.</div>";
										
										// update location list
										$.ajax({
											type: "POST",
											url: "includes/functions.php",
											data: {"type": "load_resource_locations"}
										}).done(function(data) {
											$("#location_form select[name='location_menu'] option, #delete_form select[name='location_menu'] option").remove();
											$("#location_form select[name='location_menu'], #delete_form select[name='location_menu']").html(data);
										});
										
										$("#location_form").resetForm();
									}
									else {
										msg = "<div class='alert alert-success' role='alert'>\"" + form.address.value + "\" was successfully updated.</div>";
									}
									
									$("#location_form").append(msg);											
								}
							}
						});
						
						return false;
					}
				});
			
				$("#delete_form select").on("change", function() {
					if ($(this).val() != "")
						$("#delete_form button").removeAttr("disabled");
					else
						$("#delete_form button").attr("disabled", "disabled");
				});
				
				$("#delete_form").on("submit", function() {
					var location = $("#delete_form select").val();						
					var delete_confirm = confirm("Are you sure you want to delete \"" + location + "\"? This action cannot be undone.");
					
					if (delete_confirm == true) {						
						$(this).ajaxSubmit({
							type: "POST",
							url: "includes/functions.php",
							data: {"type": "delete_resource", "location": location},
							success: function(resp) {
								if (resp.indexOf("1") != -1) {
									$("#delete_form .alert").remove();
									$("#delete_form select[name='location_menu'] option[value='" + location + "']").remove();
									$("#delete_form select").val("");
									$("#delete_form .alert-info, #delete_form .alert-danger").hide();
									$("#delete_form").append("<div class='alert alert-success' role='alert'>\"" + location + "\" was successfully deleted.</div>");
									$("#delete_form").resetForm();
								}
								else
									$("#delete_form").append(genericError);
							}
						});
						
						return false; 
					}
					else
						$("#delete_form").append("<div class='alert alert-info' role='alert'>\"Delete location\" was canceled.</div>");
					
					return false;
				});
			}
			/* PROFILE & USERS PAGE */
			else if (($pageId.indexOf("profile") != -1) || ($pageId.indexOf("users") != -1)) {
				var rules;
				
				if ($pageId.indexOf("profile") != -1) {
					rules = {
						phone: {
							required: false,
							phone: true
						},
						address: {
							required: false,
							address: true
						},
						state: {
							required: false,
							stateUS: true
						},
						zipcode: {
							required: false,
							digits: true,
							minlength: 5,
							maxlength: 5
						}
					};
				}
				else {
					rules = {
						email: {
							required: true,
							email: true
						},
						phone: {
							required: false,
							phone: true
						},
						address: {
							required: false,
							address: true
						},
						state: {
							required: false,
							stateUS: true
						},
						zipcode: {
							required: false,
							digits: true,
							minlength: 5,
							maxlength: 5
						}
					};
				}
			
				$("#user_form form").validate({
					debug: true,
					errorPlacement: function(error, element) {
						error.appendTo(element.parent());
					},
					rules: rules,
					messages: messages,
					submitHandler: function(form) {
						$("#user_form form .alert").remove();
						
						var showInfo;
						
						if ($("#user_form #show_info input:checked").val() === "yes")
							showInfo = true;
						else
							showInfo = false;
						
						
						var data;
					
						if ($pageId.indexOf("profile") != -1) {
							data = {
								"firstName": $("#user_form #first_name").val(),
								"lastName": $("#user_form #last_name").val(),
								"phone": $("#user_form #phone").val(),
								"title": $("#user_form #title").val(),
								"dept": $("#user_form #dept").val(),
								"address": {
									"bldg": $("#user_form #bldg").val(),
									"streetAddr": $("#user_form #address").val(),
									"city": $("#user_form #city").val(), 
									"state": $("#user_form #state").val(),
									"zipcode": $("#user_form #zipcode").val()
								},
								"showInfo": showInfo
							};
							
							var userRef = db.ref("users/" + firebase.auth().currentUser.uid);
							var result = userRef.update(data).then(function() {
								$("#user_form form").append("<div class='alert alert-success' role='alert'>Your information was successfully updated.</div>");
							}, function() {
								$("#user_form form").append(genericError);
							});
						}
						else {
							data = {
								"role": $("#user_form #user_group_dropdown").val(),
								"firstName": $("#user_form #first_name").val(),
								"lastName": $("#user_form #last_name").val(),
								"email": $("#user_form #email").val(),
								"phone": $("#user_form #phone").val(),
								"title": $("#user_form #title").val(),
								"dept": $("#user_form #dept").val(),
								"address": {
									"bldg": $("#user_form #bldg").val(),
									"streetAddr": $("#user_form #address").val(),
									"city": $("#user_form #city").val(), 
									"state": $("#user_form #state").val(),
									"zipcode": $("#user_form #zipcode").val()
								},
								"showInfo": showInfo
							};
							
							/* Create a second connection to create the new user. 
							 * From: http://stackoverflow.com/questions/37517208/firebase-kicks-out-current-user/38013551#38013551
							 */
							if (!secondaryApp)
								var secondaryApp = firebase.initializeApp(config, "Secondary");
							
							// randomly generate a new temp password
							var password = Math.random().toString(36).slice(-8);

							secondaryApp.auth().createUserWithEmailAndPassword($("#user_form #email").val(), password).then(function(firebaseUser) {
								/* Update the users node. */
								db.ref("users/" + firebaseUser.uid).update(data).then(function() {
									/* Update the rules node. */
									var roleData = {};
									roleData[firebaseUser.uid] = "true";
									var rolesRef = db.ref("roles/" + $("#user_form #user_group_dropdown").val());
									rolesRef.update(roleData);
									
									$("#user_form form").append("<div class='alert alert-success' role='alert'>The user was successfully added.</div>");
									
									// send an email to the user
									$.ajax({
										type: "POST",
										url: "includes/functions.php",
										data: {"type": "new_user_email", "email": $("#user_form #email").val()}
									});
									
									$("#user_form form").resetForm();
									
								}, function() {
									$("#user_form form").append(genericError);
								});
							}).catch(function(error) {
								$("#user_form form").append(genericError);
							});
						}
					}
				});
				
				$("#change_email form").validate({
					debug: true,
					errorPlacement: function(error, element) {
						error.appendTo(element.parent());
					},
					rules: {
						email: {
							required: true,
							email: true
						},
						email_confirm: {
							required: true,
							email_confirm: true
						}
					},
					messages: messages,
					submitHandler: function(form) {						
						firebase.auth().currentUser.updateEmail($("#change_email #email").val()).then(function() {
							$("#change_email .alert").addClass("hide");
							$("#change_email form").append("<div class='alert alert-success' role='alert'>\"Your email address was successfully updated.</div>");
							
							firebase.auth().currentUser.sendEmailVerification();
							var userRef = db.ref("users/" + firebase.auth().currentUser.uid);
							userRef.update({"email": $("#change_email #email").val()});
							
							// clear fields
							$("#change_email #email").val("");
							$("#change_email #email_confirm").val("");
						},
						function(error) {
							if (error) {								
								if (error.code === "auth/email-already-in-use")
									$("#change_email form").append("<div class='alert alert-danger' role='alert'>This email address is already in use by a different account.</div>");			
								else if (error.code === "auth/requires-recent-login") {
									$("#change_email form").append("<div class='alert alert-danger' role='alert'>Your login is not recent. As this is a security sensitive operation, you must sign out then log in again to change your email address.</div>");
								}
							}
						});
					}
				});
				
				$("#change_password form").validate({
					debug: true,
					errorPlacement: function(error, element) {
						error.appendTo(element.parent());
					},
					rules: {
						password: {
							required: true,
							password: true
						},
						password_confirm: {
							required: true,
							password_confirm: true
						}
					},
					messages: messages,
					submitHandler: function(form) {
						firebase.auth().currentUser.updatePassword($("#change_password #password").val()).then(function() {
							$("#change_password .alert").addClass("hide");
							$("#change_password form").append("<div class='alert alert-success' role='alert'>\"Your password was successfully updated.</div>");
							
							// clear fields
							$("#change_password #password").val("");
							$("#change_password #password_confirm").val("");
						},
						function(error) {
							if (error) {		
								if (error.code === "auth/requires-recent-login") {
									$("#change_password form").append("<div class='alert alert-danger' role='alert'>Your login is not recent. As this is a security sensitive operation, sign out then log in again to change your password.</div>");
								}
							}
						});
					}
				});
			}
			/* REPORT PAGE */
			else if ($pageId.indexOf("report") != -1) {					
				$.validator.addMethod("aggregation", function(value, element) {
					return this.optional(element) || ($("#group_by").val() !== "" && $("#aggregation").val() !== "");
				}, "A group by option must also be selected.");
				$.validator.classRuleSettings.aggregation = {aggregation: true};
				
				$.validator.addMethod("group_by", function(value, element) {
					return this.optional(element) || ($("#group_by").val() !== "" && $("#aggregation").val() !== "");
				}, "An aggregation option must also be selected.");
				$.validator.classRuleSettings.group_by = {group_by: true};
				
				$.validator.addMethod("lead_less", function(value, element) {
					return this.optional(element) || value > $("#lead_greater").val();
				}, "\"Less than\" value must be greater than the\"greater than\" value.");
				$.validator.classRuleSettings.lead_less = {lead_less: true};

				$.validator.addMethod("lead_greater", function(value, element) {
					return this.optional(element) || value < $("#lead_less").val();
				}, "\"Greater than\" value must be less than the \"less than\" value.");
				$.validator.classRuleSettings.lead_greater = {lead_greater: true};

				$.validator.addMethod("copper_less", function(value, element) {
					return this.optional(element) || value > $("#copper_greater").val();
				}, "\"Less than\" value must be greater than the\"greater than\" value.");
				$.validator.classRuleSettings.copper_less = {copper_less: true};

				$.validator.addMethod("copper_greater", function(value, element) {
					return this.optional(element) || value < $("#copper_less").val();
				}, "\"Greater than\" value must be less than the \"less than\" value.");
				$.validator.classRuleSettings.copper_greater = {copper_greater: true};
				
				
				validator = $("#water_tests_form").validate({
					debug: true,
					errorPlacement: function(error, element) {
						element.parent().append(error);
					},
					rules: {
						years: "required",
						months: "required",
						aggregation: {
							required: false,
							aggregation: true
						},
						group_by: {
							required: false,
							group_by: true
						},
						lead_less: {
							required: false,
							digits: true,
							min: 1,
							lead_less: true
						},
						lead_greater: {
							required: false,
							digits: true,
							min: 0,
							lead_greater: true
						},
						copper_less: {
							required: false,
							digits: true,
							min: 1,
							copper_less: true
						},
						copper_greater: {
							required: false,
							digits: true,
							min: 0,
							copper_greater: true
						}
					},
					submitHandler: function(form) {						
						$(".loader").css("margin-top", "15px").appendTo("#water_tests_form");
						
						$(form).ajaxSubmit({
							type: "POST",
							data: {
								"report_type": $(".nav button[class*=active]").attr("id"),
								"uid": firebase.auth().currentUser.uid
							},
							dataType: "json",
							url: "includes/functions.php",
							success: function(data) {
								console.log(firebase.auth().currentUser.uid);
								
								var content;
								var total_results = data.water_tests.length;
								
								if (total_results > 0) {
									content = "<p>Result Set: " + total_results + " records</p>";
									
									content += "<button id='print_report' type='button' class='btn btn-default' href='#'>Print</button> <button id='create_csv' type='button' class='btn btn-default' href='#'>Export as CSV</button>";
									
									content += "<div class=\"table-responsive\"> \
										<table id=\"table_header\" class=\"table\"> \
											<tr> \
												<th class=\"record_number\">&nbsp;</th> \
												<th class=\"address\">Address</th> \
												<th class=\"lead_level\">Lead Level (ppb)</th> \
												<th class=\"copper_level\">Copper Level (ppb)</th> \
												<th class=\"date\">Date Submtted</th> \
												<th></th> \
											</tr> \
										</table> \
										\
										<div id='scrollbox'> \
										<table id=\"table_body\" class=\"table\">";
									
									for (var i=0; i<total_results; i++) {
										var temp = data.water_tests[i];
										
										content += "<tr> \
											<td class=\"record_number\">" + (i+1) + "</td> \
											<td class=\"address\">" + temp.address + "</td> \
											<td class=\"lead_level\">" + temp.leadLevel + "</td> \
											<td class=\"copper_level\">" + temp.copperLevel + "</td> \
											<td class=\"date\">" + temp.dateUpdated + "</td> \
										</tr>";
									}
											
									content += "</table></div></div>";
								}
								else
									content = "There is no data available.";
								
								$(".loader").addClass("hide");
								
								$("#display_area").html(content);
								$("#display_area").removeClass("hide");
								$("#report_area #display_area #scrollbox").css({
									"margin-top": $("#report_area #display_area #table_header").css("height"),
									"height": (windowHeight * 0.75) + "px"
								});
								
								$("#create_csv").on("click", function(event) {
									$("#create_csv").siblings(".alert").remove();
									
									$.ajax({
										type: "POST",
										url: "includes/functions.php",
										data: {
											"report_type": $(".nav button[class*=active]").attr("id"),
											"uid": firebase.auth().currentUser.uid,
											"email": userObj.email
											}
									}).done(function(data) {
										$("#create_csv").after("<div class='alert alert-success' role='alert'>The CSV file will be emailed to you within 1 hour.</div>");
									}).fail(function(data) {
										$("#create_csv").after(genericError);
									});
									
									/*event.stopPropagation();
									
									var form = $("<form></form>");
									$(form).attr("method", "post").attr("target", "_blank").attr("action", "includes/spreadsheet_download.php");
									var type_input = $("<input type='hidden' name='report_type' />").val($(".nav button[class*=active]").attr("id"));
									var pid_input = $("<input type='hidden' name='uid' />").val(firebase.auth().currentUser.uid);
									var email_input = $("<input type='hidden' name='email' />").val(userObj.email);
									$(form).append(type_input, pid_input, email_input);
									$(form).appendTo("body").submit();*/
								});
							}
						});
						
						return false;
					}
				});
				
				/* Revalidate the aggregation and group by dropdowns if either changes. */
				$("#aggregation, #group_by").on("change", function() {
					validator.element("#aggregation");
					validator.element("#group_by");
				});
				
				/* Revalidate all limit inputs if any of them changes. */
				$("#lead_less, #lead_greater, #copper_less, #copper_greater").on("keyup", function() {
					validator.element("#lead_less");
					validator.element("#lead_greater");
					validator.element("#copper_less");
					validator.element("#copper_greater");
				});
			}
			
			
			/* CONTACT FORM */
			$("#contact_form form").validate({
				debug: false,
				errorPlacement: function(error, element) {
					element.parent().append(error);
				},
				rules: {
					email: {
						required: false,
						email: true
					},
					comments: {
						required: true,
						minlength: 20
					}
				},
				submitHandler: function(form) {
					$(form).ajaxSubmit({
						type: "POST",
						url: "includes/functions.php",
						data: {"type": "contact_form"},
						success: function(resp) {
							if (resp.indexOf("1") != -1) {
								$("#contact_form #email, #contact_form #comments").val("");
								$("#contact_form form").html("<div class='alert alert-success' role='alert'>Your comment was successfully sent.</div>");
							}
							else {
								$("#contact_form").append(genericError);
							}
						}
					});
					
					return false;
				}
			});
		});
	});
	
	/* NAVIGATION LINKS */
	$("#dashboard_link").on("click", function() {
		var form = $("<form></form>");
		$(form).attr("method", "post").attr("action", "page.php");
		var pid_input = $("<input type='hidden' name='pid' />").val("dashboard");
		var role_input = $("<input type='hidden' name='role' />").val(userObj.role);
		$(form).append(pid_input, role_input);
		$(form).appendTo("body").submit();
	});
	
	$("#reports_link").on("click", function() {
		var form = $("<form></form>");
		$(form).attr("method", "post").attr("action", "page.php");
		var pid_input = $("<input type='hidden' name='pid' />").val("reports");
		var role_input = $("<input type='hidden' name='role' />").val(userObj.role);
		$(form).append(pid_input, role_input);
		$(form).appendTo("body").submit();
	});
	
	$("#edit_link").on("click", function() {
		var form = $("<form></form>");
		$(form).attr("method", "post").attr("action", "page.php");
		var pid_input = $("<input type='hidden' name='pid' />").val("edit");
		var role_input = $("<input type='hidden' name='role' />").val(userObj.role);
		$(form).append(pid_input, role_input);
		$(form).appendTo("body").submit();
	});
	
	$("#alerts_link").on("click", function() {
		var form = $("<form></form>");
		$(form).attr("method", "post").attr("action", "page.php");
		var pid_input = $("<input type='hidden' name='pid' />").val("alerts");
		var role_input = $("<input type='hidden' name='role' />").val(userObj.role);
		$(form).append(pid_input, role_input);
		$(form).appendTo("body").submit();
	});
	
	$("#users_link").on("click", function() {
		var form = $("<form></form>");
		$(form).attr("method", "post").attr("action", "page.php");
		var pid_input = $("<input type='hidden' name='pid' />").val("users");
		var role_input = $("<input type='hidden' name='role' />").val(userObj.role);
		$(form).append(pid_input, role_input);
		$(form).appendTo("body").submit();
	});
	
	$("#profile_link").on("click", function() {
		var form = $("<form></form>");
		$(form).attr("method", "post").attr("action", "page.php");
		var pid_input = $("<input type='hidden' name='pid' />").val("profile");
		var role_input = $("<input type='hidden' name='role' />").val(userObj.role);
		$(form).append(pid_input, role_input);
		$(form).appendTo("body").submit();
	});
	
	$("#logout_link").on("click", function() {
		userLogout();
	});
	
	/* Footer Links */
	$("#about_link").on("click", function() {
		var form = $("<form></form>");
		$(form).attr("method", "post").attr("action", "page.php");
		$(form).append($("<input type='hidden' name='pid' />").val("about"));
		$(form).appendTo("body").submit();
	});
	
	$("#disclaimer_link").on("click", function() {
		var form = $("<form></form>");
		$(form).attr("method", "post").attr("action", "page.php");
		$(form).append($("<input type='hidden' name='pid' />").val("disclaimer"));
		$(form).appendTo("body").submit();
	});
	
	$("#privacy_link").on("click", function() {
		var form = $("<form></form>");
		$(form).attr("method", "post").attr("action", "page.php");
		$(form).append($("<input type='hidden' name='pid' />").val("privacy"));
		$(form).appendTo("body").submit();
	});
	
	$("#login_link").on("click", function() {
		var form = $("<form></form>");
		$(form).attr("method", "post").attr("action", "login.php");
		$(form).appendTo("body").submit();
	});
})(jQuery);

/* Logout the current user. */
function userLogout() {
	firebase.auth().signOut().then(function(user) {
		// redirect to the login page
		window.location.href="login.php";
	}, function(error) {
		console.log(error);
	});
}