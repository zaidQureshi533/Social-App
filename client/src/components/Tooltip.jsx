import React, {useState} from 'react';

const Tooltip = ({children, label, size = 'base'}) => {
	const [visible, setVisible] = useState(false);

	return (
		<div className='relative inline-block h-full w-full'>
			<div
				onMouseEnter={() => setVisible(true)}
				onMouseLeave={() => setVisible(false)}
				className='cursor-pointer h-full w-full flex justify-center items-center'
				aria-labelledby='tooltip'
			>
				{children}
			</div>

			{label && (
				<div
					id='tooltip'
					className={`absolute mt-[2px] right-1/2 transform translate-x-1/2 w-max p-${(size =
						'small'
							? 3
							: 2)} text-white bg-gray-800 bg-opacity-70 shadow-md rounded-md transition-all duration-200 origin-center whitespace-nowrap ${
						visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
					}`}
				>
					{label}
				</div>
			)}
		</div>
	);
};

export default Tooltip;
