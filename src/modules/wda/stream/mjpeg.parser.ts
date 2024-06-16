// Import necessary modules and types
import { Transform, TransformCallback, TransformOptions } from "stream";
import { Buffer } from "buffer";
import sharp from "sharp";
import logger from "../../../config/logger";

// Regex to find the Content-Length header in the HTTP response
const lengthRegex = /Content-Length:\s*(\d+)/i;

const soi = Buffer.from([0xff, 0xd8]);
const eoi = Buffer.from([0xff, 0xd9]);

// Define the class that extends the Transform stream
class MjpegParser extends Transform {
	private buffer: Buffer | null = null;
	private reading: boolean = false;
	private contentLength: number | null = null;
	private bytesWritten: number = 0;

	constructor(options?: TransformOptions) {
		super(options);
	}

	private _initFrame(len: number, chunk: Buffer, start: number, end: number) {
		this.contentLength = len;
		this.buffer = Buffer.alloc(len);
		this.bytesWritten = 0;

		const hasStart = typeof start !== "undefined" && start > -1;
		const hasEnd = typeof end !== "undefined" && end > -1 && end > start;

		if (hasStart) {
			let bufEnd = chunk.length;

			if (hasEnd) {
				bufEnd = end + eoi.length;
			}

			chunk.copy(this.buffer, 0, start, bufEnd);
			this.bytesWritten = chunk.length - start;

			// If we have the EOI bytes, send the frame
			if (hasEnd) {
				this._sendFrame();
			} else {
				this.reading = true;
			}
		}
	}

	private _readFrame(chunk: Buffer, start: number, end: number) {
		const bufStart = start > -1 && start < end ? start : 0;
		const bufEnd = end > -1 ? end + eoi.length : chunk.length;

		chunk.copy(this.buffer!, this.bytesWritten, bufStart, bufEnd);
		this.bytesWritten += bufEnd - bufStart;

		if (end > -1 || this.bytesWritten === this.contentLength) {
			this._sendFrame();
		} else {
			this.reading = true;
		}
	}

	/**
	 * Handle sending the frame to the next stream and resetting state
	 */
	private async _sendFrame() {
		this.reading = false;
		if (this.buffer) {
			sharp(this.buffer)
				.jpeg({ quality: 50 })
				.toBuffer()
				.then((data: Buffer) => {
					this.push(data);
				})
				.catch((err: any) => {
					//logger.error();
				});
		}
	}

	_transform(chunk: Buffer, encoding: BufferEncoding, done: TransformCallback) {
		const start = chunk.indexOf(soi);
		const end = chunk.indexOf(eoi);
		const len = parseInt((lengthRegex.exec(chunk.toString("ascii")) || [])[1]);

		if (this.buffer && (this.reading || start > -1)) {
			this._readFrame(chunk, start, end);
		}

		if (len) {
			this._initFrame(len, chunk, start, end);
		}

		done();
	}
}

export default MjpegParser;
