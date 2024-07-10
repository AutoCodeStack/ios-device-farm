var device = null;
var ratio;
var canvasHeight;
var canvasWidth;
var canvasRect;

var pipeline = new Pipeline();
var canvas = document.getElementById("screen");
var renderLoop = new RenderLoop(pipeline, canvas);
var socket = null;

window.addEventListener("message", (event) => {
	device = event.data;
	if (device.udid === undefined || device.udid === null) {
		window.location.assign("../index.html");
	}
	ratio = device.width / device.height;
	canvasHeight = window.innerHeight - 100;
	canvasWidth = canvasHeight * ratio;

	var canvas = document.getElementById("screen");
	canvas.width = canvasWidth * device.dpr;
	canvas.height = canvasHeight * device.dpr;
	canvas.style.width = `${canvasWidth}px`;
	canvas.style.height = `${canvasHeight}px`;

	initlize();
});

window.addEventListener("resize", () => {
	canvasHeight = window.innerHeight - 100;
	canvasWidth = canvasHeight * ratio;
	canvas.width = canvasWidth * device.dpr;
	canvas.height = canvasHeight * device.dpr;
	canvas.style.width = `${canvasWidth}px`;
	canvas.style.height = `${canvasHeight}px`;
	canvasRect = canvas.getBoundingClientRect();
});

function initlize() {
	showLoader("Preparing Device");
	connect(device.udid);
	$("#device_name").text(device.name);
	$("#screen").swipe({ swipe: swipeListener, tap: tapListener });
}

function showLoader(text) {
	$(".loader-background").css("display", "block");
	$(".loader").css("display", "block");
	$("#main").css("display", "none");
	$("#loader-text").text(text);
}

function hideLoader() {
	$(".loader-background").css("display", "none");
	$(".loader").css("display", "none");
	$("#main").css("display", "block");
}

$("#screen").mouseenter(function () {
	$("#screen").css("cursor", "crosshair");
});
$("#screen").mouseleave(function () {
	$("#screen").css("cursor", "default");
});
