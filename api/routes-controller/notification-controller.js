import Notification from '../models/Notification.js';

const createNotification = async (io, users, notification) => {
	const {userId, source} = notification;
	const userSocketId = users[userId];
	const sourceSocketId = users[source];
	try {
		const newNotification = await Notification.create(notification);
		const payload = await Notification.findById(newNotification._id).populate(
			'source',
			'_id username profilePicture'
		);
		if (userSocketId) {
			io.to(userSocketId).emit('newNotification', payload);
		}
	} catch (error) {
		console.log(error);
	}
};
const getNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find({
			userId: req.params.userId,
		}).populate('source', '_id username profilePicture');
		res.status(200).json(notifications);
	} catch (error) {
		res.status(500).json(error);
	}
};
const updateNotification = async (req, res) => {
	try {
		const notificationId = req.params.id;
		const update = await Notification.findByIdAndUpdate(notificationId, {
			status: 'read',
		});
		res.status(200).send('notification has been read');
	} catch (error) {
		res.status(500).json(error);
	}
};

const deleteNotification = async (req, res) => {
	try {
		const deleteNotification = await Notification.findByIdAndDelete(
			req.params.id
		);
		res.status(200).send('Deleted');
	} catch (error) {
		res.status(500).json(error);
	}
};

export {
	createNotification,
	getNotifications,
	updateNotification,
	deleteNotification,
};
