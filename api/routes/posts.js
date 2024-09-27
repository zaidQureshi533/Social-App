import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

// Create a post
router.post('/', async (req, res) => {
	const post = req.body;
	try {
		const createdPost = await Post.create(post);
		res.status(200).json(createdPost);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Update a post
router.put('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await Post.updateOne({_id: req.params.id}, {$set: req.body});
			res.status(200).json('The post has been updated');
		} else {
			res.status(403).json('You can update only your post');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// Delete a post
router.delete('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await Post.deleteOne({_id: req.params.id});
			res.status(200).json('The post has been deleted');
		} else {
			res.status(403).json('You can delete only your post');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// Like / Dislike a post
router.put('/:id/like', async (req, res) => {
	const postId = req.params.id;
	const userId = req.body.userId;
	try {
		const post = await Post.findById(postId);
		if (!post.likes.includes(userId)) {
			await Post.updateOne({_id: postId}, {$push: {likes: userId}});
			res.status(200).json('The post has been liked');
		} else {
			await Post.updateOne(
				{_id: req.params.id},
				{$pull: {likes: req.body.userId}}
			);
			res.status(200).json('The post has been disliked');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// Get posts

router.get('/', async (req, res) => {
	const id = req.query.userId;
	const user = await User.findById(id);
	try {
		let posts;
		if (!id) {
			posts = await Post.find().sort({createdAt: -1});
		} else {
			posts = await Post.find({
				$or: [{userId: id}, {userId: {$in: user.followings}}],
			}).sort({createdAt: -1});
		}
		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json(error);
	}
});

export default router;
