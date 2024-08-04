import { SubProcess } from "teen_process";
import { getRunTestCommandArgs } from "../../utils/cmd.utils";
import { APP_ENV } from "../../config/config";
import logger from "../../config/logger";

class WdaGoIOS {
	controlPort: number;
	streamPort: number;
	udid: string;
	version: number;
	private runWdaProc?: SubProcess;
	private tunnelProc?: SubProcess;

	constructor(udid: string, version: number, controlPort: number, streamPort: number) {
		this.udid = udid;
		this.version = version;
		this.controlPort = controlPort;
		this.streamPort = streamPort;
	}

	async start(): Promise<void> {
		await this.startTunnel();
		const args = getRunTestCommandArgs(this.udid, this.controlPort, this.streamPort);
		this.runWdaProc = new SubProcess(APP_ENV.GO_IOS, args);
		this.runWdaProc.on("output", (stdout, stderr) => {
			logger.error(`stderr: ${stderr}`);
		});
		this.runWdaProc.on("die", this.onProcessDie);
		await this.runWdaProc.start(0);
		return await new Promise((f) => setTimeout(f, 5000));
	}

	async startTunnel(): Promise<void> {
		this.tunnelProc = new SubProcess(APP_ENV.GO_IOS, ["tunnel", "start", "--userspace", "--udid", this.udid]);
		this.tunnelProc.on("output", (stdout, stderr) => {
			logger.error(`stderr: ${stderr}`);
		});
		this.tunnelProc.on("die", this.onProcessDie);
		await this.tunnelProc.start(0);
		await new Promise((f) => setTimeout(f, 5000));
	}

	async stop(): Promise<void> {
		if (this.tunnelProc) {
			await this.tunnelProc.stop("SIGINT");
			logger.info("tunnel for device stopped successfully.");
		}

		if (this.runWdaProc) {
			await this.runWdaProc.stop("SIGINT");
			logger.info("runwda process stopped");
			this.removeListeners();
		}
	}

	removeListeners(): void {
		if (this.tunnelProc) {
			this.tunnelProc.removeAllListeners();
		}

		if (this.runWdaProc) {
			this.runWdaProc.removeAllListeners();
		}
	}

	private onProcessDie = async (code: number, signal: NodeJS.Signals) => {
		logger.error(`runwda died ${code} ${signal}`);
	};
}

export default WdaGoIOS;
