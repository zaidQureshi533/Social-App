import React, {useEffect, useState} from 'react';
import Share from './Share';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {publicRequest} from '../configuration/requestMethod';
import Post from './Post';

const Feed = () => {
	const {userId} = useParams();
	const [posts, setPosts] = useState([]);
	const currentUser = useSelector((state) => state.user.value);

	useEffect(() => {
		const fetchData = async () => {
			const res = userId
				? await publicRequest.get(`/posts?userId=${userId}`)
				: await publicRequest.get(`/posts`);
			setPosts(res.data);
		};
		fetchData();
	}, [userId, currentUser._id]);

	const handleDeletePost = (postId) => {
		const newPosts = posts.filter((post) => post._id !== postId);
		setPosts(newPosts);
	};

	return (
		<div className='feedbar p-4 '>
			{(!userId || userId === currentUser._id) && <Share />}
			{posts?.map((post) => {
				return (
					<Post key={post._id} post={post} onDeletePost={handleDeletePost} />
				);
			})}
		</div>
	);
};

export default Feed;
