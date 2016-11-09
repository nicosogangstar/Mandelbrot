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

	//
	// Shaders
	//
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, document.getElementById("vertexshader").firstChild.nodeValue);
	gl.shaderSource(fragmentShader, document.getElementById("fragmentshader").firstChild.nodeValue);

	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error("ERROR compiling vertex shader!", gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShader));
	}

	//
	// Program
	//
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error("ERROR linking program!", gl.getProgramInfoLog(program));
	}

	gl.validateProgram(program);
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error("ERROR validating program!", gl.getProgramInfoLog(program));
	}
	gl.useProgram(program);

	//
	// Get uniforms
	//
	var uniforms = {
		viewportDimensions: gl.getUniformLocation(program, 'viewportDimensions'),
		bounds: gl.getUniformLocation(program, 'bounds')
	};

	// CPU side variables
	var viewportDimensions = [canvas.width, canvas.height];
	var bounds = [-2.0, 2.0, -2.0, 2.0];

	//
	// Buffers
	//
	var vertexBuffer = gl.createBuffer();
	var vertices = [
		-1,  1,
		-1, -1,
		 1, -1,

		-1,  1,
		 1,  1,
		 1, -1
	];
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	var vPosAttrib = gl.getAttribLocation(program, 'vPos');
	gl.vertexAttribPointer(
		vPosAttrib,
		2, gl.FLOAT,
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT,
		0
	);
	gl.enableVertexAttribArray(vPosAttrib);

	var loop = function() {
		gl.clearColor(.5, .5, .5, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.uniform2fv(uniforms.viewportDimensions, viewportDimensions);
		gl.uniform4fv(uniforms.bounds, bounds);

		gl.drawArrays(gl.TRIANGLES, 0, 6);

		requestAnimationFrame(loop);	
	}

	requestAnimationFrame(loop);	
}