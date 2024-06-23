import net from "net";
import { EventEmitter } from "events";
import MjpegParser from "./mjpeg.parser";
import logger from "../../config/logger";

class WdaStreamClient extends EventEmitter {
	private client: net.Socket | null = null;
	private consumer = new MjpegParser();

	constructor() {
		super(); // Call the EventEmitter constructor
	}

	async connect(connectPort: number): Promise<void> {
		if (this.client) {
			this.client.destroy(); // Clean up any existing connection
		}

		this.client = new net.Socket();
		try {
			// Await the connection
			await new Promise<void>((resolve, reject) => {
				this.client?.connect({ port: connectPort }, resolve);
				this.client?.on("error", reject);
			});

			// Send initial message or perform initial action
			this.client.write("hello");

			// Listen for data and emit events
			this.client.pipe(this.consumer).on("data", (data: Buffer) => {
				this.emit("data", data); // Emit data for async processing
			});

			logger.info("Connected successfully");
		} catch (err) {
			console.error("Connection error:", (err as Error).message);
			this.client?.destroy();
			throw err;
		}
	}

	async waitForFirstData(): Promise<Buffer> {
		if (!this.client) {
			throw new Error("Client is not connected");
		}

		return new Promise<Buffer>((resolve, reject) => {
			this.once("data", resolve); // Resolve with the first data chunk received
			this.once("error", reject); // Reject on error
			this.once("close", () => reject(new Error("Connection closed"))); // Reject if the connection is closed
		});
	}

	async startProcessing(): Promise<void> {
		try {
			const firstData = await this.waitForFirstData();
			logger.info("tcp fetch started");
		} catch (err) {
			console.error("Failed to start processing:", (err as Error).message);
			throw err;
		}
	}

	async handleContinuousStream(callback: (data: Buffer) => void): Promise<void> {
		if (!this.client) {
			throw new Error("Client is not connected");
		}
		this.on("data", callback); // Register the callback to handle each data chunk
	}

	async disconnect(): Promise<void> {
		if (this.client) {
			this.client.destroy();
			this.client = null;
		}
	}
}

export { WdaStreamClient };
