import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

// Create a post
router.post('/', async (req, res) => {
	const post = new Post(req.body);
	try {
		const createdPost = await post.save();
		res.status(200).json(createdPost);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Update a post
router.put('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.user === req.body.userId) {
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
	const postId = req.params.id;
	try {
		await Post.findByIdAndDelete(postId);
		res.status(200).json('The post has been deleted');
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
	const userPopuplatedFields = '-password -email -followers -followings';
	try {
		let posts;
		if (!id) {
			posts = await Post.find()
				.populate('user', userPopuplatedFields)
				.populate('comments.user', userPopuplatedFields)
				.sort({createdAt: -1});
		} else {
			posts = await Post.find({
				$or: [{user: id}, {user: {$in: user.followings}}],
			})
				.populate('user', userPopuplatedFields)
				.populate('comments.user', userPopuplatedFields)
				.sort({createdAt: -1});
		}
		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get Post

router.get('/:id', async (req, res) => {
	const postId = req.params.id;
	const userPopuplatedFields = '-password -email -followers -followings';
	try {
		const post = await Post.findById(postId)
			.populate('user', userPopuplatedFields)
			.populate('comments.user', userPopuplatedFields);
		res.status(200).json(post);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Post Comment
router.post('/:id/comments', async (req, res) => {
	const postId = req.params.id;
	const userPopuplatedFields = '-password -email -followers -followings';
	try {
		const post = await Post.findOne({_id: postId});
		if (!post) {
			return res.status(404).json({
				message: 'The post you are trying to comment may have been deleted',
			});
		}
		post.comments.push(req.body);
		const updatedPost = await post.save();
		const populatedPost = await Post.findById(updatedPost._id).populate(
			'comments.user',
			userPopuplatedFields
		);
		res.status(200).json(populatedPost.comments);
	} catch (error) {
		res.status(500).json(error);
	}
});
// Delete Comment
router.delete('/comment/:commentId', async (req, res) => {
	const commentId = req.params.commentId;
	try {
		await Post.findOneAndUpdate(
			{'comments._id': commentId},
			{$pull: {comments: {_id: commentId}}}
		);
		res.status(200).send('Comment Deleted');
	} catch (error) {
		res.status(500).json(error);
	}
});

export default router;
