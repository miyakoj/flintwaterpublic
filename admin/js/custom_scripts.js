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
	
	if (($pageId.indexOf("login") != -1) || ($pageId.indexOf("reports") != -1)) {
		$.ajax({
			type: "GET",
			url: form_api,
			dataType: "script",
			cache: true
		}).then(function() {	
			
		});
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
				
				$(".name-caret").prepend("Hello, " + authUser.firstName);
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
		
	});
	
	$("#alerts_link").on("click", function() {
		
	});
	
	$("#users_link").on("click", function() {
		
	});
	
	$("#profile_link").on("click", function() {
		
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