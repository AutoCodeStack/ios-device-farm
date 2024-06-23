import { Device } from "../../schema/device";
import logger from "../../config/logger";
import { WebDriverAgent } from "./procs/webdriveragent";
import { WdaControl } from "./control/wda-control";
import MjpegStreamSocketClient from "./stream/mjpeg.tcp";
import { WdaCommands } from "./control/types/command";

class WDA {
	private webDriverAgent: WebDriverAgent;
	private device: Device;
	private wdaControl?: WdaControl;
	private wdaStream?: MjpegStreamSocketClient;

	constructor(device: Device) {
		this.device = device;
		this.webDriverAgent = new WebDriverAgent(device.udid);
	}

	public getDevice() {
		return this.device;
	}

	public async sendCommand(data: any): Promise<void> {
		if (this.wdaControl) {
			logger.info(`Sending command: ${data}`);
			await this.wdaControl.performCommand(WdaCommands.TAP, { x: data.x, y: data.y });
		}
	}

	public async start(imageFrame: any): Promise<boolean> {
		try {
			const started = await this.webDriverAgent.start();
			if (started) {
				this.wdaControl = new WdaControl(this.webDriverAgent.port ?? 8100);
				this.wdaStream = new MjpegStreamSocketClient(this.webDriverAgent.mjpegPortNumber);
				this.wdaStream.on("data", imageFrame);
				await this.wdaStream.connect();
				await this.wdaStream.startProcessing();
				await this.wdaControl.createWdaSession();
			}
			return started;
		} catch (error) {
			logger.error(`Failed to connect to WebDriverAgent on device: ${this.device.name}`, error);
			return false;
		}
	}

	public async stop(): Promise<void> {
		try {
			await this.webDriverAgent.stopWebDriverAgent();
		} catch (error) {
			logger.error(`Failed to stop WebDriverAgent on device: ${this.device.name}`, error);
		}

		try {
			await this.wdaControl?.deleteWdaSession();
		} catch (error) {
			logger.error(`Failed to stop wdaControl on device: ${this.device.name}`, error);
		}

		try {
			await this.wdaStream?.disconnect();
		} catch (error) {
			logger.error(`Failed to stop wdaStream on device: ${this.device.name}`, error);
		} finally {
			if (this.wdaStream) {
				this.wdaStream.removeAllListeners();
			}
		}
	}
}

export default WDA;
