$(document).ready(function () {
	//stick in the fixed 100% height behind the navbar but don't wrap it
	$('#slide-nav .navbar-default').after($('<div id="navbar-height-col"></div>'));  

	// Enter your ids or classes
	var toggler = '.navbar-toggle';
	var pagewrapper = '#page_content';
	var navigationwrapper = '.navbar-header';
	var menuwidth = '100%'; // the menu inside the slide menu itself
	var slidewidth = '80%';
	var menuneg = '-100%';
	var slideneg = '-80%';


	$("#slide-nav").on("click", toggler, function (e) {

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