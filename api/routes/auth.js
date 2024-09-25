import express from 'express';
import {body} from 'express-validator';
import User from '../models/User.js';
import {
	registerController,
	loginController,
	resetPasswordLink,
} from '../routes-controller/auth-controller.js';

const router = express.Router();

// Create a User using: POST "/api/auth/register". No login required
router.post(
	'/register',
	[
		body('username').trim().notEmpty().withMessage('Username is Required'),
		body('email')
			.trim()
			.notEmpty()
			.withMessage('Email is required')
			.isEmail()
			.withMessage('Please enter a valid email'),
		body('password')
			.notEmpty()
			.withMessage('Please Enter Password')
			.isLength({min: 6})
			.withMessage('Password must be atleast 6 Characters')
			.isLength({max: 12})
			.withMessage("Password couldn't be more than 12 Characters"),
	],
	registerController
);

// Login a User using: POST "/api/auth/login". No login required
router.post(
	'/login',
	[
		body('email')
			.notEmpty()
			.withMessage('Email is required')
			.isEmail()
			.withMessage('Please Enter a valid email'),
		body('password').notEmpty().withMessage('Please enter password'),
	],
	loginController
);

// Logout User
router.post('/logout/:userId', async (req, res) => {
	const Id = req.params.userId;
	await User.findByIdAndUpdate(Id, {isOnline: false});
	const user = await User.findById(Id);
	res.status(200).send({isOnline: user.isOnline});
});

// Request For Password Reset Link

router.post('/reset-password', resetPasswordLink);
export default router;
