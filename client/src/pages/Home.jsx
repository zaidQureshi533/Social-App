import React from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Rightbar from '../components/Rightbar';

const Home = () => {
	return (
		<>
			<Topbar />
			<section>
				<div className=''>
					<div className='flex'>
						<div className='w-1/4 hidden lg:block'>
							<Sidebar />
						</div>
						<div className='w-full lg:w-2/4'>
							<Feed />
						</div>
						<div className='w-1/4 hidden lg:block'>
							<Rightbar />
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Home;
