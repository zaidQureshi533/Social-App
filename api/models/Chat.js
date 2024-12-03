import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const MessageSchema = new Schema(
	{
		sender: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		content: {type: String, default: ''},
		img: {type: String, default: ''},
	},
	{timestamps: true}
);

const ChatSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		friend: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		messages: [MessageSchema],
	},
	{timestamps: true}
);

const Chat = model('Chat', ChatSchema);
export default Chat;
