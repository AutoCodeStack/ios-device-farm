import { DeviceManager } from "./modules/device-management/device.manager";
import IDF from "./modules/idf";
import "./server/server";

/**
 * IDF contain global variables
 * It requires to persist data of connected devices
 * and its processes
 */
export var IDFMap = {
	client_map: new Map<string, IDF>(),
};
IDFMap.client_map = new Map();

/**
 * Maintain only one device manager
 */
DeviceManager.getInstance();
