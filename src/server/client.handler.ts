import { Socket } from "socket.io";
import { IDF, deviceManager } from "..";
import WDA from "../modules/wda/wda";
import logger from "../config/logger";

const onCommand = (data: any, callback: Function) => {};

const onPrepare = async (socket: Socket, data: any, callback: Function) => {
	try {
		const udid = data.udid;
		if (udid) {
			const device = deviceManager.getDevice(udid);
			if (device) {
				/*** custom client management */
				const wda = new WDA(device);
				IDF.client_map.set(socket.id, wda);

				/**
				 * start the webdriveragent
				 */
				await wda.start();
				logger.info(`started wda successfully`);
				callback(sock_response(true, "successfully created client"));
				return;
			} else {
				logger.error(`Error fetching devices from device manager`);
			}
		} else {
			logger.error(`Error fetching devices from device manager`);
			callback(sock_response(true, "please send udid along with other params"));
			return;
		}
	} catch (error: Error | any) {
		logger.error(error);
		logger.error(`Error generated in onPrepare`);
	}
	callback(sock_response(false, "there was an error occured, please connect with developer"));
};

const onDestroy = async (socket: Socket) => {};

const sock_response = (status: boolean, msg: string) => {
	return { status: status, msg: msg };
};

export { onCommand, onPrepare, onDestroy };
