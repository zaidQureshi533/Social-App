import express from 'express';
import multer from 'multer';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Storage For Posts Images
const PostStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, join(__dirname, '/../../uploads/images/posts'));
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	},
});

const PostUpload = multer({storage: PostStorage});
router.post('/post', PostUpload.single('file'), (req, res) => {
	try {
		return res.status(200).json('File uploaded successfully');
	} catch (error) {
		console.error(error);
	}
});

//Storage For Profile Images
const ProfileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, join(__dirname, '/../../uploads/images/profile'));
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	},
});
const ProfileUpload = multer({storage: ProfileStorage});
router.post('/profile', ProfileUpload.single('file'), (req, res) => {
	try {
		return res.status(200).json('File uploaded successfully');
	} catch (error) {
		console.error(error);
	}
});

//Storage For messages Images
const MessageStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, join(__dirname, '/../../uploads/images/messages'));
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	},
});
const UploadMessageImage = multer({storage: MessageStorage});
router.post('/message', UploadMessageImage.single('file'), (req, res) => {
	try {
		return res.status(200).json('File uploaded successfully');
	} catch (error) {
		console.error(error);
	}
});

export default router;
