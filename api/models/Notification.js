import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const notificationSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ['alert', 'info', 'warning', 'message'],
			default: 'info',
		},
		status: {
			type: String,
			enum: ['unread', 'read'],
			default: 'unread',
		},
		action_url: {
			type: String,
			required: false,
		},
		source: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{timestamps: true}
);

notificationSchema.index({createdAt: 1}, {expireAfterSeconds: 864000});
const Notification = model('Notification', notificationSchema);
export default Notification;
