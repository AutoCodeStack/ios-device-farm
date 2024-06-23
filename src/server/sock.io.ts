import { Server as SocketIOServer, Socket } from "socket.io";
import logger from "../config/logger";
import { handleCommand, handleDestroy, handleDevicePrepare } from "./sock.handler";

// Function to initialize socket.io server and define event handlers
export const initializeSocket = (io: SocketIOServer) => {
	io.on("connection", (socket: Socket) => {
		logger.info("New client connected", socket.id);

		socket.on("command", async (data: any, callback: Function) => {
			await handleCommand(socket, data, callback);
		});

		socket.on("devicePrepare", async (data: any, callback: Function) => {
			await handleDevicePrepare(socket, data, callback);
		});

		socket.on("disconnect", async (reason) => {
			logger.info(`Client disconnected ${socket.id}: ${reason}`);
			await handleDestroy(socket);
		});

		socket.on("error", async (error: Error) => {
			logger.info(`[error] client error`);
			logger.info(error);
			await handleDestroy(socket);
		});

		socket.on("connect_error", (err) => {
			logger.info(`Connect Error: ${err.message}`);
		});
	});

	io.on("error", (error: Error) => {
		logger.error("socker error occured");
		logger.error(error);
		io.removeAllListeners();
	});

	io.on("disconnect", (error: Error) => {
		logger.error("socket disconnected");
		logger.error(error);
	});
};
