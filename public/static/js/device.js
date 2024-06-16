const ratio = 414 / 896;
var canvasHeight = window.innerHeight - 100;
var canvasWidth = canvasHeight * ratio;
var canvasRect;
const DPR = window.devicePixelRatio;

window.addEventListener("resize", () => {
	canvasHeight = window.innerHeight - 100;
	canvasWidth = canvasHeight * ratio;
	canvas.width = canvasWidth * DPR;
	canvas.height = canvasHeight * DPR;
	canvas.style.width = `${canvasWidth}px`;
	canvas.style.height = `${canvasHeight}px`;
	canvasRect = canvas.getBoundingClientRect();
});

var canvas = document.getElementById("screen");
canvas.width = canvasWidth * DPR;
canvas.height = canvasHeight * DPR;
canvas.style.width = `${canvasWidth}px`;
canvas.style.height = `${canvasHeight}px`;

$(function () {
	showLoader("Preparing Device");
});

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
