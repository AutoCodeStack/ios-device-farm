import findFreePorts from "find-free-ports";
import { SubProcess } from "teen_process";
import { APP_ENV } from "../../../config/config";
import logger from "../../../config/logger";

class WebDriverAgent {
	port?: number;
	mjpegPort?: number;
	webDriverAgentProcess?: SubProcess;
	tunnelProcess?: SubProcess;

	start = async (udid: string) => {
		const wdaStartStatus = await this.startWebDriverAgentProcess(udid);
		if (!wdaStartStatus) {
			return new Promise((res) => res(false));
		}

		const tunnelStartStatus = await this.startTunnel(udid);
		if (!tunnelStartStatus) {
			await this.stopWebDriverAgent();
			return new Promise((res) => res(false));
		}

		return new Promise((res) => res(true));
	};

	startWebDriverAgentProcess = async (udid: string) => {
		try {
			const [a, b] = await findFreePorts(2);
			const wdaProject = APP_ENV.WEBDRIVERAGENT_PROJECT + "/WebDriverAgent.xcodeproj";
			const args = ["test", "-project", wdaProject, "-scheme", "WebDriverAgentRunner", "-destination", `id=${udid}`, `USE_PORT=${a}`, `MJPEG_SERVER_PORT=${b}`];
			this.webDriverAgentProcess = new SubProcess("xcodebuild", args);
			this.webDriverAgentProcess.on("die", this.onProcessDie);
			const sd = (stdout: string, stderr: string) => {
				console.log(stdout);
				console.log(stderr);
				return stderr.indexOf("<-ServerURLHere") >= 0;
			};
			await this.webDriverAgentProcess.start(sd, 60000);
			this.port = a;
			this.mjpegPort = b;
			return new Promise((res) => res(true));
		} catch (error: Error | any) {
			logger.error(`Webdriveragent process start error`);
			logger.error(error);
		}
		return new Promise((res) => res(false));
	};

	startTunnel = async (udid: string) => {
		try {
			const args = ["forward", `--udid=${udid}`, `${this.port}`, `${this.port}`];
			this.webDriverAgentProcess = new SubProcess(APP_ENV.GO_IOS, args);
			this.webDriverAgentProcess.on("die", this.onTunnelDie);
			await this.webDriverAgentProcess.start(0);
			return new Promise((res) => res(true));
		} catch (error: Error | any) {
			logger.error(`Webdriveragent tunnel process start error`);
			logger.error(error);
		}
		return new Promise((res) => res(false));
	};

	stopWebDriverAgent = async () => {
		try {
			this.webDriverAgentProcess?.stop("SIGINT");
		} catch (error: Error | any) {
			logger.error(`Webdriveragent process stop error`);
			logger.error(error);
		}
	};

	onProcessDie = async (code: number, signal: NodeJS.Signals) => {
		console.log(`WebDriverAgent process died ${code} ${signal}`);
	};

	onTunnelDie = async (code: number, signal: NodeJS.Signals) => {
		console.log(`WebDriverAgent tunnel process died ${code} ${signal}`);
	};
}

export { WebDriverAgent };
