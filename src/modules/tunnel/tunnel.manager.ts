import { SubProcess } from "teen_process";
import logger from "../../config/logger";
import { APP_ENV } from "../../config/config";
import EventEmitter from "events";
import { getTunnelCommandArgs } from "../../utils/cmd.utils";

class TunnelManager extends EventEmitter {
	private udid: string;
	private controlProc?: SubProcess;
	private streamProc?: SubProcess;

	constructor(udid: string) {
		super();
		this.udid = udid;
	}

	async startControlTunnel(port: number): Promise<void> {
		const [proc, sd] = this.createTunnelProcess(port);
		this.controlProc = proc;
		return await this.controlProc.start(sd, 60000);
	}

	async startStreamTunnel(port: number): Promise<void> {
		const [proc, sd] = this.createTunnelProcess(port);
		this.streamProc = proc;
		return this.streamProc.start(sd, 60000);
	}

	private createTunnelProcess(port: number): [SubProcess, any] {
		const match = `Start listening on port ${port} forwarding to port ${port} on device`;
		const proc = new SubProcess(APP_ENV.GO_IOS, getTunnelCommandArgs(this.udid, port));
		proc.on("die", this.onTunnelDie);
		const sd = (stdout: string, stderr: string) => stderr.includes(match);
		return [proc, sd];
	}

	async stopTunnels(): Promise<void> {
		if (this.controlProc) {
			await this.controlProc.stop("SIGINT");
			logger.info("Tunnel process stopped successfully.");
			this.removeListeners(this.controlProc);
		}

		if (this.streamProc) {
			await this.streamProc.stop("SIGINT");
			logger.info("Mjpeg Tunnel process stopped successfully.");
			this.removeListeners(this.streamProc);
		}
	}

	removeListeners(p?: SubProcess): void {
		p?.removeAllListeners("die");
	}

	private onTunnelDie = async (code: number, signal: NodeJS.Signals) => {
		this.emit("tunnel_die", code, signal);
	};
}

export { TunnelManager };
