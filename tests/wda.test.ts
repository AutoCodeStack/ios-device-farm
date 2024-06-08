import "jest";
import WDA from "../src/modules/wda/wda";
import { Device } from "../src/schema/device";

const wda = new WDA({ udid: "0", name: "a", version: "" } as Device);

describe("WDA Tests", () => {
	it("should initilize", () => {
		expect(wda.getDevice().udid).toEqual("0");
	});
});
