$(document).ready(function () {
	//stick in the fixed 100% height behind the navbar but don't wrap it
	$('#slide-nav .navbar-default').after($('<div id="navbar-height-col"></div>'));  

	// Enter your ids or classes
	var toggler = '.navbar-toggle';
	var pagewrapper = '#page_content';
	var navigationwrapper = '.navbar-header';
	var menuwidth; // the menu inside the slide menu itself
	var slidewidth;
	var menuneg = '-100%';
	var slideneg;
	
	if (window.innerWidth <= 350) {
		$("#slide-nav #main_menu").css({
			left: "-80%",
			width: "80%"
		});
		$("#navbar-height-col").css({
			width: "80%",
			left: "-80%"
		});
		
		menuwidth = '80%';
		slidewidth = '80%';
		slideneg = '-80%';
	}
	else if (window.innerWidth <= 768) {
		$("#slide-nav #main_menu").css({
			left: "-60%",
			width: "60%"
		});

		$("#navbar-height-col").css({
			width: "60",
			left: "-60%"
		});
		
		menuwidth = '60';
		slidewidth = '60%';
		slideneg = '-60%';
	}


	$("#slide-nav").on("click", toggler, function (e) {
		$('#legend_card').toggle(400, 'linear');
		
		var selected = $(this).hasClass('slide-active');

		$('#main_menu').stop().animate({
			left: selected ? menuneg : '0px'
		});

		$('#navbar-height-col').stop().animate({
			left: selected ? slideneg : '0px'
		});

		$(pagewrapper).stop().animate({
			left: selected ? '0px' : slidewidth
		});

		$(navigationwrapper).stop().animate({
			left: selected ? '0px' : slidewidth
		});


		$(this).toggleClass('slide-active', !selected);
		$('#main_menu').toggleClass('slide-active');


		$('#page_content, .navbar, body, .navbar-header').toggleClass('slide-active');
	});

	var selected = '#main_menu, #page_content, body, .navbar, .navbar-header';

	$(window).on("resize", function () {
		if ($(window).width() > 767 && $('.navbar-toggle').is(':hidden')) {
			$(selected).removeClass('slide-active');
		}
	});
	
});