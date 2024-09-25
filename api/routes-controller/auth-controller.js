import {validationResult} from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {response} from 'express';

dotenv.config();
const secretKey = 'securedauthentication';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.AUTH_USER,
		pass: process.env.AUTH_PASS,
	},
});

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

const resetPasswordLink = async (req, res) => {
	const {email} = req.body;
	const user = await User.findOne({email});
	if (!user) {
		return res.status(401).json({message: 'user not found'});
	}

	const token = jwt.sign({userId: user._id}, secretKey, {expiresIn: '1h'});

	const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
	const mailOptions = {
		from: process.env.AUTH_USER,
		to: user.email,
		subject: 'Password Reset',
		text: `Click the following Link to reset your password: ${resetLink}`,
	};
	User.findByIdAndUpdate(user._id, {resetToken: token}).then(() => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return res.status(500).json({error: error.response, message: "internel server error"});
			}
			res
				.status(200)
				.json({
					message:
						'email has been sent to you, please check and follow the instructions',
				});
		});
	});
};

export {registerController, loginController, resetPasswordLink};
