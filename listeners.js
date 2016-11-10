function configureEvents() {
	addEvent(window, 'resize', onResizeWindow);
	addEvent(window, 'keydown', onKeyDown);
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


function onResizeWindow() {
	if(!canvas) {
		return;
	}

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var rangeR = maxR - minR;
	maxR = (maxI - minI) * (canvas.width / canvas.height) / 1.4 + minR;
	var newRangeR = maxR - minR;

	minR -= (newRangeR - rangeR) / 2;
	maxR = (maxI - minI) * (canvas.width / canvas.height) / 1.4 + minR;

	gl.viewport(0, 0, canvas.width, canvas.height);
}

function onKeyDown() {
	//alert(event.keyCode);
}

function onScroll() {
	var rangeI = maxI - minI;
	var newRangeI;

	if(event.deltaY < 0) {
		newRangeI = rangeI * 0.95;
	}
	else {
		newRangeI = rangeI * 1.05;
	}

	var delta = newRangeI - rangeI;

	minI -= delta / 2;
	maxI = minI + newRangeI;

	onResizeWindow();
}

function onMouseMove(e) {
	if (e.buttons === 1) {
		var rangeI = maxI - minI;
		var rangeR = maxR - minR;

		var deltaI = (e.movementY / canvas.height) * rangeI;
		var deltaR = (e.movementX / canvas.width) * rangeR;

		minI += deltaI;
		maxI += deltaI;
		minR -= deltaR;
		maxR -= deltaR;
	}
}