const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// const viewPortWidth = urlParams.get("width");
// const viewPortHeight = urlParams.get("height");

const udid = urlParams.get("udid");
if (udid === undefined || udid === null) {
	window.location.assign("../index.html");
}

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
	connect(udid);
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

$("#screen").mouseenter(function () {
	$("#screen").css("cursor", "crosshair");
});
$("#screen").mouseleave(function () {
	$("#screen").css("cursor", "default");
});
