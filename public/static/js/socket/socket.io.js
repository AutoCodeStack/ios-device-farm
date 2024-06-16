var socket = null;

function connect(udid) {
	socket = io(uri);
	const sockData = { udid: udid };
	socket.on("connect", () => {
		socket.emit("prepare", sockData, (data) => {
			console.log(data);
			hideLoader();
		});
	});

	socket.on("message", (message) => {
		var blob = new Blob([message], { type: "image/jpeg" });
		pipeline.push(blob);
	});

	socket.on("disconnect", () => {
		renderLoop.stop();
		pipeline.destroy();
	});
}
