import logger from "../config/logger";
import { getDeviceName, getDeviceSize } from "../utils/device.utils";
import { Status } from "./status";

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

export type DeviceInfo = {
	ActivationState: string;
	ActivationStateAcknowledged: boolean;
	DeviceClass: string;
	DeviceColor: string;
	ProductName: string;
	ProductType: string;
	ProductVersion: string;
};

export type DeviceConnectEvent = {
	MessageType: string;
	DeviceID: number;
	Properties: Properties;
};

export type Properties = {
	ConnectionSpeed: number;
	ConnectionType: string;
	DeviceID: number;
	LocationID: number;
	ProductID: number;
	SerialNumber: string;
};

export class Convert {
	public static toDeviceConnectEvent(json: string): DeviceConnectEvent {
		return JSON.parse(json);
	}

	public static deviceConnectEventToJson(value: DeviceConnectEvent): string {
		return JSON.stringify(value);
	}

	public static toDevice(info: DeviceInfo, connectEvent: DeviceConnectEvent) {
		const deviceName = getDeviceName(info.ProductType);
		const deviceSize = getDeviceSize(info.ProductType);
		let device: Device = {
			id: connectEvent.DeviceID,
			name: deviceName ?? "iPhone unknown",
			udid: connectEvent.Properties.SerialNumber,
			version: info.ProductVersion,
			status: Status.AVAILABLE,
			dpr: deviceSize.dpr,
			height: deviceSize.viewportHeight,
			width: deviceSize.viewportWidth,
		};
		return device;
	}
}
