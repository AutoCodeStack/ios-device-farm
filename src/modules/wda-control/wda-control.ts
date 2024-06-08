import { Session } from "./types/session";
import { createSession, deleteSession } from "./commands/session-commands";
import { openUrlCommand, tapCommand, textCommand } from "./commands/session-commands";
import { homeScreenCommand } from "./commands/custom-commands";

class WdaControl {
	port: number;
	sessionId: string = "0";

	constructor(port: number) {
		this.port = port;
	}

	createWdaSession = async () => {
		try {
			const response = await createSession(this.port);
			const session: Session = response.data;
			if (session) {
				this.sessionId = session.sessionId;
			}
		} catch (error) {
			throw new Error("Failed to create WDA session");
		}
	};

	deleteWdaSession = async (): Promise<Session | null> => {
		const response = await deleteSession(this.port, this.sessionId);
		const session: Session = response.data;
		return new Promise((resolve, reject) => {
			if (session) {
				resolve(session);
			} else {
				reject({ message: response.data.value.message });
			}
		});
	};

	openUrl = async (urlToOpen: string): Promise<any> => {
		const response = await openUrlCommand(this.port, this.sessionId, urlToOpen);
		return new Promise((resolve, reject) => {
			if (response.status === 200) {
				resolve({ success: true });
			} else {
				reject({ message: response.data.value.message });
			}
		});
	};

	openHomeScreen = async (): Promise<any> => {
		const response = await homeScreenCommand(this.port);
		return new Promise((resolve, reject) => {
			if (response.status === 200) {
				resolve({ success: true });
			} else {
				reject({ message: response.data.value.message });
			}
		});
	};

	typeText = async (text: string): Promise<any> => {
		const response = await textCommand(this.port, this.sessionId, text);
		return new Promise((resolve, reject) => {
			if (response.status === 200) {
				resolve({ success: true });
			} else {
				reject({ message: response.data.value.message });
			}
		});
	};

	tapByCoordinates = async (x: number, y: number): Promise<any> => {
		const response = await tapCommand(this.port, this.sessionId, x, y);
		return new Promise((resolve, reject) => {
			if (response.status === 200) {
				resolve({ success: true });
			} else {
				reject({ message: response.data.value.message });
			}
		});
	};
}

export { WdaControl };
