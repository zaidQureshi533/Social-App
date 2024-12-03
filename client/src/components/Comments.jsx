import React, {useState, useRef, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import Comment from './Comment';
import {publicRequest} from '../configuration/requestMethod';
import {UploadImage} from '../configuration/apiCalls';
import {LuImagePlus, FiSend, MdClose} from './icons';
import {useSelector} from 'react-redux';
import {showAlert} from '../store/states/alertSlice';
import {socket} from '../configuration/socket';
const Comments = ({postId, comments, updateComments}) => {
	const [showMore, setShowMore] = useState(5);
	const [file, setFile] = useState(null);
	const [commentMessage, setCommentMessage] = useState('');
	const fileInputRef = useRef();
	const CurrentUser = useSelector((state) => state.user.value);
	const dispatch = useDispatch();
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
		socket.emit('newComment', postId, newComment);
		setCommentMessage('');
		setFile(null);
	};

	useEffect(() => {
		socket.on('newComment', (newComment) => {
			if (newComment) {
				const newComments = [...comments, newComment];
				updateComments(newComments);
			}
		});
	}, []);

	const clearFile = () => {
		setFile(null);
		fileInputRef.current.value = '';
	};

	const handleDeleteComment = (commentId) => {
		const newComments = comments.filter((comment) => {
			return comment._id !== commentId;
		});
		updateComments(newComments);
	};

	const handleShowMore = () => {
		setShowMore((prev) => {
			const newShowMore = prev + 10;
			return newShowMore > comments.length ? comments.length : newShowMore;
		});
	};
	return (
		<div className='p-2 text-gray-600'>
			{comments.length > 2 && showMore < comments.length && (
				<button className='text-sm font-bold mb-3' onClick={handleShowMore}>
					View more comments
				</button>
			)}
			<div className='flex flex-col gap-y-3'>
				{comments.slice(-showMore).map((comment) => {
					return (
						<Comment
							key={comment._id}
							comment={comment}
							onDelete={handleDeleteComment}
						/>
					);
				})}
				<form className='py-1 flex justify-around items-center bg-gray-100 rounded-full'>
					<textarea
						rows={1}
						value={commentMessage}
						className='test-sm md:text-base w-4/5 p-2 bg-transparent focus:outline-none rounded-full resize-none'
						type='text'
						placeholder={`Comment as ${CurrentUser.username}`}
						onChange={(e) => setCommentMessage(e.target.value)}
					/>
					<div className='controls flex gap-4 mr-2'>
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
	);
};

export default Comments;
