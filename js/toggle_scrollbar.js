$(document).ready(function() {
	var windowWidth = window.innerWidth;
	
	if (windowWidth < 1200) {
		var hidWidth;
		var scrollBarWidths = 40;
		var numItems = $(".list").children().length;
		var placeCounter = 0;

		var lengthOfScroll = function(){
			return $('.list label').outerWidth();
		};

		var widthOfList = function(){
			var itemsWidth = 0;
		  $('.list label').each(function(){
			var itemWidth = $(this).outerWidth();
			itemsWidth+=itemWidth;
		  });
		  return itemsWidth;
		};

		$('.list label').css('numItems', windowWidth/numItems);

		var widthOfHidden = function(){
		  return (($('.wrapper').outerWidth())-widthOfList()-getLeftPosi())-scrollBarWidths;
		};

		var getLeftPosi = function(){
		  return $('.list').position().left;
		};

		var reAdjust = function(){
		  if (($('.wrapper').outerWidth()) < widthOfList()) {
			$('.scroller-right').show();
		  }
		  else {
			$('.scroller-right').hide();
		  }
		  
		  if (getLeftPosi()<0) {
			$('.scroller-left').show();
		  }
		  else {
			$('label').animate({left:"-="+getLeftPosi()+"px"},'slow');
			$('.scroller-left').hide();
		  }
		}

		reAdjust();

		$(window).on('resize',function(e){ 
			reAdjust();
		});

		$('.scroller-right').click(function() {
		 if (placeCounter < widthOfList()){
		  $('.scroller-left').fadeIn('slow');
		  $('.scroller-right').fadeIn('slow');
		  placeCounter += ($('.wrapper').outerWidth()-scrollBarWidths);
		  $('.list').animate({left:"-="+lengthOfScroll()+"px"},'slow',function(){
		  });
		  }
		  else {
			$('.scroller-left').fadeIn('slow');
			$('.scroller-right').fadeOut('slow');

			$('.list').animate({left:"+="+widthOfHidden()+"px"},'slow',function(){
			});
			}
		  });

		$('.scroller-left').click(function() {

		  if (placeCounter!==0) {
			$('.scroller-right').fadeIn('slow');
			$('.scroller-left').fadeIn('slow');
			placeCounter -= ($('.wrapper').outerWidth()-scrollBarWidths);

			$('.list').animate({left:"+="+lengthOfScroll()+"px"},'slow', function(){		
			});
		  }
			else {
			$('.scroller-right').fadeIn('slow');
			$('.scroller-left').fadeOut('slow');

			$('.list').animate({left:"-="+getLeftPosi()+"px"},'slow',function(){
			});
		  }
		});
	}
});