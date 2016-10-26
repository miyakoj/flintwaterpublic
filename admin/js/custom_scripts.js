var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var $pageId = $("body").attr("id").slice(0, $("body").attr("id").indexOf("_"));

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
	
	/* custom scrollbar */
    /*$("html").niceScroll({styler:"fb",cursorcolor:"#242E56", cursorwidth: "6", cursorborderradius: "10px", background: "#F3F3F4", spacebarenabled:false, cursorborder: "0",  zindex: "1000"});

    $(".scrollbar1").niceScroll({styler:"fb",cursorcolor:"rgba(97, 100, 193, 0.78)", cursorwidth: "6", cursorborderradius: "0",autohidemode: "false", background: "#F1F1F1", spacebarenabled:false, cursorborder: "0"});
	
    $(".scrollbar1").getNiceScroll();
    if ($("body").hasClass("scrollbar1-collapsed")) {
        $(".scrollbar1").getNiceScroll().hide();
    }*/
	
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyAphuqStHEGm66EUi4fsdaU8OtOwuUnOrY",
		authDomain: "uniteflint.firebaseapp.com",
		databaseURL: "https://uniteflint.firebaseio.com",
		storageBucket: "uniteflint.appspot.com",
		messagingSenderId: "402781339047"
	};
	firebase.initializeApp(config);
	
	/* Dynamically generate page links. */
	var $id;
	var page;
	
	$("#main_menu a").each(function(i) {
		$id = $(this).attr("id");
		
		if (typeof($id) !== "undefined") {
			page = $id.slice(0, $id.indexOf("_"));

			if (page != "home")
				$(this).attr("href", "page.php?pid=" + page);
			else
				$(this).attr("href", "page.php?pid=dashboard");
		}
	});
	
	$("footer #copyright a").each(function(i) {
		$id = $(this).attr("id");
		
		if ($id.indexOf("_link") != -1) {		
			page = $id.slice(0, $id.indexOf("_"));
			$(this).attr("href", "page.php?pid=" + page);
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
		/* Size the map based on the window width and height. */		
		var mapWidth;
		var mapHeight;

		if (windowWidth < 768) {
			mapWidth = $("#map").parent().width();
			mapHeight = mapWidth * 0.5;
		}
		else {			
			mapWidth = $("#map").parent().width();
			mapHeight = $("#chart_area .row").height();
		}
		
		$("#map").css({"width": mapWidth, "height": mapHeight});
	}
	else if ($pageId.indexOf("login") != -1) {
		/* Logout the current user if still logged in. */
		firebase.auth().signOut().then(function() {
			console.log("logout was successful");
		}, function(error) {
			console.log(error);
		});
		
		$("form").on("submit", function(event) {
			var auth = firebase.auth();
			var email = $("#login_email input").val();
			var password = $("#login_password input").val();
		
			// if reset password is unchecked, do normal sign in
			if ($("#forgot_password input").prop("checked") == false) {
				firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
					$(".alert").addClass("hide");
					
					var user = firebase.auth().currentUser;
					
					if (user)
						decodeIDToken(user.uid);
				},
				function(error) {
					if (error) {
						var errorCode = error.code;
						var errorMessage = error.message;

						if (errorCode === "auth/wrong-password") {
							$(".alert-danger").addClass("hide");
							$("form").append("<div class='alert alert-danger' role='alert'>Your password is incorrect. Please try again.</div>");			
						}
						else if (errorCode  === "auth/too-many-requests") {
							$("#login_email input").addClass("disable");
							$("#login_password input").addClass("disable");
							$("#forgot_password input").addClass("disable");
							$(".login-do input").addClass("disable");
							
							$(".alert-danger").addClass("hide");
							$("form").append("<div class='alert alert-danger' role='alert'>You have run out of login attempts. Please try again later.</div>");
						}
						else
							console.log(errorMessage);

						console.log(error);
					}
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
			$("form").resetForm();
		});
	}
})(jQuery);

function decodeIDToken(uid) {
	firebase.auth().currentUser.getToken(true).then(function(token) {
		$.ajax({
			type: "POST",
			url: "includes/verify_ID_token.php",
			data: {"uid": uid, "token": token},
			cache: true
		}).then(function() {
			// store the token in browser local storage if it's valid
			//location.href = "page.php?pid=dashboard";
		});
	}).catch(function(error) {
		// sign the user out and ask them to try again
		$(".alert-danger").addClass("hide");
		$("form").append("<div class='alert alert-danger' role='alert'>There was an error. Please sign in again.</div>");
	});
}

function getCurrentUser() {	
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log(user);
		}
		else {
			// No user is signed in.
		}
	});
}