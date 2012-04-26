window.onload = function() {
	
	slide[0] = new slide(0);
	slide[1] = new slide(1);
	slide[2] = new slide(2);
	
	
	
	
	//init some bootstrap features
	$('a[rel="popover"]').popover();
	$('a[rel="tooltip"]').tooltip();
	
	
	//re-create the dynamic design elements for new sizes when window is re-sized
	$(window).resize(function () {
		refreshAll();
 	});
	
	//adjust navbar to allow for smooth scrolling
	enableSmoothScroll();
	
	$('#loading').hide();
	
	//show the nav bar after a dealy
	setTimeout("$('#navigation').show('slide', { direction: 'down' }, 300);",1200);
	
	//fetch the last tweet
	fetchLastTweet();
	


	
}

function enableSmoothScroll() {
    // Click event for any anchor tag that's href starts with #
    $('a[href^="#"]').click(function(event) {

        // The id of the section we want to go to.
        var id = $(this).attr("href");

        // An offset to push the content down from the top.
        var offset = 0;

        // Our scroll target : the top position of the
        // section that has the id referenced by our href.
        var target = $(id).offset().top - offset;

        // The magic...smooth scrollin' goodness.
        $('html, body').animate({scrollTop:target}, 500);

        //prevent the page from jumping down to our section.
        event.preventDefault();
    });
	
}

function fetchLastTweet() {
	$('#tweet').hide();
	$.getJSON("http://twitter.com/statuses/user_timeline/kohlhofer.json?callback=?", function(data) {
	     $("#lasttweet").html(data[0].text);
		 $('#tweet').fadeIn();
	});
}


// Slide Object

function slide(id) {
	this.id = id;
	this.domElement = $("#" + this.id);
	this.isScrolling = true;
	this.colors = new Array();
	this.gap = 4;
	
	this.colors = [
		'#f5b128',
		'#bf9424',
		'#9aaa79',
		'#58858a',
		'#de4d0c',
		'#A0B96F',
		'#c0480b'
		];
		
		
	this.drawings = [
		'img/drawings/Base_(PSF).svg',
		'img/drawings/Cockroach_(PSF).svg',
		'img/drawings/DIL14_Wireframe.svg',
		'img/drawings/Line-drawing_of_a_human_man.svg',
		'img/drawings/Pioneer_plaque_line-drawing_of_a_human_male.svg',
		'img/drawings/SaturnI.svg',
		'img/drawings/Wire_frame.svg'
	];
	
	// adding methods
	this.initPosition = initPosition;
	this.adjustToWindowSize = adjustToWindowSize;
	this.addRandomStripes = addRandomStripes;
	this.removeAllStripes = removeAllStripes;
	this.addBottomBar = addBottomBar;
	this.removeBar = removeBar;
	this.addRandomShapes = addRandomShapes;
	this.removeShapes = removeShapes;
	
	
	// running methods
	this.adjustToWindowSize();
	
}

// methods for slide object

function adjustToWindowSize() {
	this.domElement.css('height',$(window).height() + this.gap);
	this.domElement.css('width',$(window).width());
	this.addRandomStripes(2,6);
	this.addRandomShapes(1,2);
	this.addBottomBar();
	this.initPosition();
}

function initPosition() {
	
	var targetPosition = this.id * ($(window).height() + this.gap);
	this.domElement.css('top',targetPosition);
}

function removeAllStripes() {
	this.domElement.children('.stripe').remove();
}

function removeBar() {
	this.domElement.children('.bar').remove();
}

function addRandomShapes(min,max) {
	//remove previous stripes if any
	this.removeShapes();
	
	//random number of stripes based on min and max parameters
	var i = 0, size, shapeContainer, shape, numberOfShapes = returnRandomNumner(min,max);
	
	// create shape container
	shapeContainer = $("<div>");
	shapeContainer.addClass("shapeContainer");
	
	
	while (i < numberOfShapes) {
		
		size = returnRandomNumner(600,900);
		shape = $("<img>");
		shape.attr("src",this.drawings[Math.floor(Math.random()*this.drawings.length)])
		shape.addClass("shape");
		shape.css('left',returnRandomNumner(-100,$(window).width()-100));
		shape.css('top',returnRandomNumner(-100,$(window).height()-100));
		shape.css('height',size);

		
		//attach shape to shapeContainer
		shape.prependTo(shapeContainer); 
		
		i++;
	}
	shapeContainer.prependTo(this.domElement); 
	
}

function removeShapes() {
	this.domElement.children('.shapeContainer').remove();
}
	

function addRandomStripes(min,max) {
	
	//remove previous stripes if any
	this.removeAllStripes()
	
	this.stripes = new Array();
	
	//random number of stripes based on min and max parameters
	var i = 0, width, stripe, totalWidth = 0, numberOfStripes = returnRandomNumner(min,max), height = $(window).height()+this.gap;
	
	//subsequent random stripes have a greater start position than the previous one
	while (i < numberOfStripes) {
		if (i < numberOfStripes-1) {
			width = Math.floor(Math.random()*($(window).width()-totalWidth));
		} else {
			width = $(window).width()-totalWidth;
		}
		
		stripe = $("<div>");
		stripe.addClass("stripe");
		stripe.css('left',totalWidth);
		stripe.css('width',width);
		stripe.css('height',height);
		stripe.css('background-color',this.colors[Math.floor(Math.random()*this.colors.length)]);
		totalWidth = totalWidth + width;
		
		//attach stripe to slide
		stripe.prependTo(this.domElement); 
		
		i++;
	}
}

function addBottomBar() {
	
	this.removeBar();
	
	var bar;
	
	bar = $("<div>");
	bar.addClass("bar");
	bar.css('height',this.gap);

	bar.prependTo(this.domElement); 

}



// Helpers


function returnRandomNumner(min,max) {
	return Math.floor(Math.random()*(max-min+1))+min;
}

function shuffleItUp() {
	refreshAll();
	setTimeout("refreshAll();",100);
	setTimeout("refreshAll();",200);
	setTimeout("refreshAll();",250);
}


function refreshAll() {
	slide[0].adjustToWindowSize();
	slide[1].adjustToWindowSize();
	slide[2].adjustToWindowSize();
}
