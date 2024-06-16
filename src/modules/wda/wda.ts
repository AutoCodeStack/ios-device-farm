import { Device } from "../../schema/device";
import logger from "../../config/logger";
import { WebDriverAgent } from "./procs/webdriveragent";
import { WdaControl } from "./control/wda-control";
import MjpegStreamSocketClient from "./stream/mjpeg.tcp";
import { EventEmitter } from "stream";

class WDA extends EventEmitter {
	private webDriverAgent: WebDriverAgent;
	private device: Device;
	private wdaControl?: WdaControl;
	private wdaStream?: MjpegStreamSocketClient;

	constructor(device: Device) {
		super();
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
				this.wdaStream = new MjpegStreamSocketClient("localhost", this.webDriverAgent.mjpegPortNumber);
				this.wdaStream.on("data", (data: Buffer) => {
					this.emit("imageFrame", data);
				});
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
			console.error(`Failed to stop WebDriverAgent on device: ${this.device.name}`, error);
		}
	}
}

export default WDA;
