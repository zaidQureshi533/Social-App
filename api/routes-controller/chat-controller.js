import Chat from '../models/Chat.js';

const GetChats = async (req, res) => {
	const userId = req.params.userId;
	const userPopulatedFields = '_id username profilePicture isOnline';
	try {
		const chats = await Chat.find({
			$or: [{user: userId}, {friend: userId}],
		})
			.populate('user', userPopulatedFields)
			.populate('friend', userPopulatedFields);
		res.status(200).json(chats);
	} catch (error) {
		res.status(500).json(error);
	}
};

const GetMessages = async (req, res) => {
	const userId = req.params.userId;
	const friendId = req.params.friendId;

	try {
		const messages = await Chat.findOne({
			$and: [{user: [userId, friendId]}, {friend: [userId, friendId]}],
		})
			.select('messages')
			.populate('messages.sender', '_id profilePicture');
		res.status(200).json(messages);
	} catch (error) {
		res.status(500).json(error);
	}
};

const handleNewMessage = async (io, socket, users, newMessage) => {
	const {userId, friendId, msg} = newMessage;
	const senderSocketId = users[userId];
	const receiverSocketId = users[friendId];
	// handle new message
	try {
		const chat = await Chat.findOne({
			$and: [{user: [userId, friendId]}, {friend: [userId, friendId]}],
		});
		if (chat) {
			await chat.updateOne({$push: {messages: msg}});
		} else {
			const newChat = new Chat({
				user: userId,
				friend: friendId,
				messages: [msg],
			});
			await newChat.save();
		}
		const payload = await Chat.findOne({
			$and: [{user: [userId, friendId]}, {friend: [userId, friendId]}],
		})
			.select('messages')
			.populate('messages.sender', '_id profilePicture');

		const message = payload.messages.pop();
		if (senderSocketId) {
			io.to(senderSocketId).emit('emitNewMessage', message);
		}
		if (receiverSocketId) {
			io.to(receiverSocketId).emit('emitNewMessage', message);
		}
	} catch (error) {
		socket.emit('chat_error', {
			error: 'An error occurred while processing your message.',
		});
	}
};
export {GetChats, GetMessages, handleNewMessage};
