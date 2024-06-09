import { Convert, Device, DeviceConnectEvent } from "../../schema/device";
import { getDeviceInfo } from "../../utils/goios.utils";
import DeviceDetector from "./device.detector";
import logger from "../../config/logger";

class DeviceManager {
	private devices: Map<number, Device>;
	private detector: DeviceDetector;

	constructor() {
		this.devices = new Map();
		// properly set listener otherwise might get bugs
		this.detector = new DeviceDetector();
		this.setupListeners();
		this.detector.startDeviceListen();
		logger.info(`Device Manager init successful`);
	}

	private setupListeners(): void {
		this.detector.on("add", this.addDevice);
		this.detector.on("delete", this.deleteDevice);
	}

	private addDevice = async (addEvent: DeviceConnectEvent): Promise<void> => {
		try {
			const deviceInfo = await getDeviceInfo(addEvent.Properties.SerialNumber);
			if (deviceInfo) {
				const device: Device = Convert.toDevice(deviceInfo, addEvent);
				this.devices.set(device.id, device);
				logger.info(`Device added: ${device.id}`);
			} else {
				logger.warn(`No device info found for serial number: ${addEvent.Properties.SerialNumber}`);
			}
		} catch (error) {
			logger.error(`Failed to add device with serial number ${addEvent.Properties.SerialNumber}: ${error}`);
		}
	};

	private deleteDevice = async (deleteEvent: DeviceConnectEvent): Promise<void> => {
		try {
			const deviceId = deleteEvent.DeviceID;
			if (this.devices.has(deviceId)) {
				this.devices.delete(deviceId);
				logger.info(`Device deleted: ${deviceId}`);
			} else {
				logger.warn(`Couldn't find device with ID: ${deviceId}`);
			}
		} catch (error) {
			logger.error(`Failed to delete device with ID ${deleteEvent.DeviceID}: ${error}`);
		}
	};

	public getDevices = async () => {
		return Array.from(this.devices.values());
	};

	public getDevice = (udid: string): Device | undefined => {
		const allDevices = Array.from(this.devices.values());
		const device = allDevices.find((item: Device) => {
			item.udid === udid;
		});
		return device;
	};
}

export default DeviceManager;
