//Set some constants
var CONST = {
	GRID_COLOR: 0x000000,
	GRID_OPACITY: 0.2,
	GRID_SUBDIVS: 20,
	GRID_SIZE: 1000,
	PERLIN_SCALE: 4,
	CAMERA_VIEW_ANGLE: 45,
	CAMERA_NEAR_CLIP: 0.1,
	CAMERA_FAR_CLIP: 10000
};

$(document).ready(function() {

	// ----- Entry Point ----- //

	//get DOM container
	var $container = $('#container');

	$container.css({width:window.innerWidth, height:window.innerHeight});
	console.log(window.innerWidth + " - " + window.innerHeight);
	// // ----- INIT Stats ----- //
	var stats = new Stats();
	stats.domElement.id = "stats";
	$container.append(stats.domElement);

	// ---- INIT View ----- //
	var view = new VIEW.BoxWave();
	//add renderer to display DOM
	$container.append(view.domElement);


	// ----- UPDATE LOOP ----- //
	(function updateFrame(time){
		view.update(time);

		stats.update();
		requestAnimationFrame(updateFrame);
	})();
});


// ---- BROWSER OVERRIDES ---- //
// stop the user getting a
// text cursor
document.onselectstart = function() {
  return false;
};


// ----- POLY FILLS ---- //
// -- requestAnimationFrame
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());