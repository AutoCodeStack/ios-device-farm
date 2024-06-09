import { exec } from "teen_process";
import { DeviceInfo } from "../schema/device";
import { APP_ENV } from "../config/config";

export const getDeviceInfo = async (udid: string): Promise<DeviceInfo | undefined> => {
	try {
		const { stdout, stderr, code } = await exec(APP_ENV.GO_IOS, ["info", "--udid", udid]);
		const ti = JSON.parse(stdout);
		return new Promise((res) =>
			res({
				ActivationState: ti.ActivationState,
				ActivationStateAcknowledged: ti.ActivationStateAcknowledged,
				DeviceClass: ti.DeviceClass,
				DeviceColor: ti.DeviceColor,
				ProductName: ti.ProductName,
				ProductType: ti.ProductType,
				ProductVersion: ti.ProductVersion,
			} as DeviceInfo)
		);
	} catch (e: any) {
		console.log(e);
	}
	return new Promise((res) => res(undefined));
};
