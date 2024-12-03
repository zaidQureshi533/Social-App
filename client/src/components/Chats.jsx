import React, {useEffect, useRef, useState} from 'react';
import Tooltip from './Tooltip';
import {FaFacebookMessenger} from './icons';
import Chat from './Chat';
import {useSelector} from 'react-redux';
import {publicRequest} from '../configuration/requestMethod';
import Avatar from './Avatar';

const Chats = () => {
	const [show, setShow] = useState(false);
	const [chats, setChats] = useState([]);
	const dropdownRef = useRef(null);
	const CurrentUser = useSelector((state) => state.user.value);
	useEffect(() => {
		CurrentUser._id &&
			publicRequest
				.get(`/chats/${CurrentUser._id}`)
				.then((res) => {
					setChats(res.data);
				})
				.catch((error) => {
					console.log(error)
				});
	}, [show]);

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setShow(false);
		}
	};

	const closeDropdown = () => {
		setShow(false);
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className='relative text-left' ref={dropdownRef}>
			<div>
				<button
					onClick={() => setShow(!show)}
					type='button'
					className='hidden lg:block'
					id='menu-button'
					aria-expanded={show}
					aria-haspopup='true'
				>
					<Tooltip label={!show && 'Messages'}>
						<div className='topbarIconItem text-lg relative cursor-pointer w-10 h-10 bg-gray-200 hover:bg-gray-300 flex justify-center items-center rounded-full'>
							<FaFacebookMessenger />
						</div>
					</Tooltip>
				</button>
			</div>
			<div
				className={`absolute right-2 top-11 z-10 w-80 min-h-[70vh] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-[0_0_15px_0_rgba(0,0,0,0.2)] text-gray-700 transition-transform duration-200 ease-in-out ${
					show ? 'scale-1' : 'scale-0'
				} overflow-auto`}
				style={{bottom: '-106px'}}
				role='menu'
				aria-orientation='vertical'
				aria-labelledby='menu-button'
				tabIndex='-1'
			>
				<div className='p-3' role='none'>
					<div className='chats-header my-2'>
						<h4 className='font-bold'>Chats</h4>
					</div>
					<hr />
					<div className='chats mt-1'>
						{chats.map((chat) => {
							const user =
								chat.user._id === CurrentUser._id ? chat.friend : chat.user;
							const lastMsg = chat.messages.slice(-1)[0];
							return (
								<Chat key={chat._id} user={user}>
									<div
										className='flex cursor-pointer items-center hover:bg-gray-100 rounded-md p-2 gap-3'
										onClick={closeDropdown}
									>
										<Avatar
											img={user.profilePicture}
											isOnline={user.isOnline}
										/>
										<div className='text-left'>
											<h5 className='font-bold'>{user.username}</h5>
											<span>{`${
												lastMsg?.sender === CurrentUser._id ? 'You: ' : ''
											}${
												lastMsg?.content ? lastMsg.content : 'sent an image'
											}`}</span>
										</div>
									</div>
								</Chat>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Chats;
