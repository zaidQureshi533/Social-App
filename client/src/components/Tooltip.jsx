// Tooltip.js
import React, {useState} from 'react';

const Tooltip = ({children, label}) => {
	const [visible, setVisible] = useState(false);

	return (
		<div className='relative inline-block'>
			<div
				onMouseEnter={() => setVisible(true)}
				onMouseLeave={() => setVisible(false)}
				className='cursor-pointer'
			>
				{children}
			</div>

			<div
				className={`absolute -bottom-12 left-1 mb-2 w-max py-2 px-3 text-white bg-gray-800 bg-opacity-80 shadow-md rounded-md transition-all duration-200 origin-top-left ${
					visible ? 'scale-100' : 'scale-0'
				}`}
			>
				{label}
			</div>
		</div>
	);
};

export default Tooltip;
