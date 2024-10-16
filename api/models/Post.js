import mongoose from 'mongoose';
import User from './User.js';
const {Schema, model} = mongoose;

const CommentSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		body: {
			message: {
				type: String,
				required: false,
				default: '',
			},
			image: {
				type: String,
				required: false,
				default: '',
			},
		},
		likes: {
			type: [Schema.Types.ObjectId],
			ref: 'User',
			default: [],
		},
	},
	{timestamps: true}
);
const PostSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		desc: {
			type: String,
			maxlength: 500,
		},
		photo: {
			type: String,
		},
		date: {
			type: Date,
			default: Date.now,
		},
		likes: {
			type: Array,
			default: [],
		},
		comments: [CommentSchema],
	},
	{timestamps: true}
);

const Post = model('Post', PostSchema);

export default Post;
