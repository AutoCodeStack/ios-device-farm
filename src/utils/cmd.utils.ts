export const getTunnelCommandArgs = (udid: string, port: number) => {
	return ["forward", `--udid=${udid}`, `${port}`, `${port}`];
};

export const getXcodeBuildCommandArgs = (udid: string, controlPort: number, streamPort: number) => {
	return ["test", "-scheme", "WebDriverAgentRunner", "-destination", `id=${udid}`, `USE_PORT=${controlPort}`, `MJPEG_SERVER_PORT=${streamPort}`];
};

export const getRunTestCommandArgs = (udid: string, controlPort: number, streamPort: number) => {
	return [
		"runwda",
		"--bundleid=com.extrabits.WebDriverAgentRunner.xctrunner",
		"--testrunnerbundleid=com.extrabits.WebDriverAgentRunner.xctrunner",
		"--xctestconfig=WebDriverAgentRunner.xctest",
		"--udid",
		udid,
		"--env",
		`USE_PORT=${controlPort}`,
		"--env",
		`MJPEG_SERVER_PORT=${streamPort}`,
	];
};
