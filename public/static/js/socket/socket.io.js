var pipeline = new Pipeline();
var canvas = document.getElementById("screen");
canvas.width = canvasWidth * DPR;
canvas.height = canvasHeight * DPR;
canvas.style.width = `${canvasWidth}px`;
canvas.style.height = `${canvasHeight}px`;

var renderLoop = new RenderLoop(pipeline, canvas);
var socket = null;
var canvasRect;

function connect(udid) {
	socket = io("http://localhost:9000");
	const sockData = { udid: udid };
	socket.on("connect", () => {
		socket.emit("devicePrepare", sockData, (data) => {
			console.log(data);
			renderLoop.start();
			hideLoader();
			canvasRect = canvas.getBoundingClientRect();
		});
	});

	socket.on("message", (message) => {
		console.log(message);
	});

	socket.on("imageFrame", (message) => {
		var blob = new Blob([message], { type: "image/jpeg" });
		pipeline.push(blob);
	});

	socket.on("disconnect", () => {
		renderLoop.stop();
		pipeline.destroy();
	});
}
