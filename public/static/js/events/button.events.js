function homeButtonClick() {
	if (socket) {
		socket.emit("command", { udid: device.udid, cmd: "homescreen" });
	}
}

function takeScreenshot() {
	if (socket) {
		socket.emit("command", { udid: device.udid, cmd: "homescreen" });
	}
}

function actionSwitchApp() {
	if (socket) {
		socket.emit("command", { udid: device.udid, cmd: "homescreen" });
	}
}
