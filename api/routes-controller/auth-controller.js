import {validationResult} from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = 'securedauthentication';



const registerController = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res
			.status(400)
			.json({success: false, message: errors.array()[0].msg});
	}

	try {
		let user = await User.findOne({email: req.body.email});
		if (user) {
			return res.status(400).json({
				success: false,
				message: 'Sorry, a user with this email already exists',
			});
		}

		const salt = await bcrypt.genSalt(10);
		const securedPassword = await bcrypt.hash(req.body.password, salt);
		user = await User.create({...req.body, password: securedPassword});
		const authToken = jwt.sign(
			{
				id: user._id,
			},
			secretKey
		);
		res.status(200).json({
			success: true,
			message: 'Account created successfully',
			token: authToken,
		});
	} catch (error) {
		res.status(500).send({message: error.message});
	}
};

const loginController = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res
			.status(400)
			.json({success: false, message: errors.array()[0].msg});
	}

	try {
		const user = await User.findOne({email: req.body.email});
		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'try to login with correct credentials',
			});
		}

		const comparePassword = await bcrypt.compare(
			req.body.password,
			user.password
		);

		if (!comparePassword) {
			return res.status(400).json({
				success: false,
				message: 'try to login with correct credentials',
			});
		}

		await User.findByIdAndUpdate(user._id, {isOnline: true});

		const data = {
			id: user._id,
		};
		const authToken = jwt.sign(data, secretKey);
		res.send({success: true, token: authToken});
	} catch (error) {
		res.status(500).send({message: 'Internal Server Error'});
	}
};



export {registerController, loginController};
