import React from 'react';
import Avatar from './Avatar';
export default function OnlineFriend({friend}) {
	const {username, profilePicture, isOnline} = friend;
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	return (
		<li className='rightbarFriend px-4 py-1 hover:bg-gray-100 transition-all duration-150 border-b'>
			<a href='#' className='flex items-center p-2'>
				<Avatar src={PF + 'profile/' + profilePicture} isOnline={isOnline} />
				<span className='ms-5'>{username}</span>
			</a>
		</li>
	);
}
