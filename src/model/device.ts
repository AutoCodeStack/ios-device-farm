export type Device = {
	id: number;
	name: string;
	udid: string;
	version: string;
};

export interface DeviceInfo {
	ActivationState: string;
	ActivationStateAcknowledged: boolean;
	DeviceClass: string;
	DeviceColor: string;
	ProductName: string;
	ProductType: string;
	ProductVersion: string;
}

export interface DeviceConnectEvent {
	MessageType: string;
	DeviceID: number;
	Properties: Properties;
}

export interface Properties {
	ConnectionSpeed: number;
	ConnectionType: string;
	DeviceID: number;
	LocationID: number;
	ProductID: number;
	SerialNumber: string;
}

export class Convert {
	public static toDeviceConnectEvent(json: string): DeviceConnectEvent {
		return JSON.parse(json);
	}

	public static deviceConnectEventToJson(value: DeviceConnectEvent): string {
		return JSON.stringify(value);
	}
}
