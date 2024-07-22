import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();
const secretKey = 'securedauthentication';

// Update user
router.put('/:id', async (req, res) => {
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
});

// Delete user
router.delete('/:id', async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			await User.findByIdAndDelete(req.params.id);
			res.status(200).json('Account has been deleted');
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json('You can delete only your account!');
	}
});

// Get Current User Detail

router.post('/getuser', async (req, res) => {
	const token = req.headers['authorization'];
	try {
		const data = jwt.verify(token, secretKey);
		const user = await User.findById(data.id).select("-password");
		if(!user){
			return res.status(404).json({error: 'User not found'});
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).send('Internel server error');
	}
});

// Get a user
router.get('/:userId', async (req, res) => {
	const userId = req.params.userId;
	try {
		const user = await User.findById(userId);
		const {email, password, updatedAt, ...other} = user._doc;
		res.status(200).json(other);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Get friends
router.get('/friends/:userId', async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		if (user) {
			const friends = await Promise.all(
				user.followings.map((friendId) => {
					return User.findById(friendId);
				})
			);
			let friendList = [];
			friends.map((friend) => {
				const {_id, username, profilePicture, isOnline} = friend;
				friendList.push({_id, username, profilePicture, isOnline});
			});
			res.status(200).json(friendList);
		}
	} catch (error) {
		res.status(400).json({error: error.message});
	}
});

// Follow a user
router.put('/:id/follow', async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({$push: {followers: req.body.userId}});
				await currentUser.updateOne({$push: {followings: req.params.id}});
				res.status(200).json('User has been followed');
			} else {
				res.status(403).json('You already follow this user');
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("You can't follow yourself");
	}
});

// Unfollow a user
router.put('/:id/unfollow', async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (user.followers.includes(req.body.userId)) {
				await user.updateOne({$pull: {followers: req.body.userId}});
				await currentUser.updateOne({$pull: {followings: req.params.id}});
				res.status(200).json('User has been unfollowed');
			} else {
				res.status(403).json("You don't follow this user");
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("You can't unfollow yourself");
	}
});

// Update user profile picture
router.post('/update/profile', async (req, res) => {
	try {
		const newPicture = req.body.file;
		const user = await User.findById(req.body.id);
		const updateProfile = await user.updateOne({profilePicture: newPicture});
		res.status(200).json({message: 'Profile updated successfully'});
	} catch (error) {
		res.status(500).json({message: 'Internal Server Error'});
	}
});

export default router;
