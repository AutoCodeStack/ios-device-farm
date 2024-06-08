import { WDA_HOME_URL } from "../endpoints/custom.endpoints";
import { postCall } from "../utils/service";

const homeScreenCommand = async (port: number) => {
	return await postCall(WDA_HOME_URL(port));
};

export { homeScreenCommand };
