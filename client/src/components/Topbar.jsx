import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from './Avatar';
import {Link, useNavigate} from 'react-router-dom';
import {logout} from '../store/states/userSlice';
import {publicRequest} from '../configuration/requestMethod';
import Dropdown from './Dropdown';
import {
	FaFacebookMessenger,
	IoMdNotifications,
	IoPersonCircleSharp,
	IoSearchOutline,
	HiLogout,
	FiHome,
	FiShoppingBag,
	MdOutlineDelete,
	MdOutlineGroupWork,
	GrGamepad,
	GoVideo,
} from './icons';

import Modal from './Modal';
import Tooltip from './Tooltip';
import {emitLogoutUser, socket} from '../configuration/socket';

import Chats from './Chats';
import Notifications from './Notifications';
const Topbar = () => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const CurrentUser = useSelector((state) => state.user.value);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const handleLogOut = async () => {
		emitLogoutUser(CurrentUser._id);
		localStorage.removeItem('token');
		dispatch(logout());
		navigate('/login');
	};

	const handleDeleteAccount = async () => {
		setShowDeleteModal(false);
		publicRequest
			.delete(`/users/${CurrentUser._id}`)
			.then(() => {
				localStorage.removeItem('token');
				dispatch(logout());
				navigate('/login');
			})
			.catch((error) => console.log(error));
	};
	return (
		<header className='sticky top-0 z-10 bg-white px-4 py-3 shadow'>
			<nav>
				<div className=''>
					<div className='flex flex-col lg:flex-row gap-3 items-center'>
						<div className='flex-left w-full lg:w-auto inline-flex justify-between items-center lg:gap-x-4'>
							<Link to={'/'} className='text-blue font-bold h2'>
								facebook
							</Link>
							<div className='search-bar flex items-center px-4 py-2 rounded-full bg-gray-200'>
								<label htmlFor='searchBar'>
									<IoSearchOutline size={20} />
								</label>
								<input
									type='search'
									id='searchBar'
									placeholder='Search for friends and groups'
									className='outline-none bg-transparent w-40 ml-3'
								/>
							</div>
						</div>
						<div className='flex-right flex justify-between w-full'>
							<div className='flex w-3/4 justify-between gap-4'>
								<Link
									to={'/'}
									className='flex-1 hover:bg-gray-200 rounded-md flex justify-center items-center duration-150'
								>
									<Tooltip label={'Home'}>
										<FiHome size={24} />
									</Tooltip>
								</Link>
								<Link
									to={'/'}
									className='flex-1 hover:bg-gray-200 rounded-md flex justify-center items-center duration-150'
								>
									<Tooltip label={'Video'}>
										<GoVideo size={24} />
									</Tooltip>
								</Link>
								<Link
									to={'/'}
									className='flex-1 hover:bg-gray-200 rounded-md flex justify-center items-center duration-150'
								>
									<Tooltip label={'Groups'}>
										<MdOutlineGroupWork size={24} />
									</Tooltip>
								</Link>
								<Link
									to={'/'}
									className='flex-1 hover:bg-gray-200 rounded-md flex justify-center items-center duration-150'
								>
									<Tooltip label={'Shopping'}>
										<FiShoppingBag size={24} />
									</Tooltip>
								</Link>
								<Link
									to={'/'}
									className='flex-1 hover:bg-gray-200 rounded-md flex justify-center items-center duration-150'
								>
									<Tooltip label={'Gaming'}>
										<GrGamepad size={24} />
									</Tooltip>
								</Link>
							</div>
							<div className='flex gap-3'>
								<Chats />

								<Notifications />

								<Dropdown
									label={
										<Avatar
											img={CurrentUser.profilePicture}
											alt='Profile Photo'
											overlay
										/>
									}
								>
									<Link
										to={`/profile/${CurrentUser._id}/${CurrentUser.username}`}
									>
										<IoPersonCircleSharp size={22} />
										View Profile
									</Link>
									<button onClick={() => setShowDeleteModal(true)}>
										<Modal
											title='Delete Account'
											message='Your account will be deleted permanently'
											isOpen={showDeleteModal}
											buttonLabel='Delete'
											onAction={handleDeleteAccount}
											onCancle={() => setShowDeleteModal(false)}
										/>
										<MdOutlineDelete size={22} />
										Delete Account
									</button>
									<button
										className='flex gap-5 w-full items-center px-4 py-2  hover:bg-gray-100 hover:text-black transition-all duration-150'
										onClick={handleLogOut}
									>
										<HiLogout size={22} />
										Log Out
									</button>
								</Dropdown>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Topbar;
