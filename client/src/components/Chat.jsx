import React from 'react';
import {useDispatch} from 'react-redux';
import {openChat} from '../store/states/chatSlice';

const Chat = ({children, user}) => {
	const dispatch = useDispatch();
	const handleOpenChat = () => {
		dispatch(openChat(user));
	};

	return (
		<>
			<button
				className='w-full hover:bg-gray-100 transition-all duration-150 rounded-md'
				role='button'
				onClick={handleOpenChat}
			>
				{children}
			</button>
		</>
	);
};

export default Chat;
