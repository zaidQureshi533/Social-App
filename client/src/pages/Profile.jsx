import React, {useEffect, useState, useRef} from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Rightbar from '../components/Rightbar';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {FaCamera} from 'react-icons/fa';
import {publicRequest} from '../configuration/requestMethod';
import {UploadImage} from '../configuration/apiCalls';
import Modal from '../components/Modal';
const Profile = () => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	const [user, setUser] = useState({});
	const {userId} = useParams();
	const fileInputRef = useRef();
	const [file, setFile] = useState(null);
	const CurrentUser = useSelector((state) => state.user.value);

	useEffect(() => {
		publicRequest
			.get(`/users/${userId}`)
			.then((res) => setUser(res.data))
			.catch((error) => console.log(error));
	}, [userId]);

	// update profile picture

	const handleProfileUpdate = async () => {
		const fileName =
			Date.now() + CurrentUser._id + '.' + file.name.split('.').slice(-1);
		if (file) {
			const data = new FormData();
			data.append('name', fileName);
			data.append('file', file);
			try {
				UploadImage('profile', data);
			} catch (err) {
				console.log(err);
			}
		}
		try {
			await publicRequest.post(`/users/update/profile`, {
				id: CurrentUser._id,
				file: fileName,
			});
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
		<>
			<Topbar />
			<Modal
				isOpen={file ? true : false}
				title='Update Profile Photo'
				message='Are you sure! you want to update your profile image?'
				buttonLabel='Update'
				onAction={handleProfileUpdate}
				onCancle={clearFile}
			/>
			<div className='profile flex'>
				<div className='profileLeftbar w-1/4'>
					<Sidebar />
				</div>
				<div className='profileRightbar w-3/4'>
					<div className='profileRightbarTop'>
						<img
							src={`${
								user.coverPicture ? PF + user.coverPicture : PF + 'noCover.jpg'
							}`}
							alt=''
							className='profileCoverImg w-full object-cover rounded-b-lg h-80'
						/>
						<div className='relative -top-8 flex justify-center'>
							<div className='flex flex-col items-center gap-2'>
								<div className='relative'>
									<img
										src={`${PF + 'profile/' + user.profilePicture}`}
										alt=''
										className='userProfileImg rounded-full w-36 h-36 object-cover border-4 shadow-md border-white'
									/>
									{/* input for update profile Picture */}
									{CurrentUser._id === userId && (
										<form>
											<label
												htmlFor='updateProfile'
												className='absolute bottom-1 right-1 w-9 h-9 bg-gray-100 flex justify-center items-center rounded-full cursor-pointer hover:bg-gray-200'
											>
												<FaCamera size={20} />
											</label>
											<input
												ref={fileInputRef}
												className='hidden'
												type='file'
												name='file'
												id='updateProfile'
												accept='.jpg,.png,.jpeg,.webp'
												onChange={handleFileChange}
											/>
										</form>
									)}
								</div>
								<div className='profileInfo pt-2 flex flex-col items-center'>
									<h1 className='profileName font-bold text-2xl text-gray-700'>
										{user.username}
									</h1>
									<span className='profileDesc cursor-pointer hover:underline font-light'>
										{user.desc}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className='profileRightbarBottom flex'>
						<div className='w-2/3'>
							<Feed />
						</div>
						<div className='w-1/3'>
							<Rightbar user={user} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
