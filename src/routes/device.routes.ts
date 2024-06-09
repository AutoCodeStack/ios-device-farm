//verifyLogin
import Router, { Request, Response } from "express";
import DeviceManager from "../modules/device-management/device.manager";
import logger from "../config/logger";
import { deviceManager } from "..";

const deviceRoute = Router();

deviceRoute.get("/device/list", async (req: Request, res: Response) => {
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

export default deviceRoute;
