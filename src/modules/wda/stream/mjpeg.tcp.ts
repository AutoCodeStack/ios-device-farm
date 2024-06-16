import net from "net";
import { EventEmitter } from "events";
import MjpegParser from "./mjpeg.parser";

class MjpegStreamSocketClient extends EventEmitter {
	private port: number;
	private client: net.Socket | null = null;
	private consumer = new MjpegParser();

	constructor(port: number) {
		super(); // Call the EventEmitter constructor
		this.port = port;
	}

	// Method to connect to the server using async/await
	async connect(): Promise<void> {
		if (this.client) {
			this.client.destroy(); // Clean up any existing connection
		}

		this.client = new net.Socket();

		try {
			// Await the connection
			await new Promise<void>((resolve, reject) => {
				this.client?.connect({ port: this.port }, resolve);
				this.client?.on("error", reject);
			});

			// Send initial message or perform initial action
			this.client.write("hello");

			// Listen for data and emit events
			this.client.pipe(this.consumer).on("data", (data: Buffer) => {
				this.emit("data", data); // Emit data for async processing
			});

			console.log("Connected successfully");
		} catch (err) {
			console.error("Connection error:", (err as Error).message);
			this.client?.destroy();
			throw err;
		}
	}

	// Method to wait for the first chunk of data
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

	// Method to start processing data
	async startProcessing(): Promise<void> {
		try {
			const firstData = await this.waitForFirstData();
			console.log("tcp fetch started");
			// Here you can handle the first chunk of data or start continuous processing
		} catch (err) {
			console.error("Failed to start processing:", (err as Error).message);
			throw err;
		}
	}

	// Method to handle the continuous data stream
	async handleContinuousStream(callback: (data: Buffer) => void): Promise<void> {
		if (!this.client) {
			throw new Error("Client is not connected");
		}
		this.on("data", callback); // Register the callback to handle each data chunk
	}

	// Method to disconnect from the server
	async disconnect(): Promise<void> {
		if (this.client) {
			this.client.destroy();
			this.client = null;
			console.log("Client disconnected manually");
		}
	}
}

export default MjpegStreamSocketClient;
