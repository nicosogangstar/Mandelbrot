var zoomIntervalId;
var panIntervalId;

function configureEvents() {
	addEvent(window, 'resize', onResizeWindow);
	addEvent(window, 'keydown', onKeyDown);
	addEvent(window, 'keyup', onKeyUp);
	addEvent(window, 'wheel', onScroll);
	addEvent(window, 'mousemove', onMouseMove);
}

function addEvent(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

function zoom(rangeModifier) {
	var rangeI = bounds[1] - bounds[0];
	var newRangeI;
	newRangeI = rangeI * rangeModifier;
	var delta = newRangeI - rangeI;
	bounds[0] -= delta / 2;
	bounds[1] = bounds[0] + newRangeI;

	onResizeWindow();
}

function pan(distI, distR) {
	var rangeI = bounds[1] - bounds[0];
	var rangeR = bounds[3] - bounds[2];

	var deltaI = (distR / canvas.height) * rangeI;
	var deltaR = (distI / canvas.width) * rangeR;

	bounds[0] += deltaI;
	bounds[1] += deltaI;
	bounds[2] -= deltaR;
	bounds[3] -= deltaR;
}

function onResizeWindow() {
	if(!canvas) {
		return;
	}

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var rangeR = bounds[3] - bounds[2];
	bounds[3] = (bounds[1] - bounds[0]) * (canvas.width / canvas.height) / 1.4 + bounds[2];
	var newRangeR = bounds[3] - bounds[2];

	bounds[2] -= (newRangeR - rangeR) / 2;
	bounds[3] = (bounds[1] - bounds[0]) * (canvas.width / canvas.height) / 1.4 + bounds[2];

	document.getElementById("zoom_factor").textContent = "Zoom: " + (dist / bounds[0]).toExponential(4);

	gl.viewport(0, 0, canvas.width, canvas.height);
}

function onKeyDown() {
	var travel = 10;
	var scaler = .05;

	var panFunc = function panInt() {};
	var zoomFunc = function zoomInt() {};

	switch(event.keyCode) {
		case 87:
			pan(0, travel);
			break;
		case 83:
			pan(0, -travel);
			break;
		case 68:
			pan(-travel, 0);
			break;
		case 65:
			pan(travel, 0);
			break;	
		case 38:
			zoom(1.0 - scaler);
			break;
		case 40:
			zoom(1.0 + scaler);
			break;
	}

	panIntervalId = setInterval(panFunc, 10);
	zoomIntervalId = setInterval(zoomFunc, 10);
}

function onKeyUp() {
	clearInterval(panIntervalId);
	clearInterval(zoomIntervalId);
}

function onScroll() {
	if(event.deltaY < 0) {
		zoom(0.95);
	}
	else {
		zoom(1.05);
	}
}

function onMouseMove() {
	if (event.buttons === 1) {
		pan(event.movementX, event.movementY);
	}
}