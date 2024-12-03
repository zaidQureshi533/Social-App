import React from 'react';

const Error = ({message}) => {
	return (
		<div className='h-screen flex justify-center items-center p-5 bg-gray-100'>
			<div className='w-2/4 bg-white shadow-md rounded-md p-5'>
				<h4 className='font-bold'>
					Looks like you're not connected to the internet!
				</h4>
				<h5 className='my-4'>Let's get you back online!</h5>
				<button
                className='h5 bg-blue text-white p-3 font-bold rounded-md hover:bg-[#3e62da]/90 hover:shadow-md transition-all duration-150 outline-none'
					onClick={() => {
						window.location.reload();
					}}
				>
					Troubleshoot
				</button>
			</div>
		</div>
	);
};

export default Error;
