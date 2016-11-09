'use strict';

var canvas, gl;

function initMandelbrot() {
	canvas = document.getElementById("canvas");

	gl = canvas.getContext('webgl');

	if(!gl) {
		console.log("webgl is not supported, reverting to experimental-webgl");
		gl = canvas.getContext('experimental-webgl');
	}

	if(!gl) {
		alert("Your browser does not support WebGL");
	}

	configureEvents();
	onResizeWindow();

	var loop = function() {
		gl.clearColor(.5, .5, .5, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		requestAnimationFrame(loop);	
	}

	requestAnimationFrame(loop);	
}