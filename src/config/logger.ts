import { createLogger, format, transports, Logger } from "winston";
import * as path from "path";

const { combine, timestamp, printf, colorize } = format;

// Define the custom format for log messages
const logFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} [${level}]: ${message}`;
});

// Initialize the logger
const logger: Logger = createLogger({
	level: "info", // Set the default log level
	format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
	transports: [
		new transports.Console({
			format: combine(colorize(), logFormat),
		}),
		new transports.File({
			filename: path.join(__dirname, "../../logs/error.log"),
			level: "error",
		}),
		new transports.File({ filename: path.join(__dirname, "../../logs/combined.log") }),
	],
	exitOnError: false, // Do not exit on handled exceptions
});

export default logger;
