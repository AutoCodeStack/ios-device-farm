import findFreePorts from "find-free-ports";
import { SubProcess } from "teen_process";
import logger from "../../../config/logger";
import { APP_ENV } from "../../../config/config";

class WebDriverAgentProcess {
	public port?: number;
	public mjpegPort?: number;
	private process?: SubProcess;

	async start(udid: string): Promise<boolean> {
		try {
			[this.port, this.mjpegPort] = await findFreePorts(2);
			if (!this.port || !this.mjpegPort) {
				throw new Error("Failed to find free ports for WebDriverAgent.");
			}

			const args = ["test", "-scheme", "WebDriverAgentRunner", "-destination", `id=${udid}`, `USE_PORT=${this.port}`, `MJPEG_SERVER_PORT=${this.mjpegPort}`];

			this.process = new SubProcess("xcodebuild", args, {
				cwd: APP_ENV.WEBDRIVERAGENT_PROJECT,
			});
			this.process.on("die", this.onProcessDie);
			const successDetector = (stdout: string, stderr: string) => stdout.includes("<-ServerURLHere");
			await this.process.start(successDetector, 60000);
			logger.info(`WebDriverAgent started on port ${this.port} with MJPEG server on port ${this.mjpegPort}`);
			return true;
		} catch (error: unknown) {
			logger.error("Failed to start WebDriverAgent process:", error);
			return false;
		}
	}

	async stop(): Promise<void> {
		if (this.process) {
			await this.process.stop("SIGINT");
			logger.info("WebDriverAgent process stopped successfully.");
			this.removeListeners();
		}
	}

	removeListeners(): void {
		if (this.process) {
			this.process.removeAllListeners("die");
		}
	}

	private onProcessDie = async (code: number, signal: NodeJS.Signals) => {
		logger.warn(`WebDriverAgent process terminated with code ${code} and signal ${signal}`);
	};
}

export { WebDriverAgentProcess };
