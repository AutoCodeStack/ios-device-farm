import { SubProcess } from "teen_process";
import { Mutex } from "async-mutex";
import { Device, Status } from "../../schema/device.type";
import logger from "../../config/logger";
import { getDeviceName, getDeviceSize } from "../../utils/device.utils";
import { exec } from "teen_process";
import { APP_ENV } from "../../config/config";

class DeviceManager {
	private static instance: DeviceManager;
	private devices: Map<string, Device> = new Map();
	private mutex = new Mutex();
	iosListenProcess = new SubProcess("ios", ["listen"]);

	constructor() {
		this.listenToDeviceEvents();
	}

	public static getInstance(): DeviceManager {
		if (!DeviceManager.instance) {
			DeviceManager.instance = new DeviceManager();
		}
		return DeviceManager.instance;
	}

	private async attachedEvent(deviceId: number, properties: any) {
		const release = await this.mutex.acquire();
		try {
			const udid = properties.SerialNumber;
			let device = this.devices.get(udid);
			if (device) {
				device.id = deviceId;
				device.status = Status.AVAILABLE;
			} else {
				const deviceSize = getDeviceSize(properties.productType);
				device = {
					id: deviceId,
					name: getDeviceName(properties.productType),
					udid: udid,
					version: properties.version,
					status: Status.AVAILABLE,
					dpr: deviceSize.dpr,
					height: deviceSize.viewportHeight,
					width: deviceSize.viewportWidth,
				};
				this.devices.set(udid, device);
			}
			logger.info(`Device (${device.udid}) is now available`);
		} finally {
			release();
		}
	}

	private async datachedEvent(deviceId: number) {
		const release = await this.mutex.acquire();
		try {
			let device = this.getDeviceById(deviceId);
			if (device) {
				device.status = Status.OFFLINE;
				logger.info(`Device (${device?.udid}) is offline`);
			} else {
				logger.error(`Device (${deviceId}) was not found`);
			}
		} finally {
			release();
		}
	}

	public async markDeviceAsBusy(udid: string): Promise<void> {
		const release = await this.mutex.acquire();
		try {
			const device = this.getDeviceByUdid(udid);
			if (device) {
				device.status = Status.BUSY;
				logger.info(`Device ${udid} (${device.udid}) is now busy`);
			} else {
				logger.error(`Device ${udid} not found`);
			}
		} finally {
			release();
		}
	}

	public async markDeviceAsAvailable(udid: string): Promise<void> {
		const release = await this.mutex.acquire();
		try {
			const device = this.getDeviceByUdid(udid);
			if (device) {
				device.status = Status.AVAILABLE;
				logger.info(`Device ${udid} (${device.udid}) is now available`);
			} else {
				logger.error(`Device ${udid} not found`);
			}
		} finally {
			release();
		}
	}

	public getDevices(): Device[] {
		return Array.from(this.devices.values());
	}

	public getDeviceByUdid(udid: string): Device | undefined {
		return Array.from(this.devices.values()).find((device) => device.udid === udid);
	}

	public getDeviceById(id: number): Device | undefined {
		return Array.from(this.devices.values()).find((device) => device.id === id);
	}

	private async listenToDeviceEvents() {
		this.iosListenProcess.on("lines-stdout", (lines: string[]) => {
			lines.forEach((line) => this.handleEvent(line));
		});

		this.iosListenProcess.on("lines-stderr", (lines: string[]) => {
			lines.forEach((line) => logger.warn(`Error: ${line}`));
		});

		this.iosListenProcess.on("exit", (code: number, signal: string) => {
			logger.info(`ios listen process exited with code ${code} from signal ${signal}`);
		});

		try {
			await this.iosListenProcess.start();
		} catch (error) {
			logger.error(`Failed to start ios listen process: ${error}`);
		}
	}

	private async handleEvent(line: string) {
		try {
			const eventData = JSON.parse(line);
			const { MessageType, DeviceID, Properties } = eventData;
			if (MessageType === "Attached") {
				let { stdout, stderr, code } = await exec(APP_ENV.GO_IOS, ["info", "--udid", `${Properties.SerialNumber}`]);
				if (code == 0) {
					const deviceInfo = JSON.parse(stdout);
					Properties.version = deviceInfo.ProductVersion;
					Properties.productType = deviceInfo.ProductType;
					await this.attachedEvent(DeviceID, Properties);
				}
			} else if (MessageType === "Detached") {
				await this.datachedEvent(DeviceID);
			} else {
				logger.error(`Unknown event occured for device : ${MessageType}`);
			}
		} catch (error) {
			logger.error(`Failed to parse or handle event: ${line}, error: ${error}`);
		}
	}
}

export { DeviceManager };
