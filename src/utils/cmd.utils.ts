export const getTunnelCommandArgs = (udid: string, port: number) => {
	return ["forward", `--udid=${udid}`, `${port}`, `${port}`];
};

export const getXcodeBuildCommandArgs = (udid: string, controlPort: number, streamPort: number) => {
	return ["test", "-scheme", "WebDriverAgentRunner", "-destination", `id=${udid}`, `USE_PORT=${controlPort}`, `MJPEG_SERVER_PORT=${streamPort}`];
};
