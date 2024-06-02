import { SubProcess, exec } from "teen_process";
import { Convert, Device, DeviceConnectEvent, DeviceInfo } from "../../model/device";
import { go_ios_path } from "../../utils/idf.path";
import { getDeviceName } from "../../utils/idf.device.map";

class DeviceManager {
	devices: Map<number, Device>;
	deviceListenProc?: SubProcess;

	constructor() {
		this.devices = new Map();
	}

	startDeviceListen = async () => {
		this.deviceListenProc = new SubProcess(go_ios_path, ["listen"]);

		this.deviceListenProc.on("exit", (code, signal) => {
			console.log(`exited with code ${code} from signal ${signal}`);
		});

		this.deviceListenProc.on("output", (stdout, stderr) => {
			try {
				const deviceConnectEvent = Convert.toDeviceConnectEvent(stdout);
				this.handleDeviceConnectEvent(deviceConnectEvent);
			} catch (error) {
				console.log(error);
			}
		});

		await this.deviceListenProc.start(0);
	};

	handleDeviceConnectEvent = async (connectEvent: DeviceConnectEvent) => {
		switch (connectEvent.MessageType) {
			case "Attached":
				{
					console.log("Device is connected", connectEvent.Properties.SerialNumber);
					const deviceInfo = await this.getDeviceInfo(connectEvent.Properties.SerialNumber);
					if (deviceInfo) {
						const deviceName = getDeviceName(deviceInfo.ProductType);
						const device: Device = {
							id: connectEvent.DeviceID,
							name: deviceName ?? "iPhone",
							udid: connectEvent.Properties.SerialNumber,
							version: deviceInfo.ProductVersion,
						};
						this.devices.set(device.id, device);
					}
				}
				break;
			case "Detached":
				{
					console.log("Device is disconnected", connectEvent.Properties.SerialNumber);
					if (this.devices.has(connectEvent.DeviceID)) {
						this.devices.delete(connectEvent.DeviceID);
					} else {
						console.log("Couldn;t find device", connectEvent.DeviceID);
					}
				}
				break;
			default:
				{
					console.log("Unknown status of device", connectEvent.Properties.SerialNumber);
				}
				break;
		}
	};

	getDeviceInfo = async (udid: string): Promise<DeviceInfo | undefined> => {
		try {
			const { stdout, stderr, code } = await exec(go_ios_path, ["info", "--udid", udid]);
			const ti = JSON.parse(stdout);
			return new Promise((res) =>
				res({
					ActivationState: ti.ActivationState,
					ActivationStateAcknowledged: ti.ActivationStateAcknowledged,
					DeviceClass: ti.DeviceClass,
					DeviceColor: ti.DeviceColor,
					ProductName: ti.ProductName,
					ProductType: ti.ProductType,
					ProductVersion: ti.ProductVersion,
				} as DeviceInfo)
			);
		} catch (e: any) {
			console.log(e);
		}
		return new Promise((res) => res(undefined));
	};
}

export default DeviceManager;
