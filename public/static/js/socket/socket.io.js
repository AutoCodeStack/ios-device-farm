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
