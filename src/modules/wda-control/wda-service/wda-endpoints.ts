export enum HttpMethod {
	GET = "GET",
	POST = "POST",
	DELETE = "DELETE",
}

export enum WdaEndpoints {
	CREATE_SESSION = "/session",
	DELETE_SESSION = "/session/:sessionId",
	OPEN_URL = "/session/:sessionId/url",
	ENTER_TEXT = "/session/:sessionId/wda/keys",
	CUSTOM_TAP = "/session/:sessionId/wda/custom/tap",
	WDA_HOMESCREEN = "/wda/homescreen",
}

export const getEndpoint = (endpoint: WdaEndpoints, params?: Record<string, string>): string => {
	let endpointStr = endpoint as string;
	if (params) {
		Object.keys(params).forEach((key) => {
			endpointStr = endpointStr.replace(`:${key}`, params[key]);
		});
	}
	return endpointStr;
};
