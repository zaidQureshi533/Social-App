import React from 'react';
import {RiErrorWarningLine, BsInfoCircle} from './icons';
export default function Alert({alert}) {
	return (
		<div
			className={`z-40 absolute left-1/2 transform -translate-x-1/2 mx-auto w-[95%] md:w-[50%] rounded-md shadow-sm flex items-center gap-4 font-bold px-4 py-3 text-white transition-all duration-150 ${
				alert.type === 'danger' ? 'bg-red-500' : 'bg-blue-500'
			} ${alert.message ? 'translate-y-3' : '-translate-y-20'}`}
			role='alert'
		>
			{alert.type === 'danger' ? <RiErrorWarningLine size={24} /> : <BsInfoCircle  size={24} />}
			<p>{alert.message}</p>
		</div>
	);
}
