import "jest";
import WDA from "../src/app/wda/wda";
import { Device } from "../src/model/device";

const wda = new WDA({ udid: "0", name: "a", version: "" } as Device);

describe("WDA Tests", () => {
	it("should initilize", () => {
		expect(wda.getDevice().udid).toEqual("0");
	});
});
