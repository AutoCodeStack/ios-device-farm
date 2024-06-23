import findFreePorts from "find-free-ports";
import { SubProcess } from "teen_process";
import logger from "../../config/logger";
import { APP_ENV } from "../../config/config";
import EventEmitter from "events";
import { getXcodeBuildCommandArgs } from "../../utils/cmd.utils";

class WebDriverAgentProcess extends EventEmitter {
	controlPort: number;
	streamPort: number;
	udid: string;
	private proc?: SubProcess;

	constructor(udid: string, controlPort: number, streamPort: number) {
		super();
		this.udid = udid;
		this.controlPort = controlPort;
		this.streamPort = streamPort;
	}

	async start(): Promise<void> {
		const args = getXcodeBuildCommandArgs(this.udid, this.controlPort, this.streamPort);
		this.proc = new SubProcess("xcodebuild", args, { cwd: APP_ENV.WEBDRIVERAGENT_PROJECT });
		this.proc.on("die", this.onProcessDie);
		const sd = (stdout: string, stderr: string) => stdout.includes("<-ServerURLHere");
		return await this.proc.start(sd, 60000);
	}

	async stop(): Promise<void> {
		if (this.proc) {
			await this.proc.stop("SIGINT");
			logger.info("WebDriverAgent process stopped successfully.");
			this.removeListeners();
		}
	}

	removeListeners(): void {
		if (this.proc) {
			this.proc.removeAllListeners();
		}
	}

	private onProcessDie = async (code: number, signal: NodeJS.Signals) => {
		this.emit("webdriver_died", code, signal);
	};
}

export { WebDriverAgentProcess };
