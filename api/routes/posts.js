import express from 'express';

import {
	CreateComment,
	CreatePost,
	DeleteComment,
	DeletePost,
	GetPost,
	GetPosts,
	UpdatePost,
} from '../routes-controller/posts-controller.js';

const router = express.Router();

router.post('/', CreatePost);
router.put('/:id', UpdatePost);
router.delete('/:id', DeletePost);
router.get('/', GetPosts);
router.get('/:id', GetPost);
router.post('/:id/comments', CreateComment);
router.delete('/comment/:commentId', DeleteComment);

export default router;
