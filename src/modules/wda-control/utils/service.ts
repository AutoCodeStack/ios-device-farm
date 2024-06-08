import axios from "axios";

const getCall = async (url: string) => {
	try {
		return await axios.get(url, { timeout: 10000 });
	} catch (error: Error | any) {
		return Promise.resolve(error.response);
	}
};

const postCall = async (url: string, postData?: any) => {
	try {
		return await axios.post(url, postData, { timeout: 10000 });
	} catch (error: Error | any) {
		return Promise.resolve(error.response);
	}
};

const deleteCall = async (url: string) => {
	try {
		return await axios.delete(url, { timeout: 10000 });
	} catch (error: Error | any) {
		return Promise.resolve(error.response);
	}
};

export { getCall, postCall, deleteCall };
