import React, { useEffect }  from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Rightbar from '../components/Rightbar';
import axios from 'axios';
import { updateUser } from '../store/states/userSlice';
import { useDispatch } from 'react-redux';

const Home = () => {

	const dispatch = useDispatch();
	const API = process.env.SERVER_API;
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			axios({
				method: 'post',
				url: `${API}/users/getuser`,
				headers: {Authorization: token},
			}).then((res) => {
				dispatch(updateUser(res.data));
			});
		}
	}, []);
	
	return (
		<>
			<Topbar />
			<div className='homeContainer flex'>
				<div className='w-1/4'>
					<Sidebar />
				</div>
				<div className='w-2/4'>
					<Feed />
				</div>
				<div className='w-1/4'>
					<Rightbar />
				</div>
			</div>
		</>
	);
};

export default Home;
