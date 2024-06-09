type Capabilities = {
	sdkVersion: string;
	device: string;
};

type SessionValue = {
	sessionId: string;
	capabilities: Capabilities;
};

type Session = {
	sessionId: string;
	value: SessionValue;
};

export { Session };
