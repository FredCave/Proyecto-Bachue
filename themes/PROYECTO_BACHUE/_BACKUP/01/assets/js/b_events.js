/*****************************************************************************
    
	EVENTS
		1.   GENERAL
			1.1. INIT SMOOTHSCROLL
			1.2. NAV CLICK
			1.3. IMAGE GRID CLICK
		2.   NEWS
			2.1. NEWS IMAGE HOVER
		X.   WINDOW EVENTS

*****************************************************************************/

// TMP

$(document).on('lazybeforesizes', function(e){
	console.log(e);	
});


$( document ).ready(function() {

// 1.1. NAV CLICK

	$(document).on( "click", "#bottom_header a", function(e){
		e.preventDefault();
		var target = $(this).attr("href"),
			thisId = $(this).attr("data-id");
		navManager( target, thisId );
	});

// 1.3. IMAGE GRID CLICK

	$(document).on( "click", ".image_cell_toggle", function(){
		gridOpen( $(this) );
	});

// 1.4. IMAGE GRID CLOSE

	$(document).on( "click", ".grid_close", function(){
		gridClose( $(this) );
	});

// 2.1. NEWS IMAGE HOVER
	
	// $(".news_post").on( "mouseover", function(){
	// 	newsHover( $(this) );
	// });

// X.X. WINDOW EVENTS

	var winScroll;

	$(window).on("load", function(){
		// RESET SCROLL
		$("html, body").animate({
			scrollTop : 0
		}, 100 );
		// LOAD ABOUT
		sectionCheck( 0 );
		// newsImages();
		// gridManager();
	}).on('scroll', _.throttle(function() {
		winScroll = $(window).scrollTop();
		sectionCheck( winScroll );
	}, 1000 )).on( "resize", _.throttle(function(){
		$(".image_grid").each( function(){
			rowHeight ( $(this) );
		});
		imageManager();
		sectionMarkers(); // FOR NAV UNDERLINE
	}, 500 ));

	// SEPARATE UNTHROTTLED SCROLL EVENT JUST FOR BOTTOM HEADER
	$(window).on( "scroll", function(){
		winScroll = $(window).scrollTop();
		bottomHeader( winScroll );
	});

	// STOP SCROLL ANIMATIONS ON MANUAL SCROLL

	var page = $("html, body");
	page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(){
		page.stop();
	});

	var first = true;
	var handleMediaChange = function (mql) {
		console.log("mql");
	    if ( mql.s.matches ) {
	        // LESS THAN 600PX WIDE     
	        gridManager();
	    } else if ( mql.m.matches ) {
	        // MORE THAN 600PX WIDE
			gridManager();		
	    } else {
	    	// MORE THAN 900PX WIDE
			gridManager();
	    }
	}

	var mql = {};
	mql.s = window.matchMedia("(max-width: 600px)");
	mql.m = window.matchMedia("(max-width: 900px)");
	mql.s.addListener(function(){
		handleMediaChange(mql);
	});
	mql.m.addListener(function(){
		handleMediaChange(mql);
	});

	handleMediaChange(mql);

	// ON HASH CHANGE

	// $(window).hashchange( function(){

	// });

});