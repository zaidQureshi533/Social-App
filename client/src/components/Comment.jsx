import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Avatar from './Avatar';
import {LiaEdit, MdOutlineDelete, SlOptions} from './icons';
import Dropdown from './Dropdown';
import Modal from './Modal';
import {format} from 'timeago.js';
import {useSelector} from 'react-redux';
import {publicRequest} from '../configuration/requestMethod';

const Comment = ({comment, onDelete}) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const {_id, username, profilePicture} = comment.user;
	const {message, image} = comment.body;
	const [showModal, setShowModal] = useState(false);
	const currentUser = useSelector((state) => state.user.value);
	// delete comment
	const handleDeleteComment = async () => {
		publicRequest
			.delete(`/posts/comment/${comment._id}`)
			.then(() => {
				onDelete(comment._id);
			})
			.catch((error) => {
				console.log(error.message);
			});
	};

	return (
		<div className='commentWrapper'>
			<div className='commentBody flex gap-x-2'>
				<Link to={`/profile/${_id}/${username}`} className='self-start'>
					<Avatar src={`${PF + 'profile/' + profilePicture}`} size="34px" />
				</Link>
				<div className='commentContent flex gap-4 '>
					<div className='comment min-w-36'>
						<div className={`${message && 'bg-gray-100'} rounded-lg py-2 px-3`}>
							<Link
								to={`/profile/${_id}/${username}`}
								className='font-bold hover:underline'
							>
								{username}
							</Link>
							{message && <p>{message}</p>}
						</div>
						{image && (
							<div className='w-full aspect-5/3 rounded-lg'>
								<img
									src={PF + '/posts/' + image}
									className='w-auto h-full object-cover rounded-lg'
								/>
							</div>
						)}
						<div className='flex gap-10 px-2 select-none mt-1'>
							<span className='text-xs'>{format(comment.createdAt)}</span>
							<span className='text-xs font-semibold'>Like</span>
						</div>
					</div>
					{comment.user._id === currentUser._id && (
						<Dropdown label={<SlOptions size={18} />}>
							<button>
								<LiaEdit size={22} /> Edit
							</button>

							<button onClick={() => setShowModal(true)}>
								<Modal
									title={''}
									message={''}
									isOpen={showModal}
									buttonLabel='Delete'
									onAction={_id === currentUser._id && handleDeleteComment}
									onCancle={() => setShowModal(false)}
								/>
								<MdOutlineDelete size={22} /> Delete
							</button>
						</Dropdown>
					)}
				</div>
			</div>
		</div>
	);
};

export default Comment;