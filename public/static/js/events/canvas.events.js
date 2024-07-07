$(document).ready(() => {
	$("#screen").swipe({ swipe: swipeListener, tap: tapListener });
});

function tapListener(event, target) {
	const x = event.clientX;
	const y = event.clientY;
	const rect = canvas.getBoundingClientRect();
	const canvasX = x - rect.left;
	const canvasY = y - rect.top;
	const scaledCoordinates = scaler(canvasWidth, canvasHeight, canvasX, canvasY, 414, 896);
	socket.emit("command", { udid: udid, cmd: "tap", data: { x: scaledCoordinates.xp, y: scaledCoordinates.yp } });
}

function swipeListener(event, direction, distance, duration, fingerCount, fingerData) {
	const rect = canvas.getBoundingClientRect();
	const canvasStartX = fingerData[0].start.x - rect.left;
	const canvasStartY = fingerData[0].start.y - rect.top;

	const canvasEndX = fingerData[0].end.x - rect.left;
	const canvasEndY = fingerData[0].end.y - rect.top;

	const scaledCoordinatesStart = scaler(canvasWidth, canvasHeight, canvasStartX, canvasStartY, 414, 896);
	const scaledCoordinatesEnd = scaler(canvasWidth, canvasHeight, canvasEndX, canvasEndY, 414, 896);

	socket.emit("command", {
		udid: udid,
		cmd: "swipe",
		data: {
			velocity: 0.5,
			x1: scaledCoordinatesStart.xp,
			y1: scaledCoordinatesStart.yp,
			x2: scaledCoordinatesEnd.xp,
			y2: scaledCoordinatesEnd.yp,
		},
	});
}

function scaler(bW, bH, x, y, rW, rH) {
	x = (x / bW) * rW;
	y = (y / bH) * rH;
	return { xp: Math.floor(x), yp: Math.floor(y) };
}
