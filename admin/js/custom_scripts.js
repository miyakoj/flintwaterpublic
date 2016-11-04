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
var form_api = "http://malsup.github.io/min/jquery.form.min.js";
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
	
	/* Dynamically load external scripts. */
	if ($pageId.indexOf("dashboard") == -1) {
		$.ajax({
			type: "GET",
			url: form_api,
			dataType: "script",
			cache: true
		});
	}
	
	if (($pageId.indexOf("edit") != -1) || ($pageId.indexOf("alerts") != -1) || ($pageId.indexOf("users") != -1) || ($pageId.indexOf("profile") != -1)) {		
		/*$.ajax({
			type: "GET",
			url: form_validation_addl_js,
			dataType: "script",
			cache: true
		});*/
	}
	
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
					ttile: title,
					showInfo: showInfo,
					role: role
				};					
				userObj = authUser;
				
				$(".name-caret").text("Hello, " + authUser.firstName);
				$("#wrapper").removeClass("hide");
			}).then(function() {
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
	
	if ($pageId.indexOf("login") != -1) {
		$("form").on("submit", function(event) {
			var email = $("#login_email input").val();
			var password = $("#login_password input").val();
		
			// if reset password is unchecked, do normal sign in
			if ($("#forgot_password input").prop("checked") == false) {
				firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
					$(".alert").addClass("hide");

					decodeIDToken(firebase.auth().currentUser.uid, "login");
				},
				function(error) {
					if (error) {
						var errorCode = error.code;
						var errorMsg;
						
						$(".alert-danger").addClass("hide");

						if (errorCode === "auth/wrong-password")
							errorMsg = "<div class='alert alert-danger' role='alert'>Your password is incorrect.</div>";			
						else if (errorCode === "auth/invalid-email")
							errorMsg = "<div class='alert alert-danger' role='alert'>Your email address is invalid.</div>";
						else if (errorCode === "auth/user-not-found")
							errorMsg = "<div class='alert alert-danger' role='alert'>There is no user account associated with this email address.</div>";
						else if (errorCode  === "auth/too-many-requests") {
							$("#login_email input").addClass("disable");
							$("#login_password input").addClass("disable");
							$("#forgot_password input").addClass("disable");
							$(".login-do input").addClass("disable");
							
							errorMsg = "<div class='alert alert-danger' role='alert'>You have run out of login attempts. Please try again later.</div>";
						}
						else
							errorMsg = genericError;
						
						$("form").append(errorMsg);

						console.log(error);
					}
				}).then(function() {
					
				});
			}
			else {
				auth.sendPasswordResetEmail(email).then(function() {
					$("form").append("<div class='alert alert-success' role='alert'>A password reset email has been sent.</div>");
				}, function(error) {
					$("form").append(genericError);
				});
			}
			
			event.preventDefault();
		});
	}
	else if ($pageId.indexOf("dashboard") != -1) {		
		/* Scale the popup markers based on screen size. */
		$(".marker_popup_icons").css({"width": "30px", "height": "auto"});
		$("#211_info").addClass("hide");
	}
	else if ($pageId.indexOf("edit") != -1) {		
		/*var edit_instructions = "Click \"Load Locations\" to retrieve a list of all locations in the database then select the item you want to update.";
		var delete_instructions = "Click \"Load Locations\" to retrieve a list of all locations in the database then select the item you want to delete.";
		$("#edit_form").prepend("<div class='alert alert-info' role='alert'>" + edit_instructions + "</div>");
		$("#delete_form").prepend("<div class='alert alert-info' role='alert'>" + delete_instructions + "</div>");*/
		
		$.ajax({
			type: "GET",
			url: form_validation_api,
			dataType: "script",
			cache: true
		}).done(function() {
			if ($("#new_resources").hasClass("in")) {
				// move the form into the new section when opened
				$("#new_resources .panel-body").append($("#location_form"));
				// display the location list for the edit form
				$("#location_form #location_list").addClass("hide");
				$("#location_form #address").removeAttr("disabled");
				$("#location_form #address").next().removeClass("hide")
			}
			
			if ($("#location_form #location_list select").children().length == 0)
				$("#location_form #location_list button").addClass("disabled");
			else
				$("#location_form #location_list button").removeClass("disabled");
			
			//2804 N. Franklin Ave.
			
			$("#location_form #location_list button").on("click", function() {
				$.ajax({
					type: "POST",
					url: "includes/functions.php",
					data: {"resource_form_type": "edit_resource_load", "location": $("#location_form #location_list select").val()}
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
			
			$.validator.addMethod("address", function(value, element) {
				return this.optional(element) || /^[G-]*[0-9]+ [A-Z.]* [A-Za-z]+ [A-Za-z.]+/.test(value);
			}, "Please enter a street address.");
			
			$.validator.addMethod("geocode", function(value, element) {
				return this.optional(element) || /[-]*[0-9]{2}.[0-9]{4}/.test(value);
			}, "Please enter a geocode in the format ##.####.");
			
			$.validator.methods.phone = function(value, element) {
				return this.optional(element) || /\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}/.test(value);
			};
			
			$("#location_form .char_count").html("<span>Characters remaining:</span> 600");
			$("#location_form #notes").on("keyup", function(event) {
				$(".char_count").html("<span>Characters remaining:</span> " + (600 - $(this).val().length));
			});
			
			jQuery.validator.addClassRules({
				site: "required",
				address: {
					required: true,
					address: true
				},
				category: {
					required: true,
					minlength: 1
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
			});
			
			$("#edit_resources #location_form").validate({
				debug: true,
				errorPlacement: function(error, element) {
					error.appendTo(element.parent());
				},
				messages: {
					site: "Please enter the name of the location.",
					category: "Please choose at least one category.",
					zipcode: {
						required: "Zipcode is required.",
						digits: true,
						minlength: "The zipcode must be exactly five digits.",
						maxlength: "The zipcode must be exactly five digits."
					},
					latitude: "Latitude is required.",
					longitude: "Longitude is required.",
					phone: {
						phone: "Please enter a valid phone number."
					},
					notes: {
						maxlength: "Only 600 characters are allowed."
					}
				},
				submitHandler: function(form) {
					var categories = [];
					
					for (var i=0; i<form.category.length; i++) {
						if (form.category[i].checked)
							categories.push(form.category[i].value);
					}
						
					$.ajax({
						type: "POST",
						url: "includes/functions.php",
						data: {
							"resource_form_type": "edit_resource_submit",
							"site": form.site.value,
							"categories": categories,
							"address": form.address.value,
							"city": form.city.value,
							"zipcode": form.zipcode.value,
							"latitude": form.latitude.value,
							"longitude": form.longitude.value,
							"phone": form.phone.value,
							"hours": form.hours.value,
							"notes": form.notes.value
						}						
					}).done(function(resp) {
						if (resp.indexOf("1") != -1) {
							$("#location_form alert").remove();
							$("#location_form").append("<div class='alert alert-success' role='alert'>\"" + form.address.value + "\" was successfully updated.</div>");
							
							if ($("#new_resources").hasClass("in"))
								$("#location_form").resetForm();
						}
						else {
							$("#delete_form").append(genericError);
						}
					});
				}
			});
			
			$("#delete_form").validate({
				debug: true,
				submitHandler: function(form) {
					var location = form.location_menu.value;						
					var delete_confirm = confirm("Are you sure you want to delete \"" + location + "\"? This action cannot be undone.");
					
					//2320 Pierson St.
					
					if (delete_confirm == true) {						
						$.ajax({
							type: "POST",
							url: "includes/functions.php",
							data: {"resource_form_type": "delete", "location": location}
						}).done(function(resp) {
							if (resp.indexOf("1") != -1) {
								$("#delete_form select[name='location_menu'] option[value='" + location + "']").remove();
								$("#delete_form select").val("");
								$("#delete_form .alert-info, #delete_form .alert-danger").hide();
								$("#delete_form").append("<div class='alert alert-success' role='alert'>\"" + location + "\" was successfully deleted.</div>");
								$("#delete_form").resetForm();
							}
							else
								$("#delete_form").append(genericError);
						});
					}
					else
						$("#delete_form").append("<div class='alert alert-info' role='alert'>\"Delete location\" was canceled.</div>");
				}
			});
		});
	}
	
	/* Navigation Links */
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
	
	$("#contact_link").on("click", function() {
		$("#comments_form").modal("show");
	});
})(jQuery);

function decodeIDToken(uid, requestType) {
	firebase.auth().currentUser.getToken(true).then(function(token) {
		$.ajax({
			type: "POST",
			url: "includes/verify_ID_token.php",
			data: {"uid": uid, "token": token}
		}).done(function(data) {
			// store the token in a global user object if it's valid
			if (data.indexOf("1") != -1) {
				// store the token in local storage along with the current time
				//if (typeof(Storage) !== "undefined")
					//localStorage.setItem("ID_token", token);
				
				db.ref("users/" + uid).once("value").then(function(snapshot) {
					// load the dashboard page
					if (requestType.indexOf("login") != -1) {
						var form = $("<form></form>");
						$(form).attr("method", "post").attr("action", "page.php");
						var pid_input = $("<input type='hidden' name='pid' />").val("dashboard");
						var role_input = $("<input type='hidden' name='role' />").val(snapshot.val().role);
						$(form).append(pid_input, role_input);
						$(form).appendTo("body").submit();
					}
				},
				function(error) {
					$(".alert-danger").addClass("hide");
					$("form").append(genericError);
				});
			}
			// the token is expired
			else if (data.indexOf("2") != -1) {

			}
			// ask the user to sign in again if invalid
			else {
				$(".alert-danger").addClass("hide");
				$("form").append(genericError);
			}
		});
	}).catch(function(error) {
		$(".alert-danger").addClass("hide");
		$("form").append(genericError);
	});
}

/* Logout the current user. */
function userLogout() {
	firebase.auth().signOut().then(function(user) {
		// redirect to the login page
		window.location.href="login.php";
	}, function(error) {
		console.log(error);
	});
}