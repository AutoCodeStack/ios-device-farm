import { SubProcess } from "teen_process";
import logger from "../../../config/logger";
import { APP_ENV } from "../../../config/config";

class TunnelManager {
	private port: number;
	private mjpegPort: number;
	private tunnelProcess?: SubProcess;
	private mjpegTunnelProcess?: SubProcess;

	constructor(port: number, mjpegPort: number) {
		this.port = port;
		this.mjpegPort = mjpegPort;
	}

	async startTunnel(udid: string): Promise<boolean> {
		try {
			const args = ["forward", `--udid=${udid}`, `${this.port}`, `${this.port}`];
			const match = `Start listening on port ${this.port} forwarding to port ${this.port} on device`;
			this.tunnelProcess = new SubProcess(APP_ENV.GO_IOS, args);
			this.tunnelProcess.on("die", this.onTunnelDie);
			const successDetector = (stdout: string, stderr: string) => stderr.includes(match);
			await this.tunnelProcess.start(successDetector, 60000);
			logger.info(`Tunnel started for WebDriverAgent on port ${this.port}`);
			return true;
		} catch (error: unknown) {
			logger.error("Failed to start WebDriverAgent tunnel:", error);
			return false;
		}
	}

	async startMjpegTunnel(udid: string): Promise<boolean> {
		try {
			const args = ["forward", `--udid=${udid}`, `${this.mjpegPort}`, `${this.mjpegPort}`];
			const match = `Start listening on port ${this.mjpegPort} forwarding to port ${this.mjpegPort} on device`;
			this.mjpegTunnelProcess = new SubProcess(APP_ENV.GO_IOS, args);
			this.mjpegTunnelProcess.on("die", this.onTunnelDie);
			const successDetector = (stdout: string, stderr: string) => stderr.includes(match);
			await this.mjpegTunnelProcess.start(successDetector, 60000);
			logger.info(`Mjpeg Tunnel started for WebDriverAgent on port ${this.mjpegPort}`);
			return true;
		} catch (error: unknown) {
			logger.error("Failed to start Mjpeg Tunnel WebDriverAgent tunnel:", error);
			return false;
		}
	}

	async stopTunnels(): Promise<void> {
		if (this.tunnelProcess) {
			await this.tunnelProcess.stop("SIGINT");
			logger.info("Tunnel process stopped successfully.");
			this.removeListeners(this.tunnelProcess);
		}
		if (this.mjpegTunnelProcess) {
			await this.mjpegTunnelProcess.stop("SIGINT");
			logger.info("Mjpeg Tunnel process stopped successfully.");
			this.removeListeners(this.mjpegTunnelProcess);
		}
	}

	removeListeners(process?: SubProcess): void {
		process?.removeAllListeners("die");
	}

	private onTunnelDie = async (code: number, signal: NodeJS.Signals) => {
		logger.warn(`Tunnel process terminated with code ${code} and signal ${signal}`);
	};
}

export { TunnelManager };
