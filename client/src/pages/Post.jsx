import React, {useEffect, useState} from 'react';
import Topbar from '../components/Topbar';
import {useParams} from 'react-router-dom';
import CurrentPost from '../components/Post';
import Rightbar from '../components/Rightbar';
import {publicRequest} from '../configuration/requestMethod';

const Post = () => {
	const [post, setPost] = useState(null);
	const {postId} = useParams();
	useEffect(() => {
		publicRequest
			.get(`/posts/${postId}`)
			.then((res) => {
				setPost(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [postId]);

	return (
		<>
			<Topbar />
			<div className='flex justify-between'>
				<div className='w-full lg:w-2/4 mx-auto px-3'>
					{post && <CurrentPost post={post} postId />}
				</div>
				<div className='w-1/4 hidden lg:block'>
					<Rightbar />
				</div>
			</div>
		</>
	);
};

export default Post;
