import {io} from 'socket.io-client';

let socket = io(process.env.SOCKET_SERVER, {
	withCredentials: true,
});

const registerUser = (user) => {
	socket.emit('register', user);
};

const emitLogoutUser = (userId) => {
	socket.emit('userLogout', userId);
	socket.disconnect();
};

export {socket, emitLogoutUser, registerUser};
