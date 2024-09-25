import {publicRequest} from './requestMethod';

export const UploadImage = async (url,file) => {
	publicRequest.post(`/upload/${url}`, file).catch((error) => console.log(error));
};

