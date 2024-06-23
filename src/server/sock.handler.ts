import { Socket } from "socket.io";
import { IDFMap, deviceManager } from "..";
import logger from "../config/logger";
import IDF from "../modules/idf";

const handleCommand = async (socket: Socket, data: any, callback: Function) => {
	try {
		const ideviceFarm = IDFMap.client_map.get(socket.id);
		if (ideviceFarm) {
			await ideviceFarm.sendCommand(data);
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
				const ideviceFarm = new IDF(device.udid, socket);
				await ideviceFarm.start();
				IDFMap.client_map.set(socket.id, ideviceFarm);
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
		logger.error(`Error generated in onPrepare`, error);
	}
	callback(sock_response(false, "there was an error occured, please connect with developer"));
};

const handleDestroy = async (socket: Socket) => {
	try {
		const ideviceFarm = IDFMap.client_map.get(socket.id);
		if (ideviceFarm) {
			//deviceManager.changeDeviceStatus(wda.getDevice().id, 0);
			await ideviceFarm.stop();
			IDFMap.client_map.delete(socket.id);
		}
	} catch (error: Error | any) {
		logger.error(`Error generated in handleDestroy`);
		logger.error(error);
	}
};

const sock_response = (status: boolean, msg: string) => {
	return { status: status, msg: msg };
};

export { handleCommand, handleDevicePrepare, handleDestroy };
