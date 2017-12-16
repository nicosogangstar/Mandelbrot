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
	switch(event.keyCode) {
		case 87:
			pandir = 0;
			break;
		case 83:
			pandir = 1;
			break;
		case 68:
			pandir = 2;
			break;
		case 65:
			pandir = 3;
			break;	
		case 38:
			scaler = -0.02;
			break;
		case 40:
			scaler = 0.02;
			break;
	}
}

function onKeyUp() {
	pandir = -1;
	scaler = 0.0;

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