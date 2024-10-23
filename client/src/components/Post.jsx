import React, {useState, useRef, useContext} from 'react';
import {useSelector} from 'react-redux';
import {format} from 'timeago.js';
import Avatar from './Avatar';
import Dropdown from './Dropdown';
import {Link} from 'react-router-dom';
import {publicRequest} from '../configuration/requestMethod';
import {
	BiHide,
	BiSolidLike,
	SlOptions,
	LuImagePlus,
	LuThumbsUp,
	RiChat3Line,
	RiShareForwardLine,
	SiWhatsapp,
	LiaEdit,
	MdOutlineDelete,
	FiSend,
	MdClose,
} from './icons';

import Modal from './Modal';
import {UploadImage} from '../configuration/apiCalls';
import {ThemeContext} from '../App';
import Comments from './Comments';

const Post = ({post, onDeletePost, postId}) => {
	const CurrentUser = useSelector((state) => state.user.value);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const {_id, desc, photo, user, likes, comments, createdAt} = post;
	const [postComments, setPostComments] = useState(comments);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [likeCount, setLikeCount] = useState(likes.length);
	const [isLiked, setIsLiked] = useState(likes.includes(CurrentUser._id));
	const [file, setFile] = useState(null);
	const [commentMessage, setCommentMessage] = useState('');
	const fileInputRef = useRef();
	const {showAlert} = useContext(ThemeContext);

	const likeHandler = async () => {
		await publicRequest
			.put(`/posts/${_id}/like`, {
				userId: CurrentUser._id,
			})
			.catch((error) => console.log(error));
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
					showAlert('danger', error.response.data.message);
				} else {
					showAlert('danger', 'An unknown error occurred');
				}
			});
	};

	const handleEditPost = () => {
		// to do
	};

	const handleNewComment = () => {
		const newComment = {
			user: CurrentUser._id,
			body: {
				message: commentMessage,
			},
		};
		if (file) {
			const fileName = Date.now() + file.name;
			newComment.body.image = fileName;
			const data = new FormData();
			data.append('name', fileName);
			data.append('file', file);
			UploadImage('post', data);
		}
		publicRequest
			.post(`/posts/${_id}/comments`, newComment)
			.then((res) => {
				setCommentMessage('');
				setFile(null);
				setPostComments(res.data);
			})
			.catch((error) => {
				showAlert('danger', error.response.data.message);
			});
	};

	const clearFile = () => {
		setFile(null);
		fileInputRef.current.value = '';
	};

	const handleDeleteComment = (commentId) => {
		setPostComments((prevComments) =>
			prevComments.filter((comment) => comment._id !== commentId)
		);
	};

	return (
		<>
			<div className='post w-full mt-5 rounded-lg shadow-[0_0_14px_-8px_rgba(0,0,0,0.4)]'>
				<div className='postWrapper'>
					<div className='postTop flex justify-between items-center py-2 px-3'>
						<div className='postTopLeft flex items-center gap-4'>
							<Link to={`/profile/${user._id}/${user.username}`}>
								<Avatar
									src={`${PF + 'profile/' + user.profilePicture}`}
									isOnline={user.isOnline}
								/>
							</Link>
							<div className='flex flex-col'>
								<Link to={`/profile/${user._id}/${user.username}`}>
									<h4 className='postUsername text-gray-800 font-semibold hover:underline cursor-pointer'>
										{user.username}
									</h4>
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
								<span className='postLikeCounter select-none text-sm'>
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
								<span className='postComment select-none cursor-pointer text-sm'>
									{postComments.length > 0 ? postComments.length : ''}
									{postComments.length > 1 ? ' Comments' : ' Comment'}
								</span>
							</div>
						</div>

						<div className='bottomCenter flex gap-2 my-2 border-t border-b py-1'>
							<Button
								action={likeHandler}
								className={`${isLiked ? 'text-blue' : ''}`}
							>
								<LuThumbsUp size={20} />
								Like
							</Button>
							<Link
								className={`font-bold flex-1 flex justify-center gap-2 py-3 rounded-md hover:bg-gray-200 cursor-pointer transition-all duration-150`}
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
						{/* comments section */}
						<Comments
							comments={postId ? postComments : postComments.slice(-2)}
							onDeleteComment={handleDeleteComment}
						/>

						<form className='py-1 flex justify-around items-center bg-gray-100 rounded-full'>
							<textarea
								rows={1}
								value={commentMessage}
								className='text-base w-4/5 p-2 bg-transparent focus:outline-none rounded-full resize-none'
								type='text'
								placeholder={`Comment as ${CurrentUser.username}`}
								onChange={(e) => setCommentMessage(e.target.value)}
							/>
							<div className='controls flex gap-4'>
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
									onClick={handleNewComment}
									type='button'
									disabled={!commentMessage && !file}
								>
									<FiSend size={20} />
								</button>
							</div>
						</form>
						{file && (
							<div className='relative w-[30%]'>
								<img
									className='mt-2 rounded-md aspect-5/3 object-cover'
									src={URL.createObjectURL(file)}
									alt=''
								/>
								<button
									className='absolute top-1 right-1 w-4 h-4 flex justify-center items-center rounded-full bg-gray-800'
									onClick={clearFile}
								>
									<MdClose size={12} color='#fff' />
								</button>
							</div>
						)}
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
			className={`font-bold flex-1 flex justify-center gap-2 py-3 rounded-md hover:bg-gray-200 cursor-pointer transition-all duration-150 ${className}`}
		>
			{children}
		</button>
	);
};
