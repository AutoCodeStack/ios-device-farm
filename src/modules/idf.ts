import findFreePorts from "find-free-ports";
import { TunnelManager } from "./tunnel/tunnel.manager";
import { WdaControlClient } from "./wda-control/wda.control";
import { WdaStreamClient } from "./wda-stream/wda.stream";
import logger from "../config/logger";
import { WebDriverAgentProcess } from "./wda-control/wda.agent";
import { Socket } from "socket.io";
import { buildCommand } from "../schema/wda.types";

class IDF {
	tunnelManager: TunnelManager;
	wdaStreamClient: WdaStreamClient;
	wdaControlClient?: WdaControlClient;
	webdriveragent?: WebDriverAgentProcess;

	udid: string;
	socketClient: Socket;

	controlPort?: number;
	streamPort?: number;

	constructor(udid: string, socket: Socket) {
		this.socketClient = socket;
		this.udid = udid;
		this.tunnelManager = new TunnelManager(udid);
		this.wdaStreamClient = new WdaStreamClient();
	}

	getPorts() {
		return [this.controlPort, this.streamPort];
	}

	async sendCommand(data: any) {
		try {
			if (this.wdaControlClient) {
				const cmd = buildCommand(data);
				await this.wdaControlClient.performCommand(cmd);
			}
		} catch (error) {
			logger.error(`error in send command`, error);
		}
	}

	async start() {
		const [controlPort, streamPort] = await findFreePorts(2);
		this.controlPort = controlPort;
		this.streamPort = streamPort;
		/**
		 * start tunnel for control port
		 */
		try {
			await this.tunnelManager.startControlTunnel(controlPort);
		} catch (error) {
			logger.error(`error start tunnel for control port`, error);
			await this.stop();
			return false;
		}

		/**
		 * start tunnel for stream port
		 */
		try {
			await this.tunnelManager.startStreamTunnel(streamPort);
		} catch (error) {
			logger.error(`error start tunnel for stream port`, error);
			await this.stop();
			return false;
		}

		/**
		 * start webdriveragent
		 */
		try {
			this.webdriveragent = new WebDriverAgentProcess(this.udid, controlPort, streamPort);
			await this.webdriveragent.start();
		} catch (error) {
			logger.error(`error start tunnel for stream port`, error);
			await this.stop();
			return false;
		}

		/**
		 * start stream
		 */
		try {
			await this.wdaStreamClient.connect(streamPort);
			await this.wdaStreamClient.startProcessing();
		} catch (error) {
			logger.error(`error start tunnel for stream port`, error);
			await this.stop();
			return false;
		}

		/**
		 * start wda control
		 */
		try {
			this.wdaControlClient = new WdaControlClient(controlPort);
			await this.wdaControlClient.createWdaSession();
		} catch (error) {
			logger.error(`error creating wda control client`, error);
			await this.stop();
			return false;
		}

		/**
		 * setup listeners now and send data to socket
		 */
		this.tunnelManager?.on("tunnel_die", (code: number, signal: NodeJS.Signals) => {
			logger.info(`tunnel process died due to ${code} - ${signal}`);
		});

		this.wdaStreamClient?.on("data", (data: any) => {
			if (this.socketClient.connected) {
				this.socketClient.emit("imageFrame", data);
			}
		});

		this.webdriveragent.on("webdriver_died", (code: number, signal: NodeJS.Signals) => {
			logger.info(`webdriveragent died due to ${code} - ${signal}`);
		});
	}

	async stop() {
		try {
			await this.wdaControlClient?.deleteWdaSession();
		} catch (error) {
			logger.error(`error in stop wda control client deleteWdaSession`, error);
		}

		try {
			await this.webdriveragent?.stop();
		} catch (error) {
			logger.error(`error in stop webdriveragent stopAll`, error);
		}

		try {
			await this.wdaStreamClient.disconnect();
		} catch (error) {
			logger.error(`error in stop wda stream client disconnect`, error);
		}

		try {
			await this.tunnelManager.stopTunnels();
		} catch (error) {
			logger.error(`error in stop tunnels stopAll`, error);
		}

		this.removeListeners();
	}

	removeListeners(): void {
		if (this.tunnelManager) {
			this.tunnelManager.removeAllListeners();
		}

		if (this.webdriveragent) {
			this.webdriveragent.removeAllListeners();
		}

		if (this.wdaStreamClient) {
			this.wdaStreamClient.removeAllListeners();
		}
	}
}

export default IDF;
