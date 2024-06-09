import { Device } from "../../schema/device";
import logger from "../../config/logger";
import { SubProcess } from "teen_process";
import findFreePorts from "find-free-ports";
import { APP_ENV } from "../../config/config";

class WDA {
	private device: Device;

	webDriverAgentProcess?: SubProcess;
	wdaControlTunnel?: SubProcess;
	mjpegStreamTunnel?: SubProcess;

	constructor(device: Device) {
		this.device = device;
	}

	public getDevice() {
		return this.device;
	}

	public async start(): Promise<void> {
		try {
		} catch (error) {
			logger.error(`Failed to connect to WebDriverAgent on device: ${this.device.name}`, error);
		}
	}

	// #1 start the webdriveragent
	private async startWebDriverAgent(): Promise<void> {
		console.log(`Starting WebDriverAgent on device: ${this.device.name}`);
		return new Promise((resolve) => setTimeout(resolve, 2000));
	}

	public async stop(): Promise<void> {
		try {
			console.log(`Stopping WebDriverAgent on device: ${this.device.name}`);
			await this.stopWebDriverAgent();
			console.log(`Stopped WebDriverAgent on device: ${this.device.name}`);
		} catch (error) {
			console.error(`Failed to stop WebDriverAgent on device: ${this.device.name}`, error);
		}
	}

	private async stopWebDriverAgent(): Promise<void> {
		console.log(`Stopping WebDriverAgent on device: ${this.device.name}`);
		return new Promise((resolve) => setTimeout(resolve, 2000));
	}
}

/**
 * WDA
 * write basic functions
 * write nodejs typescript code where  a class WDA need to be created and it has following responsibilites
 * initilaize with a device object (device will contain udid, name, version)
 * a method to connect with a device and invote WebDriverAgent installed on iphone
 * a method to stop WebDriverAgent on iPhone
 * */

export default WDA;
