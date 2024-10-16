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
	BsFacebook,
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
const Topbar = () => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user.value);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const handleLogOut = async () => {
		publicRequest.post(`/auth/logout/${currentUser._id}`).then(() => {
			localStorage.removeItem('token');
			dispatch(logout());
			navigate('/login');
		});
	};

	const handleDeleteAccount = async () => {
		setShowDeleteModal(false);
		publicRequest
			.delete(`/users/${currentUser._id}`)
			.then(() => {
				localStorage.removeItem('token');
				dispatch(logout());
				navigate('/login');
			})
			.catch((error) => console.log(error));
	};
	return (
		<header className='sticky top-0  z-10'>
			<nav className='topbar bg-[#fcfbfb] text-black p-2 px-4 flex flex-col md:flex-row items-start md:items-center md:justify-between gap-3 text-sm h-13 shadow-md '>
				<div className='topbarLeft flex w-full md:w-1/4 justify-between gap-3'>
					<Link to='/'>
						<BsFacebook className='text-blue' size={40} />
					</Link>
					<div className='searchbar text-black rounded-3xl p-1 w-3/4 flex items-center justify-evenly bg-gray-200'>
						<IoSearchOutline />
						<input
							className='focus:outline-none w-3/4 bg-transparent text-black'
							type='search'
							name=''
							id=''
							placeholder='Search For Friends, Posts or Videos'
						/>
					</div>
				</div>
				<div className='topbarCenter flex justify-evenly w-2/4 text-gray-600'>
					<Tooltip label='Home'>
						<Link
							to='/'
							className='flex-1 py-2 px-10 rounded-lg hover:bg-gray-200 transition-all duration-150 flex justify-center'
						>
							<FiHome size={26} />
						</Link>
					</Tooltip>
					<Tooltip label='Video'>
						<Link
							to='/'
							className='flex-1 py-2 px-10 rounded-lg hover:bg-gray-200 transition-all duration-150 flex justify-center'
						>
							<GoVideo size={26} />
						</Link>
					</Tooltip>
					<Tooltip label='Marketplace'>
						<Link
							to='/'
							className='flex-1 py-2 px-10 rounded-lg hover:bg-gray-200 transition-all duration-150 flex justify-center'
						>
							<FiShoppingBag size={26} />
						</Link>
					</Tooltip>
					<Tooltip label='Groups'>
						<Link
							to='/'
							className='flex-1 py-2 px-10 rounded-lg hover:bg-gray-200 transition-all duration-150 flex justify-center'
						>
							<MdOutlineGroupWork size={26} />
						</Link>
					</Tooltip>
					<Tooltip label='Gaming'>
						<Link
							to='/'
							className='flex-1 py-2 px-10 rounded-lg hover:bg-gray-200 transition-all duration-150 flex justify-center'
						>
							<GrGamepad size={26} />
						</Link>
					</Tooltip>
				</div>
				<div className='topbarRight w-full md:w-1/4 flex items-center md:justify-end justify-between gap-3 mt-3 md:mt-0'>
					<Tooltip label='messages'>
						<div className='topbarIconItem text-lg relative cursor-pointer w-10 h-10 bg-gray-200 hover:bg-gray-300 flex justify-center items-center rounded-full'>
							<FaFacebookMessenger />
						</div>
					</Tooltip>
					<Tooltip label='notifications'>
						<div className='topbarIconItem text-lg relative cursor-pointer w-10 h-10 bg-gray-200 hover:bg-gray-300 flex justify-center items-center rounded-full'>
							<IoMdNotifications size={24} />
						</div>
					</Tooltip>
					<Dropdown
						label={
							<Avatar
								src={`${PF + 'profile/' + currentUser.profilePicture}`}
								isOnline={currentUser.isOnline}
								alt='Profile Photo'
							/>
						}
					>
						<Link to={`/profile/${currentUser._id}/${currentUser.username}`}>
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
			</nav>
		</header>
	);
};

export default Topbar;
