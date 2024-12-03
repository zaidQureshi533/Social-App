import React, {useEffect, useRef, useState} from 'react';
import Tooltip from './Tooltip';
import {IoMdNotifications, MdOutlineDelete, SlOptions} from './icons';
import {useSelector} from 'react-redux';
import {publicRequest} from '../configuration/requestMethod';
import Avatar from './Avatar';
import {Link} from 'react-router-dom';
import {socket} from '../configuration/socket';
import {format} from 'timeago.js';
import Dropdown from './Dropdown';
const Notifications = () => {
	const [show, setShow] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const dropdownRef = useRef(null);
	const CurrentUser = useSelector((state) => state.user.value);

	useEffect(() => {
		CurrentUser._id &&
			publicRequest
				.get(`/notifications/${CurrentUser._id}`)
				.then((res) => {
					setNotifications(res.data);
				})
				.catch((error) => {
					console.error(error);
				});
	}, []);

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setShow(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		socket.on('newNotification', (newNotification) => {
			if (newNotification) {
				setNotifications((prev) => [...prev, newNotification]);
			}
		});
	}, []);

	const handleReadNotification = (id) => {
		publicRequest.put(`/notifications/${id}`).then((res) => {
			console.log(res.data);
		});
	};

	const handleDelete = async (id) => {
		publicRequest
			.delete(`/notifications/${id}`)
			.then(() => {
				const newNotifications = notifications.filter((n) => n._id !== id);
				setNotifications(newNotifications);
			})
			.catch((error) => {
				console.log(error);
			});
	};
	return (
		<div className='relative' ref={dropdownRef}>
			<button
				onClick={() => setShow(!show)}
				type='button'
				className='hidden lg:block'
				id='menu-button'
				aria-expanded={show}
				aria-haspopup='true'
			>
				<Tooltip label={!show && 'Messages'}>
					<div className='topbarIconItem text-lg relative cursor-pointer w-10 h-10 bg-gray-200 hover:bg-gray-300 flex justify-center items-center rounded-full'>
						<IoMdNotifications size={22} />
					</div>
				</Tooltip>
			</button>
			<div
				className={`absolute right-2 top-11 z-10 w-80 min-h-[70vh] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-[0_0_15px_0_rgba(0,0,0,0.2)] text-gray-700 transition-transform duration-200 ease-in-out ${
					show ? 'scale-1' : 'scale-0'
				} overflow-auto`}
				style={{bottom: '-106px'}}
				role='menu'
				aria-orientation='vertical'
				aria-labelledby='menu-button'
				tabIndex='-1'
			>
				<div className='p-3' role='none'>
					<div className='notifications-header my-2 '>
						<h4 className='font-bold'>Notifications</h4>
					</div>
					<hr />
					<div className='notifications-container mt-1'>
						<div className='notifications'>
							{notifications.map((notification) => {
								const {_id, message, action_url, createdAt} = notification;
								const {username, profilePicture} = notification.source;
								const time = format(createdAt).split(' ');
								const notificationTime =
									format(createdAt) === 'just now'
										? 'just now'
										: time[0] + time[1].at(0);
								return (
									<div
										onClick={() => {
											handleReadNotification(_id);
										}}
										key={_id}
										className={`p-2 rounded-lg ${
											notification.status === 'unread' && 'bg-gray-200'
										} bg-gray-100 hover:bg-gray-200 mb-1 flex justify-between gap-3`}
									>
										<Link
											to={action_url}
											className='inline-flex items-start gap-2'
										>
											<Avatar img={profilePicture} />
											<div>
												<span className=''>
													<b className='font-bold'>{username}</b>
													{" "}{message}
												</span>
												<span className='mt-2 block'>{notificationTime}</span>
											</div>
										</Link>
										<Dropdown label={<SlOptions size={14} />}>
											<button onClick={() => handleDelete(_id)}>
												<MdOutlineDelete size={18} /> Delete
											</button>
										</Dropdown>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Notifications;
