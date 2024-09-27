import {useDispatch, useSelector} from 'react-redux';
import Avatar from './Avatar';
import {Link, useNavigate} from 'react-router-dom';
import {updateUser} from '../store/states/userSlice';
import {
	IoSearchOutline,
	IoPerson,
	IoChatboxSharp,
	IoNotificationsSharp,
} from 'react-icons/io5';
import {publicRequest} from '../configuration/requestMethod';
import {IoPersonCircleSharp} from 'react-icons/io5';
import {HiLogout} from 'react-icons/hi';
import {MdOutlineDelete} from 'react-icons/md';
import Dropdown from './Dropdown';
import {useState} from 'react';
import Modal from './Modal';
const Topbar = () => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user.value);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const handleLogOut = async () => {
		publicRequest.post(`/auth/logout/${currentUser._id}`).then((res) => {
			localStorage.removeItem('token');
			dispatch(updateUser(res.data));
			navigate('/login');
		});
	};

	const handleDeleteAccount = async () => {
		setShowDeleteModal(false)
		publicRequest
			.delete(`/users/${currentUser._id}`)
			.then(() => {
				localStorage.removeItem('token');
				dispatch(updateUser({isLogin: false}));
				navigate('/login');
			})
			.catch((error) => console.log(error));
	};
	return (
		<div className='topbar bg-[#3e62da] text-white p-2 px-4 flex flex-col md:flex-row items-start md:items-center text-sm h-13 sticky top-0 z-10'>
			<div className='topbarLeft flex w-full md:w-3/4 justify-between gap-3'>
				<Link to='/'>
					<span className='font-bold text-3xl'>facebook</span>
				</Link>
				<div className='searchbar bg-white text-black rounded-3xl p-1 w-3/4 flex items-center justify-evenly'>
					<IoSearchOutline />
					<input
						className='focus:outline-none w-3/4'
						type='search'
						name=''
						id=''
						placeholder='Search For Friends, Posts or Videos'
					/>
				</div>
			</div>
			<div className='topbarRight w-full md:w-1/4 flex items-center md:justify-end justify-between gap-7 mt-3 md:mt-0'>
				<div className='flex gap-4'>
					<div className='topbarIconItem text-lg relative cursor-pointer'>
						<IoPerson />
						<span className='topbarIconBadge absolute inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-rose-500 rounded-full -top-2 -end-2 dark:border-gray-900 '>
							1
						</span>
					</div>
					<div className='topbarIconItem text-lg relative cursor-pointer'>
						<IoChatboxSharp />
						<span className='topbarIconBadge absolute inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-rose-500 rounded-full -top-2 -end-2 dark:border-gray-900 '>
							3
						</span>
					</div>
					<div className='topbarIconItem text-lg relative cursor-pointer'>
						<IoNotificationsSharp />
						<span className='topbarIconBadge absolute inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-rose-500 rounded-full -top-2 -end-1 dark:border-gray-900 '>
							2
						</span>
					</div>
				</div>
				<Dropdown
					label={
						<Avatar
							src={`${PF + 'profile/' + currentUser.profilePicture}`}
							isOnline={currentUser.isOnline}
							alt='Profile Photo'
						/>
					}
				>
					<Link
						className='flex justify-between items-center px-4 py-2 text-sm  hover:bg-gray-100 hover:text-black transition-all duration-150'
						to={`/profile/${currentUser._id}/${currentUser.username}`}
					>
						Profile
						<IoPersonCircleSharp size={26} />
					</Link>
					<Modal
						title='Delete Account'
						message='Your account will be deleted permanently'
						isOpen={showDeleteModal}
						buttonLabel='Delete'
						onAction={handleDeleteAccount}
						onCancle={()=> setShowDeleteModal(false)}
					>
						<button
							className='flex justify-between w-full items-center px-4 py-2 text-sm  hover:bg-gray-100 hover:text-black transition-all duration-150'
							onClick={()=> setShowDeleteModal(true)}
						>
							Delete Account
							<MdOutlineDelete size={24} />
						</button>
					</Modal>
					<hr />
					<button
						className='flex justify-between w-full items-center px-4 py-2 text-sm  hover:bg-gray-100 hover:text-black transition-all duration-150'
						onClick={handleLogOut}
					>
						Log Out
						<HiLogout size={20} />
					</button>
				</Dropdown>
			</div>
		</div>
	);
};

export default Topbar;
