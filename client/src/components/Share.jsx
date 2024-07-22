import React, {useRef, useState} from 'react';
import {Close, EmojiOptions, Location, Media, Tag} from './Icons';
import Avatar from './Avatar';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

const Share = () => {
	const currentUser = useSelector((state) => state.user.value);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const API = process.env.SERVER_API;
	const desc = useRef();
	const [file, setFile] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newPost = {
			userId: currentUser._id,
			desc: desc.current.value,
		};
		if (file) {
			const data = new FormData();
			const fileName = Date.now() + file.name;
			data.append('name', fileName);
			data.append('file', file);
			newPost.photo = fileName;
			try {
				await axios.post(`${API}/upload/post`, data);
			} catch (err) {
				console.log(err);
			}
		}
		try {
			await axios.post(`${API}/posts`, newPost);
			window.location.reload();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<div className='share w-full  rounded-lg shadow-[0_0_14px_-8px_rgba(0,0,0,0.4)] p-3'>
				<div className='shareWrapper'>
					<div className='shareTop flex items-center'>
						<Link to={`/profile/${currentUser._id}/${currentUser.username}`}>
							<Avatar
								src={`${PF + 'profile/' + currentUser.profilePicture}`}
								isOnline={currentUser.isOnline}
							/>
						</Link>
						<input
							ref={desc}
							type='text'
							placeholder={`What's on your mind, ${currentUser.username?.split(" ")[0]}?`}
							className='shareInput ml-4 w-4/5 focus:outline-none text-sm'
						/>
					</div>
					<hr className='shareHr mt-2' />
					{file && (
						<div className='relative'>
							<img
								className='mt-2 rounded-md w-[30%] aspect-5/3 object-cover'
								src={URL.createObjectURL(file)}
								alt=''
							/>
							<button
								className='absolute -top-1 -left-1'
								onClick={() => setFile(null)}
							>
								<Close />
							</button>
						</div>
					)}
					<form
						className='shareBottom flex items-center justify-between p-4'
						onSubmit={handleSubmit}
						encType='multipart/form-data'
					>
						<div className='shareOptions flex gap-7 text-sm'>
							<label
								htmlFor='file'
								className='shareOption flex items-center gap-2 cursor-pointer'
							>
								<Media />
								<span className='shareOptiontext'>Photo or Video</span>
								<input
									className='hidden'
									type='file'
									name='file'
									id='file'
									accept='.png,.jpg,.jpeg,.webp'
									onChange={(e) => setFile(e.target.files[0])}
								/>
							</label>
							<div className='shareOption flex items-center gap-2 cursor-pointer'>
								<Tag />
								<span className='shareOptiontext'>Tag</span>
							</div>
							<div className='shareOption flex items-center gap-2 cursor-pointer'>
								<Location />
								<span className='shareOptiontext'>Location</span>
							</div>
							<div className='shareOption flex items-center gap-2 cursor-pointer'>
								<EmojiOptions />
								<span className='shareOptiontext'>Feelings</span>
							</div>
						</div>
						<button
							className='bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 hover:shadow-md transition-all duration-100'
							type='submit'
						>
							Share
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default Share;
