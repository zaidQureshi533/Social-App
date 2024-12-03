import React, {useEffect} from 'react';
import {RiErrorWarningLine, BsInfoCircle} from './icons';
import {useDispatch, useSelector} from 'react-redux';
import {hideAlert} from '../store/states/alertSlice';
export default function Alert() {
	const alert = useSelector((state) => state.alert);
	const dispatch = useDispatch();
	useEffect(() => {
		if (alert) {
			setTimeout(() => {
				dispatch(hideAlert());
			}, 3000);
		}
	}, [alert]);
	return (
		alert && (
			<div
				className={`z-40 absolute left-1/2 transform -translate-x-1/2 mx-auto w-[95%] md:w-[50%] rounded-md shadow-sm flex items-center gap-4 font-bold px-4 py-3 text-white transition-all duration-150 ${
					alert.type === 'danger' ? 'bg-red-500' : 'bg-blue-500'
				} ${alert.message ? 'translate-y-3' : '-translate-y-20'}`}
				role='alert'
			>
				{alert.type === 'danger' ? (
					<RiErrorWarningLine size={24} />
				) : (
					<BsInfoCircle size={24} />
				)}
				<p>{alert.message}</p>
			</div>
		)
	);
}
