import express, { Request, Response } from "express";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import logger from "../config/logger";
import { initializeSocket } from "./sock.io";
import deviceRoute from "../routes/device.routes";
import { APP_ENV } from "../config/config";

const app = express();
const server: http.Server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
	res.sendFile(__dirname + "/index.html");
});

app.use("/api/device", deviceRoute);

server.on("error", (error) => {
	logger.error(`Server error: ${error.message}`);
});

server.listen(APP_ENV.PORT, () => {
	logger.info(`Server is listening on port ${APP_ENV.PORT}`);
	initializeSocket(io);
});
