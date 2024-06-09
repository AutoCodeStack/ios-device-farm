import express, { Request, Response } from "express";
import http from "http";
import { APP_ENV } from "../config/config";
import logger from "../config/logger";
import { buildSocketServer } from "./socket.io";

const app = express();
const server: http.Server = http.createServer(app);

app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
	res.sendFile(__dirname + "/index.html");
});

// Handle general server errors
server.on("error", (error) => {
	console.error(`Server error: ${error.message}`);
});

// Start the server
server.listen(APP_ENV.PORT, () => {
	logger.info(`Server is listening on port ${APP_ENV.PORT}`);
	buildSocketServer(server);
});
