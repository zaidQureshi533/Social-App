import React from 'react';
import Avatar from './Avatar';
import {useSelector} from 'react-redux';

const Message = ({msg}) => {
	const {sender, content, img, createdAt} = msg;
	const CurrentUser = useSelector((state) => state.user.value);
	const date = new Date(createdAt);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	return (
		<li
			className={`my-2 flex flex-col ${
				sender._id === CurrentUser._id ? 'items-end' : ''
			}`}
		>
			<div className='w-4/5'>
				<div className={`flex gap-2`}>
					<div>
						<Avatar img={sender.profilePicture} size={'32px'} />
					</div>
					<div className='w-full'>
						{content && (
							<p
								className={`msg-text rounded-lg ${
									sender._id === CurrentUser._id
										? 'bg-blue text-white'
										: 'bg-slate-100'
								} p-2`}
							>
								{content}
							</p>
						)}
						{img && (
							<div className='msg-img rounded-lg aspect-5/3 object-cover mt-1'>
								<img
									className='rounded-md'
									src={PF + `/messages/${img}`}
									alt='img'
								/>
							</div>
						)}
					</div>
				</div>
				<p className='text-right text-xs'>{`At ${date.getHours()}: ${date.getMinutes()}: ${date.getSeconds()}`}</p>
			</div>
		</li>
	);
};

export default Message;
