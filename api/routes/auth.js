import express from 'express';
import {body} from 'express-validator';

import {
	registerController,
	loginController,
} from '../routes-controller/auth-controller.js';

const router = express.Router();

// Create a User using: POST "/api/auth/register". No login required
router.post(
	'/register',
	[
		body('username').trim().notEmpty().withMessage('username is Required'),
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

export default router;
