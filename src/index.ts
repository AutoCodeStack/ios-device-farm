import logger from "./config/logger";
import DeviceManager from "./modules/device-management/device.manager";
import { WebDriverAgent } from "./modules/wda/procs/webdriveragent";
import WDA from "./modules/wda/wda";
import "./server/server";

/**
 * IDF contain global variables
 * It requires to persist data of connected devices
 * and its processes
 */
export var IDF = {
	client_map: new Map<string, WDA>(),
};
IDF.client_map = new Map();

/**
 * Maintain only one device manager
 */
const deviceManager = new DeviceManager();
export { deviceManager };
