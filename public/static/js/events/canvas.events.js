$(document).ready(() => {
	// Canvas element and Hammer.js setup
	const canvas = document.getElementById("screen");

	// Initialize Hammer.js
	const hammer = new Hammer(canvas);

	// Tap event handler
	hammer.on("tap", (event) => {
		const x = event.center.x;
		const y = event.center.y;

		// If you need to convert coordinates to canvas space:
		const rect = canvas.getBoundingClientRect();
		const canvasX = x - rect.left;
		const canvasY = y - rect.top;
		// console.log(`Canvas space coordinates: (${canvasX}, ${canvasY})`);
		const scaledCoordinates = scaler(canvasWidth, canvasHeight, canvasX, canvasY, 414, 896);
		socket.emit("command", { udid: udid, cmd: "tap", data: { x: scaledCoordinates.xp, y: scaledCoordinates.yp } });
	});

	// Swipe event handler
	hammer.on("swipe", (event) => {
		const direction = event.direction; // Direction of the swipe
		const velocity = event.velocity; // Velocity of the swipe
		const startX = event.center.x; // Start x-coordinate
		const startY = event.center.y; // Start y-coordinate

		console.log(`Canvas swiped with direction: ${direction}, velocity: ${velocity}`);
		console.log(`Swipe started at coordinates: (${startX}, ${startY})`);

		// If you need to convert coordinates to canvas space:
		const rect = canvas.getBoundingClientRect();
		const canvasStartX = startX - rect.left;
		const canvasStartY = startY - rect.top;
		console.log(`Canvas space start coordinates: (${canvasStartX}, ${canvasStartY})`);
	});
});

function scaler(bW, bH, x, y, rW, rH) {
	x = (x / bW) * rW;
	y = (y / bH) * rH;
	return { xp: Math.floor(x), yp: Math.floor(y) };
}
