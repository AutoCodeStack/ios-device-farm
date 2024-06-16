import * as net from "net";
import { EventEmitter } from "events";
import MjpegParser from "./mjpeg.parser";
import fs from "fs";

class MjpegStreamSocketClient extends EventEmitter {
	private host: string;
	private port: number;
	private reconnectInterval: number;
	private client: net.Socket | null = null;
	private consumer: MjpegParser;

	constructor(host: string, port: number, reconnectInterval: number = 5000) {
		super();
		this.host = host;
		this.port = port;
		this.reconnectInterval = reconnectInterval;
		this.consumer = new MjpegParser();
	}

	// Method to connect to the server
	connect() {
		if (this.client) {
			this.client.destroy(); // Clean up any existing connection
		}

		this.client = new net.Socket();

		this.client.connect(this.port, this.host, () => {
			console.log(`Connected to server at ${this.host}:${this.port}`);
			if (this.client) {
				this.client.write("hello");
			}
			this.emit("connected");
		});

		this.client.pipe(this.consumer).on("data", (data: Buffer) => {
			this.emit("data", data);
		});

		this.client.on("error", (err: Error) => {
			console.error("Error:", err.message);
			this.emit("error", err);
			this.client?.destroy();
			setTimeout(() => this.connect(), this.reconnectInterval);
		});

		this.client.on("close", () => {
			console.log("Connection closed");
			this.emit("close");
			setTimeout(() => this.connect(), this.reconnectInterval);
		});
	}

	// Method to disconnect from the server
	disconnect() {
		if (this.client) {
			this.client.destroy();
			this.client = null;
			console.log("Client disconnected manually");
			this.emit("disconnected");
		}
	}
}

export default MjpegStreamSocketClient;
