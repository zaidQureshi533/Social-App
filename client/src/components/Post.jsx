import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {format} from 'timeago.js';
import Avatar from './Avatar';
import {BiSolidLike, BiSolidHeart} from 'react-icons/bi';
import {Link} from 'react-router-dom';
import {SlOptions} from 'react-icons/sl';
import {publicRequest} from '../configuration/requestMethod';
const Post = ({post}) => {
	const CurrentUser = useSelector((state) => state.user.value);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	const {_id, desc, photo, userId, likes, comments, createdAt} = post;
	const [likeCount, setLikeCount] = useState(likes.length);
	const [user, setUser] = useState({});
	const [isLiked, setIsLiked] = useState(likes.includes(CurrentUser._id));
	useEffect(() => {
		publicRequest
			.get(`/users/${userId}`)
			.then((res) => setUser(res.data))
			.catch((error) => {
				console.log(error);
			});
	}, [userId]);

	const likeHandler = async () => {
		await publicRequest
			.put(`/posts/${_id}/like`, {
				userId: CurrentUser._id,
			})
			.catch((error) => console.log(error));
		setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
		setIsLiked(!isLiked);
	};

	return (
		<>
			<div className='post mt-5 rounded-lg shadow-[0_0_14px_-8px_rgba(0,0,0,0.4)]'>
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
									<span className='postUsername text-gray-800 font-semibold hover:underline cursor-pointer'>
										{user.username}
									</span>
								</Link>
								<span className='postDate text-sm text-gray-600'>
									{format(createdAt)}
								</span>
							</div>
						</div>
						<div className='postTopRight w-8 h-8 flex justify-center items-center rounded-full hover:bg-slate-50 cursor-pointer transition-all duration-150'>
							<SlOptions size={16} />
						</div>
					</div>

					<div className='postCenter'>
						<p className='postText px-3'>{desc ? desc : ''}</p>
						{photo && (
							<img
								src={`${PF}posts/${photo}`}
								alt=''
								className='postImg w-full aspect-5/3 object-cover'
							/>
						)}
					</div>
					<div className='postBottom text-sm text-gray-600 flex justify-between items-center p-3'>
						<div className='postBottomLeft flex items-center gap-2 cursor-pointer'>
							<BiSolidLike onClick={likeHandler} color='#3e62da' size={22} />
							<BiSolidHeart onClick={likeHandler} color='#ff1d1d' size={22} />
							<span className='postLikeCounter ms-2 select-none'>
								{likeCount} People like this
							</span>
						</div>
						<div className='postBottomRight'>
							<span className='postComment select-none cursor-pointer'>
								{comments} {comments > 1 ? 'Comments' : 'Comment'}
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Post;
