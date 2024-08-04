import findFreePorts from "find-free-ports";
import { TunnelManager } from "./tunnel/tunnel.manager";
import { WdaControlClient } from "./wda-control/wda.control";
import { WdaStreamClient } from "./wda-stream/wda.stream";
import logger from "../config/logger";
import { Socket } from "socket.io";
import { buildCommand } from "../schema/wda.types";
import { SubProcess } from "teen_process";
import WdaGoIOS from "./wda-control/wda.go.ios";
import { getDeviceVersion } from "../schema/device.type";

class IDF {
	tunnelManager: TunnelManager;
	wdaStreamClient: WdaStreamClient;
	wdaControlClient?: WdaControlClient;
	wdaGoIOS?: WdaGoIOS;

	udid: string;
	version: number;
	socketClient: Socket;

	controlPort?: number;
	streamPort?: number;

	streamClient?: SubProcess;

	constructor(udid: string, version: string, socket: Socket) {
		this.socketClient = socket;
		this.udid = udid;
		this.tunnelManager = new TunnelManager(udid);
		this.wdaStreamClient = new WdaStreamClient();
		this.version = getDeviceVersion(version);
	}

	getPorts() {
		return [this.controlPort, this.streamPort];
	}

	async sendCommand(data: any) {
		logger.info(`send command ${JSON.stringify(data)}`);
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
			this.wdaGoIOS = new WdaGoIOS(this.udid, this.version, controlPort, streamPort);
			await this.wdaGoIOS.start();
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

		// this.wdaGoIOS.on("webdriver_died", (code: number, signal: NodeJS.Signals) => {
		// 	logger.info(`webdriveragent died due to ${code} - ${signal}`);
		// });
	}

	async stop() {
		try {
			await this.wdaControlClient?.deleteWdaSession();
		} catch (error) {
			logger.error(`error in stop wda control client deleteWdaSession`, error);
		}

		try {
			await this.wdaGoIOS?.stop();
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

		if (this.wdaGoIOS) {
			this.wdaGoIOS.removeListeners();
		}

		if (this.wdaStreamClient) {
			this.wdaStreamClient.removeAllListeners();
		}
	}
}

export default IDF;
