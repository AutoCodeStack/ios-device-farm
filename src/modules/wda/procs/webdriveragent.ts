import { WebDriverAgentProcess } from "./webdriveragent.proc";
import { TunnelManager } from "./tunnel.proc";
import logger from "../../../config/logger";

class WebDriverAgent {
	udid: string;
	port?: number;
	mjpegPort?: number;
	private webDriverAgentProcess?: WebDriverAgentProcess;
	private tunnelManager?: TunnelManager;

	constructor(udid: string) {
		this.udid = udid;
	}

	get mjpegPortNumber() {
		return this.mjpegPort ?? 9100;
	}

	async start(): Promise<boolean> {
		try {
			this.webDriverAgentProcess = new WebDriverAgentProcess();
			const wdaStartStatus = await this.webDriverAgentProcess.start(this.udid);

			if (!wdaStartStatus) {
				return false;
			}

			this.port = this.webDriverAgentProcess.port;
			this.mjpegPort = this.webDriverAgentProcess.mjpegPort;

			if (this.port === undefined || this.mjpegPort === undefined) {
				await this.stopWebDriverAgent();
				return false;
			}

			this.tunnelManager = new TunnelManager(this.port, this.mjpegPort);
			const tunnelStartStatus = await this.tunnelManager.startTunnel(this.udid);
			if (!tunnelStartStatus) {
				await this.stopWebDriverAgent();
				return false;
			}

			const mjpegTunnelStatus = await this.tunnelManager.startMjpegTunnel(this.udid);
			if (!mjpegTunnelStatus) {
				await this.stopWebDriverAgent();
				return false;
			}

			return true;
		} catch (error: unknown) {
			logger.error("Error starting WebDriverAgent:", error);
			return false;
		}
	}

	async stopWebDriverAgent(): Promise<void> {
		try {
			await this.webDriverAgentProcess?.stop();
			await this.tunnelManager?.stopTunnels();
		} catch (error: unknown) {
			logger.error("Failed to stop WebDriverAgent process:", error);
		} finally {
			this.cleanupEventListeners();
		}
	}

	private cleanupEventListeners(): void {
		this.webDriverAgentProcess?.removeListeners();
		this.tunnelManager?.removeListeners();
	}
}

export { WebDriverAgent };
