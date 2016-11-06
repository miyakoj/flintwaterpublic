var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var $pageId = $("body").attr("id").slice(0, $("body").attr("id").indexOf("_"));

var app;
var auth;
var db;
var userObj;

var browserError = "<div class='alert alert-danger' role='alert'>You are using an unsupported browser. We recommend using Firefox 45.3+ or Chrome 53+ for the best experience.</div>";
var genericError = "<div class='alert alert-danger' role='alert'>There was an error. Please try again later.</div>";

/* Dynamically load remote scripts only on pages where they're relevant. */
var map_api = "https://maps.googleapis.com/maps/api/js?key=AIzaSyA0qZMLnj11C0CFSo-xo6LwqsNB_hKwRbM&libraries=visualization,places";
var client_api = "https://apis.google.com/js/client.js?onload=setAPIKey";
var form_validation_api = "https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/jquery.validate.min.js";
var form_validation_addl_js = "https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/additional-methods.min.js";

/*if ($pageId.indexOf("dashboard") != -1) {
	$.ajax({
		type: "GET",
		url: client_api,
		dataType: "script",
		cache: true
	});
	
	$.ajax({
		type: "GET",
		url: map_api,
		dataType: "script",
		cache: true
	});
}*/

(function() {
    "use strict";
	
	$('#supported').text('Supported/allowed: ' + !!screenfull.enabled);

	if (!screenfull.enabled) {
		return false;
	}

	$('#toggle').click(function () {
		screenfull.toggle($('#container')[0]);
	});
	
	// Initialize Firebase
	var config = {
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
				
				$("#wrapper").removeClass("hide");
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
						mapWidth = $("#map").parent().width();
						mapHeight = mapWidth * 0.5;
					}
					else {			
						mapWidth = $("#map").parent().width();
						mapHeight = mapWidth * 0.65
					}
					
					$("#map").css({"width": mapWidth, "height": mapHeight});
					
					google.maps.event.trigger(map, "resize");
					map.setCenter({lat: 43.021, lng: -83.681});
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
					
					$("#edit_profile_form #user_group").val(user_group);
					$("#edit_profile_form #first_name").val(userObj.firstName);
					$("#edit_profile_form #last_name").val(userObj.lastName);
					$("#edit_profile_form #title").val(userObj.title);
					$("#edit_profile_form #email").val(userObj.email);
					$("#edit_profile_form #phone").val(userObj.phone);
					$("#edit_profile_form #dept").val(userObj.dept);
					$("#edit_profile_form #bldg").val(userObj.address.bldg);
					$("#edit_profile_form #address").val(userObj.address.streetAddr);
					$("#edit_profile_form #city").val(userObj.address.city);
					$("#edit_profile_form #zipcode").val(userObj.address.zipcode);
					$("#edit_profile_form #state").val(userObj.address.state);
					
					if (userObj.showInfo)
						show_info = "yes";
					else
						show_info = "no";
					
					$("#edit_profile_form #show_info input").val([show_info]);
				}
			});
		}
	});
	
	/* Various device size differences. */
	if (windowWidth < 768) {
	}
	else {
		$("#location_card").css({
			left: (($("#map").width() / 2) - ($("#location_card").width() / 2)) + "px",
			bottom: (($("#map").height() / 2) + 10) + "px"
		});
	}
	
	if ($pageId.indexOf("dashboard") != -1) {
		
	}
	else if ($pageId.indexOf("users") != -1) {
		var content = "<table class='table table-striped'>";
		
		db.ref("users").once("value").then(function(snapshot) {
			content += "<tr>";
			content += "<tr><td></td>";
			content += "</tr>";
			console.log(snapshot.val());
		}).then(function () {
		});
		
		content = "</table>";
		
		//$("section").html(content);
	}
	
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
			/* PROFILE PAGE */
			else if ($pageId.indexOf("profile") != -1) {
				/* Enable all disabled form fields except the user group field. */
				$("#edit_profile form #edit_button").on("click", function() {
					for (var i=0; i<$("#edit_profile form")[0].elements.length; i++)
						$("#edit_profile form")[0].elements[i].disabled = false;
					
					// redisable the user group field
					$("#edit_profile form #user_group, #edit_profile_form #email").attr("disabled", "true");
					$("#edit_profile form #edit_button").addClass("hide");
					$(".help-block, #edit_profile_form #submit_button").removeClass("hide");
				});
			
				$("#edit_profile form").validate({
					debug: true,
					errorPlacement: function(error, element) {
						error.appendTo(element.parent());
					},
					rules: {
						email: {
							required: true,
							email: true
						},
						phone: {
							required: false,
							phone: true
						},
						address: {
							required: true,
							address: true
						},
						state: {
							required: true,
							stateUS: true
						},
						zipcode: {
							required: true,
							digits: true,
							minlength: 5,
							maxlength: 5
						}
					},
					messages: messages,
					submitHandler: function(form) {
						$("#edit_profile form .alert").remove();
						
						var showInfo;
						
						if ($("#edit_profile #show_info input").val().indexOf("yes") != -1)
							showInfo = true;
						else
							showInfo = false;
						
						var data = {
							"firstName": $("#edit_profile #first_name").val(),
							"lastName": $("#edit_profile #last_name").val(),
							"phone": $("#edit_profile #phone").val(),
							"title": $("#edit_profile #title").val(),
							"dept": $("#edit_profile #dept").val(),
							"address": {
								"bldg": $("#edit_profile #bldg").val(),
								"streetAddr": $("#edit_profile #address").val(),
								"city": $("#edit_profile #city").val(), 
								"state": $("#edit_profile #state").val(),
								"zipcode": $("#edit_profile #zipcode").val()
							},
							"showInfo": showInfo
						};
					
						var userRef = db.ref("users/" + firebase.auth().currentUser.uid);
						var result = userRef.update(data)
							.done(function() {
								$("#edit_profile form").append("<div class='alert alert-success' role='alert'>\"Your information was successfully updated.</div>");
							}).fail(function (error) {
								
							});
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
		var pid_input = $("<input type='hidden' name='pid' />").val("about");
		var role_input = $("<input type='hidden' name='role' />").val(userObj.role);
		$(form).append(pid_input, role_input);
		$(form).appendTo("body").submit();
	});
	
	$("#disclaimer_link").on("click", function() {
		var form = $("<form></form>");
		$(form).attr("method", "post").attr("action", "page.php");
		var pid_input = $("<input type='hidden' name='pid' />").val("disclaimer");
		var role_input = $("<input type='hidden' name='role' />").val(userObj.role);
		$(form).append(pid_input, role_input);
		$(form).appendTo("body").submit();
	});
	
	$("#privacy_link").on("click", function() {
		var form = $("<form></form>");
		$(form).attr("method", "post").attr("action", "page.php");
		var pid_input = $("<input type='hidden' name='pid' />").val("privacy");
		var role_input = $("<input type='hidden' name='role' />").val(userObj.role);
		$(form).append(pid_input, role_input);
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