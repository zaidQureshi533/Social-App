import axios from 'axios';

const SERVER_URL = process.env.SERVER_API;
export const publicRequest = axios.create({
	baseURL: SERVER_URL,
});
