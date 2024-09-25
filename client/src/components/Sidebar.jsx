import React, {useState, useEffect} from 'react';
import CloseFriend from './CloseFriend';
import {useSelector} from 'react-redux';
import { SlFeed } from "react-icons/sl";
import { RiGroupLine } from "react-icons/ri";
import {
	MdChatBubbleOutline,
	MdOutlinePersonalVideo,
	MdOutlineInfo,
	MdOutlineEvent,
	MdOutlineBookmarkBorder,
} from 'react-icons/md';
import axios from 'axios';
const Sidebar = () => {
	const navItem = [
		{
			icon: <MdChatBubbleOutline size={22} color='#4b4848' />,
			label: 'Chat',
		},
		{
			icon: <RiGroupLine size={22} color='#4b4848' />,
			label: 'Groups',
		},
		{
			icon: <SlFeed size={20} color='#4b4848' />,
			label: 'Feed',
		},
		{
			icon: <MdOutlineBookmarkBorder size={22} color='#4b4848' />,
			label: 'BookMarks',
		},
		{
			icon: <MdOutlinePersonalVideo size={22} color='#4b4848' />,
			label: 'Videos',
		},
		{
			icon: <MdOutlineInfo size={22} color='#4b4848' />,
			label: 'Questions',
		},
		{
			icon: <MdOutlineEvent size={22} color='#4b4848' />,
			label: 'Events',
		},
	];

	const CurrentUser = useSelector((state) => state.user.value);
	const API = process.env.SERVER_API;

	const [friends, setFriends] = useState([]);

	useEffect(() => {
		if (CurrentUser._id) {
			axios
				.get(`${API}/users/friends/${CurrentUser._id}`)
				.then((res) => {
					setFriends(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [CurrentUser._id]);

	return (
		<>
			<div className='sticky top-14 overflow-y-auto h-screen scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-400 shadow-md'>
				<ul className='font-medium mt-2'>
					{navItem.map((item) => {
						const {icon, label} = item;
						return (
							<li
								className='px-4 py-1 hover:bg-gray-100 transition-all duration-150 border-b'
								key={crypto.randomUUID()}
							>
								<a href='#' className='flex items-center p-2'>
									{icon}
									<span className='ms-5 text-gray-700'>{label}</span>
								</a>
							</li>
						);
					})}
				</ul>
				<button
					type='button'
					className='text-white bg-[#263241] hover:bg-[#24292F]/90 focus:ring-2 focus:outline-none focus:ring-[#24292F]/50 rounded-lg text-sm px-5 py-2.5 m-2'
				>
					Show more
				</button>

				<hr />
				<ul className='font-medium'>
					{friends.map((friend) => {
						return <CloseFriend user={friend} key={friend._id} />;
					})}
				</ul>
			</div>
		</>
	);
};

export default Sidebar;
