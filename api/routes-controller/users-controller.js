import User from '../models/User.js';
import Post from '../models/Post.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {createNotification} from './notification-controller.js';
import dotenv from 'dotenv';
const secretKey = 'securedauthentication';
const clientUrl = process.env.CLIENT_URL;
dotenv.config();

const UpdateUser = async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		if (req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (err) {
				return res.status(500).json(err);
			}
		}
		try {
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			});
			res.status(200).json('Account has been updated');
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json('You can update only your account!');
	}
};

const DeleteUser = async (req, res) => {
	const userId = req.params.id;
	try {
		// delete user
		await User.findByIdAndDelete(userId);
		// remove user from other users followers and followings
		await User.updateMany(
			{
				$or: [{followers: userId}, {followings: userId}],
			},
			{$pull: {followers: userId, followings: userId}}
		);
		// delete user posts
		await Post.deleteMany({
			user: userId,
		});
		// unlike posts / liked by deleted user
		await Post.updateMany(
			{$or: [{likes: userId}, {'comments.user': userId}]},
			{$pull: {likes: userId, comments: {user: userId}}}
		);
		res.status(200).send('Account Deleted Succesfully');
	} catch (err) {
		return res.status(500).json(err);
	}
};

const GetCurrentUser = async (req, res) => {
	const token = req.headers['authorization'];
	try {
		const data = jwt.verify(token, secretKey);
		const user = await User.findById(data.id);
		if (!user) {
			return res.status(404).json({error: 'User not found'});
		}
		const updatedUser = await User.findByIdAndUpdate(
			user._id,
			{isOnline: true},
			{new: true}
		).select('-password -email');
		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(500).send('Internel server error');
	}
};

const GetUser = async (req, res) => {
	const userId = req.params.userId;
	try {
		const user = await User.findOne({_id: userId}).select('-email -password');
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
};

const GetUserFriends = async (req, res) => {
	const userId = req.params.userId;
	try {
		const friends = await User.find({followers: userId}).select(
			'-email -password'
		);
		res.status(200).json(friends);
	} catch (error) {
		res.status(400).json({error: error.message});
	}
};

const UpdateUserProfilePicture = async (req, res) => {
	try {
		const newPicture = req.body.file;
		await User.findByIdAndUpdate(req.body.id, {profilePicture: newPicture});
		res.status(200).json({message: 'Profile updated successfully'});
	} catch (error) {
		res.status(500).json({message: 'Internal Server Error'});
	}
};

const RegisterUserSocket = (io, socket, users, user) => {
	users[user._id] = socket.id;
	const friends = Array.from(new Set([...user.followers, ...user.followings]));
	try {
		for (let id of friends) {
			const friendSocketId = users[id];
			if (friendSocketId) {
				io.to(friendSocketId).emit('userOnline', user);
			}
		}
	} catch (error) {
		socket.emit('error', error);
	}
};

const LogoutUser = async (io, socket, socketUsers, userId) => {
	try {
		const user = await User.findById(userId);
		await user.updateOne({isOnline: false, lastActive: Date.now()});
		const userFriends = Array.from(
			new Set([...user.followers, user.followings])
		);
		userFriends.map((friendId) => {
			const friendSocketId = socketUsers[friendId];
			io.to(friendSocketId).emit('userLogout', user._id);
		});
	} catch (error) {
		console.log(error);
	}
};

const FollowUser = async (io, socket, users, userId, friendId) => {
	try {
		const user = await User.findById(userId);
		const userSocketId = users[userId];
		const friend = await User.findById(friendId);
		const friendSocketId = users[friendId];

		if (!friend) {
			io.to(userSocketId).emit(
				'error',
				error.message || 'The user you are trying to follow may not exist'
			);
		}

		await Promise.all([
			friend.updateOne({$push: {followers: userId}}),
			user.updateOne({$push: {followings: friendId}}),
		]);
		const notification = {
			userId: friend._id,
			message: `followed you`,
			source: user._id,
			action_url: `${clientUrl}profile/${user._id}/${user.username}`,
		};
		createNotification(io, users, notification);
	} catch (error) {
		if (userSocketId) {
			io.to(userSocketId).emit('error', error.message || 'An error occurred');
		}
	}
};

const UnfollowUser = async (io, socket, users, userId, friendId) => {
	try {
		const user = await User.findById(userId);
		const userSocketId = users[userId];
		const friend = await User.findById(friendId);
		const friendSocketId = users[friendId];

		if (!friend) {
			io.to(userSocketId).emit(
				'error',
				error.message || 'The user you are trying to unfollow may not exist'
			);
		}

		await Promise.all([
			friend.updateOne({$pull: {followers: userId}}),
			user.updateOne({$pull: {followings: friendId}}),
		]);
		const notification = {
			userId: friend._id,
			message: `unfollowed you`,
			source: user._id,
			action_url: `${clientUrl}profile/${user._id}/${user.username}`,
		};
		createNotification(io, users, notification);
	} catch (error) {
		if (userSocketId) {
			io.to(userSocketId).emit('error', error.message || 'An error occurred');
		}
	}
};
export {
	UpdateUser,
	DeleteUser,
	GetCurrentUser,
	GetUser,
	GetUserFriends,
	FollowUser,
	UnfollowUser,
	UpdateUserProfilePicture,
	RegisterUserSocket,
	LogoutUser,
};
