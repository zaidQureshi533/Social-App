import React from 'react';
const Avatar = (props) => {
	const {img, alt, isOnline = false, overlay, size = '40px'} = props;
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	return (
		<>
			<div
				className='relative cursor-pointer'
				style={{width: size, height: size}}
			>
				<img
					className={`w-full h-full rounded-full object-cover cursor-pointer shadow-md`}
					src={`${PF}profile/${img}`}
					alt={alt}
				/>
				{overlay && (
					<div className='rounded-full absolute inset-0 bg-black opacity-0 transition-opacity duration-100 hover:opacity-20'></div>
				)}
				{isOnline && (
					<span className='top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full'></span>
				)}
			</div>
		</>
	);
};

export default Avatar;
