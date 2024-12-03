import React from 'react';
import Avatar from './Avatar';
import Chat from './Chat';
export default function OnlineFriend({friend}) {
	const {username, profilePicture, isOnline} = friend;
	return (
		<Chat user={friend}>
			<div className='rightbarFriend px-4 py-1 border-b'>
				<div className='flex items-center p-2'>
					<Avatar img={profilePicture} isOnline={isOnline} />
					<span className='ms-5'>{username}</span>
				</div>
			</div>
		</Chat>
	);
}
