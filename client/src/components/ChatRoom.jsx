import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from './Avatar';
import {FiSend, LuImagePlus, MdClose, MdOutlineDelete} from './icons';
import {publicRequest} from '../configuration/requestMethod';
import {socket} from '../configuration/socket';
import Message from './Message';
import {format} from 'timeago.js';
import {closeChat} from '../store/states/chatSlice';
import {UploadImage} from '../configuration/apiCalls';
const ChatRoom = () => {
	const CurrentUser = useSelector((state) => state.user.value);
	const {showChat, chatUser} = useSelector((state) => state.chat);
	const user = chatUser;
	const dispatch = useDispatch();
	const [messages, setMessages] = useState([]);
	const fileInputRef = useRef();
	const [file, setFile] = useState(null);
	const [message, setMessage] = useState('');
	const messagesRef = useRef();
	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages, file]);

	const handleCloseChat = () => {
		dispatch(closeChat());
	};

	// get messages
	useEffect(() => {
		showChat &&
			publicRequest
				.get(`/chats/${CurrentUser._id}/${user?._id}`)
				.then((res) => {
					setMessages(res.data?.messages ?? []);
				})
				.catch((error) => {
					console.error(error);
				});
	}, [user]);

	const handleSendMessage = () => {
		const userId = CurrentUser._id;
		const friendId = user._id;
		const msg = {
			sender: userId,
			content: message,
		};
		if (file) {
			const fileName = file.name + Date.now();
			const data = new FormData();
			data.append('name', fileName);
			data.append('file', file);
			UploadImage('/message', data);
			msg.img = fileName;
		}
		socket.emit('sendMessage', userId, friendId, msg);
		setMessage('');
		setFile(null);
		fileInputRef.current.value = '';
	};
	const clearFile = () => {
		setFile(null);
		fileInputRef.current.value = '';
	};

	useEffect(() => {
		socket.on('emitNewMessage', (newMessage) => {
			if (newMessage) {
				setMessages((prev) => [...prev, newMessage]);
			}
		});
	}, []);

	return (
		<>
			{showChat && (
				<div className='chatroom-container rounded-t-md fixed bottom-0 right-10 border w-72 bg-white z-10'>
					<div className='top px-2 py-1 flex justify-between shadow-md'>
						<div className='top-left flex gap-2 hover:bg-gray-100 p-2 rounded-md '>
							<Avatar img={user.profilePicture} />
							<div>
								<h6 className='font-bold'>{user.username}</h6>
								{user.isOnline ? (
									<span className='inline-flex gap-1 items-center text-xs'>
										{' '}
										<div className='h-1.5 w-1.5 rounded-full bg-green-500'></div>{' '}
										Active now
									</span>
								) : (
									<span className='text-wrap'>{`Active ${format(
										user.lastActive
									)}`}</span>
								)}
							</div>
						</div>
						<div className='top-right'>
							<button
								className='cursor-pointer hover:bg-gray-100 h-6 w-6 flex justify-center items-center rounded-full'
								onClick={handleCloseChat}
							>
								<MdClose />
							</button>
						</div>
					</div>
					<div
						className='messages-container h-80 p-2 overflow-y-auto'
						ref={messagesRef}
					>
						<ul className='messages'>
							{messages.map((msg) => {
								return <Message msg={msg} key={msg._id} />;
							})}
						</ul>
						{file && (
							<div className='rounded-md relative p-2 bg-gray-100'>
								<img
									className='aspect-5/4 w-4/5 object-cover rounded-md'
									src={URL.createObjectURL(file)}
								/>
								<button className='absolute right-1 top-1' onClick={clearFile}>
									<MdClose size={22} />
								</button>
							</div>
						)}
					</div>
					<div className='chat-bottom p-1'>
						<div className='bg-gray-200 rounded-lg'>
							<form className='flex justify-around items-center '>
								<textarea
									type='text'
									className='message-input resize-none test-sm md:text-base w-4/5 px-3 py-2 bg-transparent focus:outline-none'
									autoFocus
									rows={1}
									value={message}
									onChange={(e) => setMessage(e.target.value)}
								/>
								<div className='controls flex gap-4 mr-2 items-center'>
									<input
										ref={fileInputRef}
										id='commentFile'
										type='file'
										name='file'
										className='hidden'
										accept='.png,.jpg,.jpeg,.webp,.jfif'
										onChange={(e) => {
											setFile(e.target.files[0]);
										}}
									/>
									<label htmlFor='commentFile' className='cursor-pointer'>
										<LuImagePlus size={22} />
									</label>
									<button
										className=' p-1 focus:outline-2 outline-blue-700'
										onClick={handleSendMessage}
										type='button'
										disabled={!message && !file}
									>
										<FiSend
											size={20}
											color={!message && !file ? '' : '#3f64df'}
										/>
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ChatRoom;
