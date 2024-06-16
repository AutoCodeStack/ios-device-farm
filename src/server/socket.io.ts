import { Server, Socket } from "socket.io";
import * as http from "http";
import logger from "../config/logger";
import { onCommand, onDestroy, onPrepare } from "./client.handler";

let socket: Server;

export const buildSocketServer = (httpServer: http.Server) => {
	socket = new Server(httpServer, { cors: { origin: "*" } });
	socket.on("connection", onConnection);
	socket.on("error", serverError);
	socket.on("disconnect", serverError);
};

export const onConnection = (socket: Socket) => {
	logger.info(`A socket client has connected`);

	socket.on("command", onCommand);
	socket.on("prepare", onPrepare);
	socket.on("disconnect", async () => {
		logger.info(`[disconnect] client has disconnected`);
		await onDestroy(socket);
	});
	socket.on("error", async (error: Error) => {
		logger.info(`[error] client error`);
		logger.info(error);
		await onDestroy(socket);
	});
};

export const serverError = (err: Error) => {
	logger.error("socker error occured");
	logger.error(err);
	socket.removeAllListeners();
};
