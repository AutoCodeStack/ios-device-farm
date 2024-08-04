export type Device = {
	id: number;
	name: string;
	udid: string;
	version: string;
	status: Status;
	dpr: number;
	height: number;
	width: number;
};

export enum Status {
	AVAILABLE,
	BUSY,
	OFFLINE,
}

export const getDeviceVersion = (version: string) => {
	try {
		const parts = version.split(".");
		const firstPart = parts[0];
		if (firstPart) {
			return parseInt(firstPart);
		}
	} catch (error) {}
	return 17;
};
