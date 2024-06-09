import { Device } from "../../schema/device";
import logger from "../../config/logger";
import { WebDriverAgent } from "./procs/webdriveragent";
import { WdaControl } from "./control/wda-control";

class WDA {
	private webDriverAgent: WebDriverAgent;
	private device: Device;
	private wdaControl?: WdaControl;

	constructor(device: Device) {
		this.device = device;
		this.webDriverAgent = new WebDriverAgent(device.udid);
	}

	public getDevice() {
		return this.device;
	}

	public async start(): Promise<boolean> {
		try {
			const started = await this.webDriverAgent.start();
			if (started) {
				this.wdaControl = new WdaControl(this.webDriverAgent.port ?? 8100);
			}
			return started;
		} catch (error) {
			logger.error(`Failed to connect to WebDriverAgent on device: ${this.device.name}`, error);
			return false;
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
