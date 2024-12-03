import {
	RegisterUserSocket,
	LogoutUser,
	FollowUser,
	UnfollowUser,
} from './routes-controller/users-controller.js';
import {handleNewMessage} from './routes-controller/chat-controller.js';
import {
	CreateComment,
	LikeDislikePost,
} from './routes-controller/posts-controller.js';

let users = {};
const socketHandler = (io) => {
	io.on('connection', (socket) => {
		console.log('user connected');
		// register user
		socket.on('register', async (user) => {
			RegisterUserSocket(io, socket, users, user);
		});
		// emit message
		socket.on('sendMessage', async (userId, friendId, msg) => {
			const message = {userId, friendId, msg};
			handleNewMessage(io, socket, users, message);
		});
		// offline user when user close the window or browser
		socket.on('userLogout', async (userId) => {
			LogoutUser(io, socket, users, userId);
		});

		// follow | unfollow user
		socket.on('follow', (userId, friendId) => {
			FollowUser(io, socket, users, userId, friendId);
		});
		socket.on('unfollow', (userId, friendId) => {
			UnfollowUser(io, socket, users, userId, friendId);
		});

		// Like|Dislike Post
		socket.on('likePost', (postId, userId) => {
			LikeDislikePost(io, socket, users, postId, userId);
		});

		// post comment
		socket.on('newComment', (postId, comment) => {
			CreateComment(io, socket, users, postId, comment);
		});
		// remove user socketId on disconnect
		socket.on('disconnect', async () => {
			for (let userId in users) {
				if (users[userId] === socket.id) {
					delete users[userId];
					break;
				}
			}
			console.log('user disconnected');
		});
	});
};
export default socketHandler;
