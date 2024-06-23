import axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios";
import { HttpMethod, WdaEndpoints, getEndpoint } from "./wda-endpoints";

class WdaService {
	axiosInstance: AxiosInstance;

	constructor(port: number) {
		const baseUrl = `http://localhost:${port}`;
		this.axiosInstance = axios.create({ baseURL: baseUrl, timeout: 10000 });
	}

	apiCall = async (endpoint: WdaEndpoints, method: HttpMethod, data?: any, params?: any) => {
		try {
			const requestConfig: AxiosRequestConfig = {
				url: getEndpoint(endpoint, params),
				method: method,
				data: data,
			};
			return await this.axiosInstance.request(requestConfig);
		} catch (error: Error | any) {
			return Promise.resolve(error.response);
		}
	};
}

export { WdaService };
