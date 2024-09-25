import mongoose from 'mongoose';
import User from './User.js';
const {Schema, model} = mongoose;

const CommentSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	body: {
		message: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: false,
		},
	},
	likes: {
		type: [Schema.Types.ObjectId],
		ref: 'User',
		default: [],
	},
});
const PostSchema = new Schema(
	{
		userId: {
			type: String,
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
