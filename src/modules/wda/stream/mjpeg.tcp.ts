import { Socket } from "net";
import ws from "ws";

class TcpClient {
	private socket: Socket;
	private host: string;
	private port: number;
	private buffer: Buffer = Buffer.alloc(0);
	private frameStart: number = 0;

	constructor(host: string, port: number) {
		this.host = host;
		this.port = port;
		this.socket = new Socket();
	}

	async connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.socket.on("connect", () => {
				console.log(`Connected to ${this.host}:${this.port}`);
				this.socket.write("data", (error) => {
					resolve();
				});
			});
			this.socket.on("error", (error) => {
				reject(error);
			});
			this.socket.connect(this.port, this.host);
		});
	}

	// async sendData(data: string): Promise<void> {
	// 	if (!this.socket) {
	// 		throw new Error("Not connected");
	// 	}
	// 	return new Promise((resolve, reject) => {
	// 		this.socket?.write(data, (error) => {
	// 			if (error) {
	// 				reject(error);
	// 			} else {
	// 				console.log(`Data sent: ${data}`);
	// 				resolve();
	// 			}
	// 		});
	// 	});
	// }

	async receiveData(wss: ws.WebSocket): Promise<string> {
		if (!this.socket) {
			throw new Error("Not connected");
		}

		return new Promise((resolve, reject) => {
			let data = "";

			this.socket.on("data", (chunk) => {
				if (wss.readyState === ws.WebSocket.OPEN) {
					console.log("sending data", chunk.length);
					// wss.send(frame.data);
				}
			});

			this.socket.on("end", () => {
				resolve(data);
			});

			this.socket.on("error", (error) => {
				reject(error);
			});
		});
	}

	async close(): Promise<void> {
		if (!this.socket) {
			return;
		}
		return new Promise((resolve, reject) => {
			this.socket.destroy();
			resolve();
		});
	}

	private parseMetadata(header: string): { [key: string]: string } {
		const lines = header.split("\r\n");
		const metadata: { [key: string]: string } = {};
		for (const line of lines) {
			const parts = line.split(": ");
			if (parts.length === 2) {
				metadata[parts[0].trim()] = parts[1].trim();
			}
		}
		return metadata;
	}
}

export default TcpClient;

interface MjpegFrame {
	header: string;
	data: Buffer;
	metadata: { [key: string]: string };
}
