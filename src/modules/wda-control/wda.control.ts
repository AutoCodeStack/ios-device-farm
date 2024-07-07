import logger from "../../config/logger";
import { Command, Session, WdaCommands } from "../../schema/wda.types";
import { HttpMethod, WdaEndpoints } from "./wda-endpoints";
import { WdaService } from "./wda-service";

class WdaControlClient {
	service: WdaService;
	sessionId: string = "0";

	constructor(port: number) {
		this.service = new WdaService(port);
	}

	async createWdaSession(): Promise<void> {
		try {
			const postData = { capabilities: {} };
			const response = await this.service.apiCall(WdaEndpoints.CREATE_SESSION, HttpMethod.POST, postData);
			const session: Session = response.data;
			if (session?.sessionId) {
				this.sessionId = session.sessionId;
			} else {
				throw new Error("Invalid session data received");
			}
		} catch (error: any) {
			logger.error(`Failed to create WDA session: ${error.message || error}`);
			throw new Error("Failed to create WDA session");
		}
	}

	async deleteWdaSession(): Promise<Session> {
		try {
			const response = await this.service.apiCall(WdaEndpoints.DELETE_SESSION, HttpMethod.DELETE, null, { sessionId: this.sessionId });
			logger.info("WDA session deleted", response.data);
			const session: Session = response.data;
			if (session) {
				return session;
			} else {
				throw new Error(response.data?.value?.message || "Failed to delete WDA session");
			}
		} catch (error: any) {
			logger.error(`Failed to delete WDA session: ${error.message || error}`);
			throw new Error("Failed to delete WDA session");
		} finally {
			this.sessionId = "0";
		}
	}

	async performCommand(command: Command): Promise<{ success: boolean }> {
		const params = { sessionId: this.sessionId };
		try {
			let endpoint: WdaEndpoints;
			let method: HttpMethod;
			let postData: any = command.values;
			switch (command.cmd) {
				case WdaCommands.OPEN_URL:
					endpoint = WdaEndpoints.OPEN_URL;
					method = HttpMethod.POST;
					break;
				case WdaCommands.TAP:
					endpoint = WdaEndpoints.CUSTOM_TAP;
					method = HttpMethod.POST;
					break;
				case WdaCommands.TEXT_INPUT:
					endpoint = WdaEndpoints.ENTER_TEXT;
					method = HttpMethod.POST;
					break;
				case WdaCommands.HOMESCREEN:
					console.log("homescreen");
					endpoint = WdaEndpoints.WDA_HOMESCREEN;
					method = HttpMethod.POST;
					postData = null; // HOMESCREEN might not require data
					break;
				case WdaCommands.SWIPE:
					console.log("swipe");
					endpoint = WdaEndpoints.SWIPE;
					method = HttpMethod.POST;
					break;
				default:
					logger.error("Unknown command");
					return { success: false };
			}

			const response = await this.service.apiCall(endpoint, method, postData, params);
			if (response.status === 200) {
				return { success: true };
			} else {
				throw new Error(response.data?.value?.message || "Unknown command execution error");
			}
		} catch (error: any) {
			logger.error(`Command execution failed: ${error.message || error}`);
			throw new Error(`Failed to execute command`);
		}
	}
}

export { WdaControlClient };
