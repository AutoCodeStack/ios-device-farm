enum WdaCommands {
	OPEN_URL = "open_url",
	TAP = "tap",
	TEXT_INPUT = "text_input",
	HOMESCREEN = "homescreen",
	SWIPE = "swipe",
}

export const buildCommand = (data: any): Command => {
	return { udid: data.udid, cmd: data.cmd as WdaCommands, values: data.data };
};

type Session = {
	sessionId: string;
	value: {
		sessionId: string;
		capabilities: {
			sdkVersion: string;
			device: string;
		};
	};
};

type Command = {
	udid: string;
	cmd: WdaCommands;
	values: any;
};

export { Session, WdaCommands, Command };

//udid
// cmd
