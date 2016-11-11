var zoomIntervalId;

function configureEvents() {
	addEvent(window, 'resize', onResizeWindow);
	addEvent(window, 'keydown', onKeyDown);
	addEvent(window, 'wheel', onScroll);
	addEvent(window, 'mousemove', onMouseMove);
	addEvent(window, 'mousedown', onMouseDown);
	addEvent(window, 'mouseup', onMouseUp);
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
	if(event.keyCode >= 48 && event.keyCode <= 90) {
		if(document.getElementById("menu").style.visibility === "hidden") {
			document.getElementById("menu").style.visibility = "visible";
		}
		else {
			document.getElementById("menu").style.visibility = "hidden";
		}
	}
}

function onScroll() {
	var rangeI = bounds[1] - bounds[0];
	var newRangeI;

	if(event.deltaY < 0) {
		newRangeI = rangeI * 0.95;
	}
	else {
		newRangeI = rangeI * 1.05;
	}

	var delta = newRangeI - rangeI;

	bounds[0] -= delta / 2;
	bounds[1] = bounds[0] + newRangeI;

	onResizeWindow();
}

function onMouseMove() {
	if (event.buttons === 1) {
		var rangeI = bounds[1] - bounds[0];
		var rangeR = bounds[3] - bounds[2];

		var deltaI = (event.movementY / canvas.height) * rangeI;
		var deltaR = (event.movementX / canvas.width) * rangeR;

		bounds[0] += deltaI;
		bounds[1] += deltaI;
		bounds[2] -= deltaR;
		bounds[3] -= deltaR;
	}
}

function onMouseDown() {
	if(event.buttons > 2) {
		zoomIntervalId = setInterval(function zoomIn() {
			onScroll(event = {buttons: 1, deltaY: -100});
		}, 10);
	}
}

function onMouseUp() {
	clearInterval(zoomIntervalId);
}