import React, {useRef, useState} from 'react';
import Avatar from './Avatar';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {
	MdOutlinePermMedia,
	MdLocationOn,
	MdClose,
	BsEmojiSmileFill,
	BsTagFill,
} from './icons';
import {UploadImage} from '../configuration/apiCalls';
import {publicRequest} from '../configuration/requestMethod';
const Share = () => {
	const currentUser = useSelector((state) => state.user.value);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const [desc, setDesc] = useState('');
	const fileInputRef = useRef();
	const [file, setFile] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newPost = {
			user: currentUser._id,
			desc,
		};
		if (file) {
			const data = new FormData();
			const fileName = Date.now() + file.name;
			data.append('name', fileName);
			data.append('file', file);
			newPost.photo = fileName;
			try {
				UploadImage('post', data);
			} catch (err) {
				console.log(err);
			}
		}
		try {
			await publicRequest.post(`/posts`, newPost);
			window.location.reload();
		} catch (err) {
			console.log(err);
		}
	};

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const clearFile = () => {
		setFile(null);
		fileInputRef.current.value = '';
	};

	return (
		<div className='mb-3'>
			<div className='shareWrapper bg-white w-full rounded-lg shadow-[0_0_10px_-5px_rgba(0,0,0,0.6)] p-3'>
				<div className='shareTop flex items-center'>
					<Link to={`/profile/${currentUser._id}/${currentUser.username}`}>
						<Avatar overlay img={currentUser.profilePicture} />
					</Link>
					<input
						onChange={(e) => setDesc(e.target.value)}
						type='text'
						placeholder={`What's on your mind, ${
							currentUser.username?.split(' ')[0]
						}?`}
						className='shareInput ml-4 w-4/5 focus:outline-none text-sm bg-transparent'
					/>
				</div>
				<hr className='shareHr my-4' />
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
				<form
					className='shareBottom flex items-center justify-between'
					onSubmit={handleSubmit}
					encType='multipart/form-data'
				>
					<label
						htmlFor='file'
						className='shareOption flex items-center gap-2 cursor-pointer'
					>
						<MdOutlinePermMedia color='tomato' size={20} />
						<span className='shareOptiontext hidden md:block'>
							Photo or Video
						</span>
						<input
							ref={fileInputRef}
							className='hidden'
							type='file'
							name='file'
							id='file'
							accept='.png,.jpg,.jpeg,.webp,.jfif,.avif'
							onChange={handleFileChange}
						/>
					</label>
					<div className='shareOption flex items-center gap-2 cursor-pointer'>
						<BsTagFill color='#3e62da' size={20} />
						<span className='shareOptiontext hidden md:block'>Tag</span>
					</div>
					<div className='shareOption flex items-center gap-2 cursor-pointer'>
						<MdLocationOn color='green' size={24} />
						<span className='shareOptiontext hidden md:block'>Location</span>
					</div>
					<div className='shareOption flex items-center gap-2 cursor-pointer'>
						<BsEmojiSmileFill color='#ffbf00' size={20} />
						<span className='shareOptiontext hidden md:block'>Feelings</span>
					</div>

					<button
						disabled={!file && desc === ''}
						className='bg-green-600 disabled:bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 hover:shadow-md transition-all duration-100'
						type='submit'
					>
						Share
					</button>
				</form>
			</div>
		</div>
	);
};

export default Share;
