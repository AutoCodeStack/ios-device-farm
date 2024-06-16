//verifyLogin
import Router, { Request, Response } from "express";
import DeviceManager from "../modules/device-management/device.manager";
import logger from "../config/logger";
import { deviceManager } from "..";

const deviceRoute = Router();

deviceRoute.get("/list", async (req: Request, res: Response) => {
	try {
		const devices = await deviceManager.getDevices();
		if (devices) {
			res.status(200).send({ devices: devices });
			return;
		}
	} catch (error) {
		logger.error(error);
		logger.error(`error controller.getDevices`);
	}
	res.status(200).send({ devices: [] });
	return;
});

deviceRoute.put("/status/:udid/:status", async (req: Request, res: Response) => {
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

export default deviceRoute;
