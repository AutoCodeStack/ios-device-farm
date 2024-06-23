import { Socket } from "socket.io";
import { IDF, deviceManager } from "..";
import WDA from "../modules/wda/wda";
import logger from "../config/logger";

const sock_response = (status: boolean, msg: string) => {
	return { status: status, msg: msg };
};

const handleCommand = async (socket: Socket, data: any, callback: Function) => {
	try {
		logger.info(`Received command: ${JSON.stringify(data)}`);
		const wda = IDF.client_map.get(socket.id);
		if (wda) {
			await wda.sendCommand(data);
			return;
		}
	} catch (error: Error | any) {
		logger.error(`Error fetching devices from device manager`);
		return;
	}
};

const handleDevicePrepare = async (socket: Socket, data: any, callback: Function) => {
	try {
		const udid = data.udid;
		if (udid) {
			const device = deviceManager.getDevice(udid);
			if (device) {
				deviceManager.changeDeviceStatus(device.id, 1);
				const wda = new WDA(device);
				await wda.start((data: any) => {
					socket.emit("imageFrame", data);
				});
				IDF.client_map.set(socket.id, wda);
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

const handleDestroy = async (socket: Socket) => {
	try {
		const wda = IDF.client_map.get(socket.id);
		if (wda) {
			deviceManager.changeDeviceStatus(wda.getDevice().id, 0);
			await wda.stop();
			IDF.client_map.delete(socket.id);
		}
	} catch (error: Error | any) {
		logger.error(`Error generated in handleDestroy`);
		logger.error(error);
	}
};

export { handleCommand, handleDevicePrepare, handleDestroy };
