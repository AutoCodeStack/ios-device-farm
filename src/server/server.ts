import express, { Request, Response } from "express";
import http from "http";
import { APP_ENV } from "../config/config";
import logger from "../config/logger";
import { buildSocketServer } from "./socket.io";
import { deviceManager } from "..";

const app = express();
const server: http.Server = http.createServer(app);

app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/api/devices", async (req: Request, res: Response) => {
	try {
		const devices = await deviceManager.getDevices();
		res.send({ devices: devices }).status(200);
	} catch (error) {
		res.send("").status(400);
	}
});

app.put("/api/device/status/:udid/:status", async (req: Request, res: Response) => {
	try {
		const udid = req.params.udid;
		const status = req.params.status as unknown as number;
		const device = deviceManager.getDevice(udid);
		if (device && device.status !== 1) {
			deviceManager.changeDeviceStatus(device.id, status);
			res.send({ status: true }).status(200);
			return;
		}
	} catch (error) {
		logger.error(error);
	}
	res.send("").status(400);
});

// Handle general server errors
server.on("error", (error) => {
	console.error(`Server error: ${error.message}`);
});

// Start the server
server.listen(APP_ENV.PORT, () => {
	logger.info(`Server is listening on port ${APP_ENV.PORT}`);
	buildSocketServer(server);
});
