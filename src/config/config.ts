import "dotenv/config";

export const APP_ENV = {
	NAME: process.env.APP_NAME ?? "ios-device-farm",
	PORT: process.env.PORT ?? 8000,
	WEBDRIVERAGENT_PROJECT: process.env.WEBDRIVERAGENT_PROJECT ?? process.cwd + "/ext/WebDriverAgent",
	GO_IOS: process.cwd() + "/node_modules/go-ios/dist/go-ios-darwin-amd64_darwin_amd64/ios",
};
