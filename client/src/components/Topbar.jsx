import {useDispatch, useSelector} from 'react-redux';
import Avatar from './Avatar';
import {Link, useNavigate} from 'react-router-dom';
import {Notifications, Person, Chat, Search} from './Icons';
import {updateUser} from '../store/states/userSlice';
import axios from 'axios';

const Topbar = () => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const API = process.env.SERVER_API;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const CurrentUser = useSelector((state) => state.user.value);

	const handleLogOut = async () => {
		axios({method: 'post', url: `${API}/auth/logout/${CurrentUser._id}`}).then((res)=> {
			localStorage.removeItem('token');
			dispatch(updateUser(res.data));
			navigate('/login');
		})
	};

	return (
		<div className='topbar bg-[#3e62da] text-white p-2 px-4 flex flex-col md:flex-row items-start md:items-center text-sm h-13 sticky top-0 z-10'>
			<div className='topbarLeft flex w-full md:w-3/4 justify-between gap-3 '>
				<Link to='/'>
					<span className='font-bold text-3xl'>facebook</span>
				</Link>
				<div className='searchbar bg-white text-black rounded-3xl p-1 w-3/4 flex items-center justify-evenly'>
					<Search />
					<input
						className='focus:outline-none w-3/4'
						type='search'
						name=''
						id=''
						placeholder='Search For Friends, Posts or Videos'
					/>
				</div>
				<button onClick={handleLogOut}>LogOut</button>
			</div>
			<div className='topbarRight w-full md:w-1/4 flex items-center md:justify-end justify-between gap-7 mt-3 md:mt-0'>
				<div className='flex gap-4'>
					<div className='topbarIconItem text-lg relative'>
						<Person />
						<span className='topbarIconBadge absolute inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-rose-500 rounded-full -top-2 -end-2 dark:border-gray-900 '>
							1
						</span>
					</div>
					<div className='topbarIconItem text-lg relative'>
						<Chat />
						<span className='topbarIconBadge absolute inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-rose-500 rounded-full -top-2 -end-2 dark:border-gray-900 '>
							3
						</span>
					</div>
					<div className='topbarIconItem text-lg relative'>
						<Notifications />
						<span className='topbarIconBadge absolute inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-rose-500 rounded-full -top-2 -end-1 dark:border-gray-900 '>
							2
						</span>
					</div>
				</div>
				<Link to={`/profile/${CurrentUser._id}/${CurrentUser.username}`}>
					<Avatar
						src={`${PF + 'profile/' + CurrentUser.profilePicture}`}
						isOnline={CurrentUser.isOnline}
						alt='Profile Photo'
					/>
				</Link>
			</div>
		</div>
	);
};

export default Topbar;
