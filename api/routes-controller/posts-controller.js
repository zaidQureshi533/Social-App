import Post from '../models/Post.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
import {createNotification} from './notification-controller.js';

const userPopuplatedFields = '-password -email -followers -followings';
const clientUrl = process.env.CLIENT_URL;
dotenv.config();

const CreatePost = async (req, res) => {
	const post = new Post(req.body);
	try {
		const createdPost = await post.save();
		res.status(200).json(createdPost);
	} catch (err) {
		res.status(500).json(err);
	}
};

const UpdatePost = async (req, res) => {
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
};

const DeletePost = async (req, res) => {
	const postId = req.params.id;
	try {
		await Post.findByIdAndDelete(postId);
		res.status(200).json('The post has been deleted');
	} catch (err) {
		res.status(500).json(err);
	}
};

const LikeDislikePost = async (io, socket, users, postId, userId) => {
	try {
		const post = await Post.findById(postId);
		if (!post.likes.includes(userId)) {
			await post.updateOne({$push: {likes: userId}});
			if (userId !== post.user) {
				const notification = {
					userId: post.user,
					message: `liked your post`,
					source: userId,
					action_url: `${clientUrl}posts/${postId}`,
				};
				createNotification(io, users, notification);
			}
		} else {
			await post.updateOne({$pull: {likes: userId}});
		}
	} catch (error) {
		console.log(error);
	}
};

const GetPosts = async (req, res) => {
	const id = req.query.userId;
	const user = await User.findById(id);

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
};

const GetPost = async (req, res) => {
	const postId = req.params.id;

	try {
		const post = await Post.findById(postId)
			.populate('user', userPopuplatedFields)
			.populate('comments.user', userPopuplatedFields);
		res.status(200).json(post);
	} catch (error) {
		res.status(500).json(error);
	}
};

const CreateComment = async (io, socket, users, postId, comment) => {
	const userSocketId = users[comment.user];
	try {
		const post = await Post.findById(postId);
		if (!post && userSocketId) {
			io.to(userSocketId).emit(
				'error',
				'The post you are trying to comment may not exist'
			);
		}
		const updatePost = await post.updateOne({$push: {comments: comment}});
		const notification = {
			userId: post.user,
			message: 'commented on your post',
			source: comment.user,
			action_url: `${clientUrl}posts/${postId}`,
		};
		createNotification(io, users, notification);
		if (userSocketId) {
			const populatedPost = await Post.findById(postId).populate(
				'comments.user',
				userPopuplatedFields
			);
			const payload = populatedPost.comments.pop();
			io.to(userSocketId).emit('newComment', payload);
		}
	} catch (error) {
		if (userSocketId) {
			io.to(userSocketId).emit(
				'error',
				'The post you are trying to comment may not exist'
			);
		}
	}
};

const DeleteComment = async (req, res) => {
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
};
export {
	CreatePost,
	UpdatePost,
	DeletePost,
	LikeDislikePost,
	GetPosts,
	GetPost,
	CreateComment,
	DeleteComment,
};
