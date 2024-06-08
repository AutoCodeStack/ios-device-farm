import { EventEmitter } from "events";
import { SubProcess } from "teen_process";
import { go_ios_path } from "../../utils/path.utils";
import { Convert, DeviceConnectEvent } from "../../schema/device";

class DeviceDetector extends EventEmitter {
	private listenProcess: SubProcess;

	constructor() {
		super();
		this.listenProcess = new SubProcess(go_ios_path, ["listen"]);
	}

	public startDeviceListen = async (): Promise<void> => {
		this.listenProcess.on("exit", this.listenExit);
		this.listenProcess.on("output", this.handleProcessOutput);
		try {
			await this.listenProcess.start(0);
		} catch (err) {
			console.error("Failed to start the DeviceEvent listening process:", err);
		}
	};

	private listenExit = (code: number | null, signal: NodeJS.Signals | null): void => {
		console.log(`Exited with code ${code} from signal ${signal}`);
	};

	private handleProcessOutput = (stdout: string | null, stderr: string | null): void => {
		if (stdout) {
			this.processStdout(stdout);
		}

		if (stderr) {
			console.error("Error in device listen:", stderr);
		}
	};

	private processStdout = (stdout: string): void => {
		try {
			const deviceConnectEvent = Convert.toDeviceConnectEvent(stdout);
			this.handleDeviceConnectEvent(deviceConnectEvent);
		} catch (err) {
			console.error("Failed to process stdout:", err);
		}
	};

	private handleDeviceConnectEvent = async (connectEvent: DeviceConnectEvent): Promise<void> => {
		const {
			MessageType,
			Properties: { SerialNumber },
		} = connectEvent;

		switch (MessageType) {
			case "Attached":
				console.log("[DeviceConnectEvent]", SerialNumber);
				this.emit("add", connectEvent);
				break;
			case "Detached":
				console.log("Device is disconnected", SerialNumber);
				this.emit("delete", connectEvent);
				break;
			default:
				console.log("Unknown status of device", SerialNumber);
				break;
		}
	};
}

export default DeviceDetector;
