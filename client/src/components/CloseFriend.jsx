import React from 'react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';
export default function CloseFriend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  return (
    <li className='rightbarFriend px-4 py-1 hover:bg-gray-100 transition-all duration-150 border-b'>
      <Link to={`/profile/${user._id}/${user.username}`} className='flex items-center p-2'>
        <Avatar src={PF+"/profile/"+user.profilePicture} isOnline={user.isOnline} />
        <span className='ms-5'>{user.username}</span>
      </Link>
    </li>
  );
}