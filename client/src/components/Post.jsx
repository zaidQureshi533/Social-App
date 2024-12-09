import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {format} from 'timeago.js';
import Avatar from './Avatar';
import Dropdown from './Dropdown';
import {Link} from 'react-router-dom';
import {publicRequest} from '../configuration/requestMethod';
import {errorAlert} from '../store/states/alertSlice';
import {
	BiHide,
	BiSolidLike,
	SlOptions,
	LuThumbsUp,
	RiChat3Line,
	RiShareForwardLine,
	SiWhatsapp,
	LiaEdit,
	MdOutlineDelete,
} from './icons';

import Modal from './Modal';
import Comments from './Comments';
import {socket} from '../configuration/socket';

const Post = ({post, onDeletePost, postId}) => {
	const CurrentUser = useSelector((state) => state.user.value);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const {_id, desc, photo, user, likes, comments, createdAt} = post;
	const [postComments, setPostComments] = useState(comments);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [likeCount, setLikeCount] = useState(likes.length);
	const [isLiked, setIsLiked] = useState(likes.includes(CurrentUser._id));
	const dispatch = useDispatch();

	const likeHandler = async () => {
		const postId = post._id;
		const userId = CurrentUser._id;
		socket.emit('likePost', postId, userId);
		setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
		setIsLiked(!isLiked);
	};

	const handleDeletePost = () => {
		publicRequest
			.delete(`/posts/${_id}`)
			.then(() => {
				onDeletePost(_id);
			})
			.catch((error) => {
				if (error.response) {
					dispatch(
						errorAlert(error.response.data.message)
					);
				} else {
					dispatch(
						errorAlert('an unknown error occured')
					);
				}
			});
	};

	const handleEditPost = () => {
		// to do
	};

	const updateComments = (newComments) => {
		setPostComments(newComments);
	};

	return (
		<>
			<div className='post w-full mb-3 rounded-lg shadow-[0_0_10px_-5px_rgba(0,0,0,0.6)] bg-white'>
				<div className='postWrapper'>
					<div className='postTop flex justify-between items-center py-2 px-3'>
						<div className='postTopLeft flex items-center gap-4'>
							<Link to={`/profile/${user._id}/${user.username}`}>
								<Avatar img={user.profilePicture} overlay />
							</Link>
							<div className='flex flex-col'>
								<Link to={`/profile/${user._id}/${user.username}`}>
									<h5 className='postUsername text-gray-800 font-semibold hover:underline cursor-pointer'>
										{user.username}
									</h5>
								</Link>
								<span className='postDate text-sm text-gray-600'>
									{format(createdAt)}
								</span>
							</div>
						</div>
						<div className='postTopRight cursor-pointer'>
							<Dropdown label={<SlOptions size={18} />}>
								{post.user._id === CurrentUser._id && (
									<button>
										<LiaEdit size={22} /> Edit Post
									</button>
								)}
								{post.user._id === CurrentUser._id && (
									<button onClick={() => setShowDeleteModal(true)}>
										<Modal
											title='Delete Post'
											message='Are you sure you want to delete the post?'
											isOpen={showDeleteModal}
											buttonLabel='Delete'
											onAction={handleDeletePost}
											onCancle={() => setShowDeleteModal(false)}
										/>
										<MdOutlineDelete size={22} /> Delete Post
									</button>
								)}

								<button>
									<BiHide size={22} /> Hide from me
								</button>
							</Dropdown>
						</div>
					</div>

					<div className='postCenter'>
						<p className='postText py-1 px-2'>{desc ? desc : ''}</p>
						{photo && (
							<img
								src={`${PF}posts/${photo}`}
								alt=''
								className='postImg w-full aspect-5/3 object-contain'
							/>
						)}
					</div>
					<div className='postBottom text-sm text-gray-600 p-3'>
						<div className='bottomTop flex justify-between items-center'>
							<div className='postBottomLeft flex items-center gap-2'>
								{likeCount > 0 && (
									<div className='w-6 h-6 rounded-full bg-blue flex items-center justify-center'>
										<BiSolidLike color='#ffff' size={14} />
									</div>
								)}
								<span className='postLikeCounter select-none'>
									{likeCount === 0
										? ''
										: isLiked && likeCount === 1
										? '1'
										: isLiked && likeCount > 1
										? `You and ${likeCount - 1}`
										: `${likeCount}`}
								</span>
							</div>
							<div className='postBottomRight'>
								<span className='postComment select-none cursor-pointer'>
									{postComments.length > 0 ? postComments.length : ''}
									{postComments.length > 1 ? ' Comments' : ' Comment'}
								</span>
							</div>
						</div>

						<div className='bottomCenter flex gap-2 my-2 border-t border-b py-1 h6'>
							<Button
								action={likeHandler}
								className={`${isLiked ? 'text-blue' : ''}`}
							>
								<LuThumbsUp size={20} />
								Like
							</Button>
							<Link
								className={`font-bold flex-1 flex justify-center gap-2 py-2 rounded-md hover:bg-gray-200 cursor-pointer transition-all duration-150`}
								to={`/posts/${_id}`}
							>
								<RiChat3Line size={20} />
								Comment
							</Link>
							<Button>
								<SiWhatsapp size={20} />
								Send
							</Button>
							<Button>
								<RiShareForwardLine size={20} />
								Share
							</Button>
						</div>
						{/* comments */}
						<Comments
							postId={_id}
							comments={postId ? postComments : postComments.slice(-2)}
							updateComments={updateComments}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Post;

const Button = ({action, className, children}) => {
	return (
		<button
			onClick={action}
			className={`font-bold flex-1 flex justify-center gap-2 py-2 rounded-md hover:bg-gray-200 cursor-pointer transition-all duration-150 ${className}`}
		>
			{children}
		</button>
	);
};
