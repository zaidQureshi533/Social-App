import React, {useEffect, useState} from 'react';

import Share from './Share';
import Post from './Post';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
const Feed = () => {
	const {userId} = useParams();
	const [posts, setPosts] = useState([]);
	const API = process.env.SERVER_API;
	const currentUser = useSelector((state) => state.user.value);

	useEffect(() => {
		const fetchData = async () => {
			const res = userId
				? await axios.get(`${API}/posts?userId=${userId}`)
				: await axios.get(`${API}/posts`);
			setPosts(res.data);
		};
		fetchData();
	}, [userId, currentUser._id]);
	return (
		<div className='feedbar p-4'>
			{(!userId || userId === currentUser._id) && <Share />}
			{posts.map((post) => {
				return <Post key={post._id} post={post} />;
			})}
		</div>
	);
};

export default Feed;
