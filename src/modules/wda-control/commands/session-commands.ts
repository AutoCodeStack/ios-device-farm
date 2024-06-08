import {
	SESSION_CREATE_URL,
	SESSION_DELETE_URL,
	SESSION_OPEN_URL,
	SESSION_TAP_URL,
	SESSION_TEXT_INPUT,
} from "../endpoints/session.endpoint";
import { deleteCall, postCall } from "../utils/service";

const createSession = async (port: number) => {
	return await postCall(SESSION_CREATE_URL(port), {
		capabilities: {},
	});
};

const deleteSession = async (port: number, sessionId: string) => {
	return await deleteCall(SESSION_DELETE_URL(port, sessionId));
};

const textCommand = async (port: number, sessionId: string, text: string) => {
	return await postCall(SESSION_TEXT_INPUT(port, sessionId), {
		value: [text],
		frequency: 100,
	});
};

const tapCommand = async (port: number, sessionId: string, x: number, y: number) => {
	return await postCall(SESSION_TAP_URL(port, sessionId), {
		x: x,
		y: y,
	});
};

const openUrlCommand = async (port: number, sessionId: string, urlToOpen: string) => {
	return await postCall(SESSION_OPEN_URL(port, sessionId), {
		url: urlToOpen,
	});
};

export { createSession, deleteSession, textCommand, tapCommand, openUrlCommand };
