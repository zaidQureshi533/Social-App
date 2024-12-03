import mongoose from 'mongoose';

const {Schema, model} = mongoose;

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			max: 50,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			min: 6,
		},
		profilePicture: {
			type: String,
			default: 'noAvatar.jpg',
		},
		coverPicture: {
			type: String,
			default: 'noCover.jpg',
		},
		DOB: {
			type: String,
			default: '',
		},
		gender: {
			type: String,
			default: '',
		},
		followers: {
			type: Array,
			default: [],
		},
		followings: {
			type: Array,
			default: [],
		},
		city: {
			type: String,
			default: '',
			max: 50,
		},
		from: {
			type: String,
			default: '',
			max: 50,
		},
		relationship: {
			type: String,
			default: '',
			max: 50,
		},
		isOnline: {
			type: Boolean,
			default: false,
		},
		lastActive: Date,
	},
	{timestamps: true}
);

const User = model('User', UserSchema);

export default User;
