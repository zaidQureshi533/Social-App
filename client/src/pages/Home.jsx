import React from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Rightbar from '../components/Rightbar';

const Home = () => {
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
