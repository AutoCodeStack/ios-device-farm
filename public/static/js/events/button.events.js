function homeButtonClick() {
	if (socket) {
		socket.emit("command", { udid: udid, cmd: "homescreen" });
	}
}
