/************************************************

    CONTROLLER

************************************************/

function onYouTubeIframeAPIReady() {
		
	console.log("onYouTubeIframeAPIReady");
	
	// GET VIDEO ID
	var target = $("#player"),
		vidId = target.attr("data-id"),
		vidSrc = target.attr("data-src"), 
		vidOrigin = target.attr("data-origin");

		// SET SRC
	var newSrc = vidSrc.split("?")[0] + "?enablejsapi=1&origin=" + vidOrigin;
		target.attr( "src", newSrc );

	player = new YT.Player("player", {
		events: {
			'onReady': controllerHome.onPlayerReady,
			'onStateChange': controllerHome.onPlayerStateChange,
			'onError': controllerHome.onPlayerError
		},
		playerVars: {
        	playlist: vidId,
        	loop: 1
      	}
	});

	// BIND EVENTS
	$("#home_video_button .pause").on("click", function(){
		controllerHome.pauseVideo();
	});

}

var controllerHome = {

	init: function () {

		console.log("controllerHome.init");

		// IF VIDEO VISIBLE
		if ( $("#player").length ) {
			this.loadVideo();
		// IF IMAGES VISIBLE
		} else if ( $("#home_slideshow").length ) {
			// INITIATE SLIDESHOW
			this.slideInit();
		}
		// SHOW TEXT
		viewHome.textInit();

	}, 

	slideInit: function () {

		console.log("controllerHome.slideInit");

		// LOAD FIRST TWO IMAGES
		controllerPage.imageCalc( $("#home_slideshow").find(".visible") );
		controllerPage.imageCalc( $("#home_slideshow").find(".visible").next() );

		// BIND CLICK EVENT
		$(".arrow a").fadeIn().on("click", function(e){
			e.preventDefault();
			if ( $(this).parent().attr("id") === "right_arrow" ) {
				viewHome.slide("right");
			} else {
				viewHome.slide("left");
			}
		});

	},

	homeLinkOpen: function ( click ) {
		
		console.log("controllerHome.homeLinkOpen");

		var link = click.parents(".home_text").data("link"),
			section = link.split("_")[1],
			post = link.split("_")[2];
		// SCROLL TO SECTION
		controllerPage.navToSection( section );
		// AFTER 1 SECOND SCROLL TO POST
		setTimeout( function(){
			// TRIGGER CLICK ON BANNER LINK
			$("[data-link="+post+"]").trigger("click");
		}, 1000 );

	},

	onPlayerReady: function (event) {

		console.log("onPlayerReady");

		event.target.playVideo();
		event.target.mute();

	},

	onPlayerStateChange: function (event) {

		console.log("onPlayerStateChange");
		
		if ( event.data == YT.PlayerState.PLAYING ) {
			playVideo();
		}

	},

	onPlayerError: function (argument) {
		
		console.log("onPlayerError");

		// HIDE VIDEO
		// $("#home iframe").hide();

	},

	playVideo: function () {

		console.log("playVideo");

		// MAKE IFRAME FIT TO SCREEN
		$("#player").removeClass("paused").fadeIn();
		// SHOW BUTTON
		$("#home_video_button").find("play").hide();
		$("#home_video_button").find("pause").show();
		$("#home_video_button").fadeIn();

	},

	pauseVideo: function  () {

		console.log("pauseVideo");

		player.pauseVideo();
		// HIDE BUTTON
		$("#home_video_button").fadeOut();
		$("#home_video_button").find("pause").hide();
		$("#home_video_button").find("play").show();
		// MAKE IFRAME SMALLER
		$("#player").addClass("paused");

	},

	loadVideo: function () {

		console.log("controllerHome.loadVideo");

		// CHECK IF HOME_VIDEO DIV
		if ( $("#player").length ) {
			// LOAD THE IFRAME PLAYER API CODE ASYNCHRONOUSLY
			var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		} // END OF IF #PLAYER CHECK

	}

}

/************************************************

    VIEW

************************************************/

var viewHome = {

	slide: function ( direction ) {

		console.log( "viewHome.slide", direction );

		var gallery = $("#home_slideshow"),
			current = gallery.find(".visible"),
			target = current.next(),
			nextTarget;
		if ( direction === "left" ) {
			target = current.prev();
		} 
		// CHECK IF TARGET EXISTS
		if ( target.length === 0 ) {				
			if ( direction === "left" ) {
				target = gallery.find("li:last-child");
			} else {
				target = gallery.find("li:first-child");				
			}		
		}
		// MAIN ACTION
		current.removeClass("visible");
		target.addClass("visible");

		// LOAD NEXT TARGET
		if ( direction === "right" ) {
			nextTarget = $(".visible").next();
		} else {
			nextTarget = $(".visible").prev();
		}
		controllerPage.imageCalc( nextTarget );

	},

	textInit: function () {

		console.log("viewHome.textInit");

		if ( $(window).width() > 500 ) {

			// GET WIDTH + HEIGHT OF TEXT BLOCK
			var textW = $(".home_text_wrapper").css("width"), // IN PIXELS
				textH = $(".home_text_wrapper").height(),
				textTooHigh = false,
				topPos;

			console.log( 221, textH );

			// IF textH > 0.65 OF WINDOW HEIGHT
			if ( textH > 0.65 * $(window).height() ) {
				// SET MAX HEIGHT
				maxH = "50%";
				overflow = "scroll";
				textTooHigh = true;
			} else {
				maxH = "auto";
				overflow = "auto";
			}

			// IF TEXT TOO HIGH:
			if ( textTooHigh ) {
				// GET MAX TOP POSITION OF TEXT BLOCK
				var randNo = Math.random() * 25;
				topPos = randNo + ( 40 / $(window).height() * 100 ); // 40 === TOP BANNER HEIGHT 		
				console.log( 236, randNo, 40 / $(window).height() );		
			} else {
				topPos = Math.floor( Math.random() * 62 ) + 5;
			}

			console.log( 331, textH, topPos, textTooHigh );

			// CALC RANDOM LEFT PERCENTAGE
			var leftPos = Math.random() * ( 1 - ( parseInt(textW) / $(window).width() ) ) * 100;

			$(".home_text_wrapper").css({
				"left" : leftPos + "%",
				"top" : topPos + "%",
				"height" : maxH
			}).fadeIn();
			$(".home_text").css({
				"overflow" : overflow	
			});	
		} else {
		
			var textWrapperH = $(".home_text_wrapper").height();
			$(".home_text").css({
				"height" : textWrapperH,
				"overflow" : "auto"
			});
			$(".home_text_wrapper").fadeIn();		
		}
		// BIND CLOSE FUNCTION
		$(".home_close").on( "click", function(){
			$(".home_text_wrapper").hide();
		});	
		// BIND LINK FUNCTION
		$(".text_link a").on( "click", function(e){
			// IF NO EXTERNAL LINK
			console.log($(this).attr("href"));
			if ( $(this).attr("href") === "" ) {
				e.preventDefault();
				controllerHome.homeLinkOpen( $(this) );
			}
		});	
	}

}

