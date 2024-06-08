const SESSION_CREATE_URL = (port: number) => {
	return `http://localhost:${port}/session`;
};

const SESSION_DELETE_URL = (port: number, sessionId: string) => {
	return `http://localhost:${port}/session/${sessionId}`;
};

const SESSION_OPEN_URL = (port: number, sessionId: string) => {
	return `http://localhost:${port}/session/${sessionId}/url`;
};

const SESSION_TEXT_INPUT = (port: number, sessionId: string) => {
	return `http://localhost:${port}/session/${sessionId}/wda/keys`;
};

const SESSION_TAP_URL = (port: number, sessionId: string) => {
	return `http://localhost:${port}/session/${sessionId}/wda/custom/tap`;
};

export {
	SESSION_CREATE_URL,
	SESSION_DELETE_URL,
	SESSION_OPEN_URL,
	SESSION_TEXT_INPUT,
	SESSION_TAP_URL,
};
