import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {publicRequest} from '../configuration/requestMethod';
import OnlineFriend from './OnlineFriend';
import {socket} from '../configuration/socket';
import {
	BsFillPersonDashFill,
	BsFillPersonCheckFill,
	MdHome,
	HiMiniUsers,
	FaFacebookMessenger,
} from './icons';
import Chat from './Chat';
const Rightbar = ({user}) => {
	const currentUser = useSelector((state) => state.user.value);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const [friends, setFriends] = useState([]);
	useEffect(() => {
		publicRequest
			.get(`/users/friends/${!user ? currentUser._id : user._id}`)
			.then((res) => {
				setFriends(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [user?._id, currentUser._id]);

	const InfoBar = () => {
		const [onlineFriends, setOnlineFriends] = useState([]);
		const [birthdayFriends, setBirthdayFriends] = useState([]);

		// online friends
		useEffect(() => {
			const OnlineFriends = friends.filter((friend) => friend.isOnline);
			setOnlineFriends(OnlineFriends);
		}, [friends]);

		// birthday friends
		useEffect(() => {
			friends.map((friend) => {
				const dob = friend.DOB;
				const dobDate = new Date(dob);
				const friendDob = {month: dobDate.getMonth(), date: dobDate.getDate()};
				const date = new Date();
				const currentMonth = date.getMonth();
				const currentDate = date.getDate();
				if (
					currentMonth === friendDob.month &&
					currentDate === friendDob.date
				) {
					setBirthdayFriends((prev) => [...prev, friend.username]);
				}
			});
		}, [friends]);
		useEffect(() => {
			socket.on('userOnline', (newUser) => {
				if (newUser) {
					const isAlreadyOnline = onlineFriends.filter(
						(friend) => friend._id === newUser._id
					);
					if (isAlreadyOnline.length < 1) {
						setOnlineFriends((prev) => [...prev, newUser]);
					}
				}
			});
			socket.on('userLogout', (userId) => {
				if (userId) {
					const newOnlineFriends = onlineFriends.filter(
						(friend) => friend._id !== userId
					);
					setOnlineFriends(newOnlineFriends);
				}
			});
		}, []);
		return (
			<div className='bg-white p-4 mr-4 rounded-md shadow-[0_0_10px_-5px_rgba(0,0,0,0.6)]'>
				{birthdayFriends.length > 0 && (
					<div className='birthdayContainer flex items-center border-b pb-3 mb-2'>
						<img
							className='birthdayImg w-10 h-10 mr-3'
							src={`${PF}gift.jpg`}
							alt=''
						/>
						<span className='birthdayText text-sm'>
							<>
								<b className='font-bold'>
									{birthdayFriends.length < 2
										? birthdayFriends[0]
										: birthdayFriends.slice(0, 1).join(' and ')}
								</b>
								<p>
									{birthdayFriends.length > 2 &&
										`and ${birthdayFriends.length - 2} other `}
									have birthday today.
								</p>
							</>
						</span>
					</div>
				)}
				<img className='rightbarAd rounded-md' src={`${PF}ad.jpg`} />
				<div className='rightbarOnline mt-5'>
					<h5 className='rightbarTitle font-bold my-2'>Online Friends</h5>
					<div className='rightbarFriendList font-medium shadow-md'>
						{onlineFriends &&
							onlineFriends.map((friend) => {
								return <OnlineFriend key={friend._id} friend={friend} />;
							})}
					</div>
				</div>
			</div>
		);
	};

	const FriendsBar = () => {
		const [followed, setFollowed] = useState(
			user?.followers?.includes(currentUser._id)
		);
		const [followers, setFollowers] = useState(user?.followers?.length);
		const handleFollow = () => {
			const userId = currentUser?._id;
			const friendId = user?._id;
			if (followed) {
				socket.emit('unfollow', userId, friendId);
				setFollowers(followers - 1);
			} else {
				socket.emit('follow', userId, friendId);
				setFollowers(followers + 1);
			}
			setFollowed(!followed);
		};

		return (
			<div className='px-4 md:px-2'>
				{currentUser._id !== user._id && (
					<div className='rightBar-top inline-flex gap-3 items-center'>
						<>
							<button
								className='followButton mb-3 w-fit text-white p-2 bg-[#3e62da] rounded inline-flex items-center gap-2 cursor-pointer hover:bg-[#3e62da]/90 transition-all duration-150 font-medium text-base'
								onClick={handleFollow}
							>
								{followed ? (
									<>
										<BsFillPersonDashFill size={20} /> Unfollow
									</>
								) : (
									<>
										<BsFillPersonCheckFill size={20} /> Follow
									</>
								)}
							</button>
							<Chat user={user}>
								<span className='followButton mb-3 w-fit text-white p-2 bg-[#3e62da] rounded inline-flex items-center gap-2 cursor-pointer hover:bg-[#3e62da]/90 transition-all duration-150 font-medium text-base'>
									<FaFacebookMessenger size={20} /> Message
								</span>
							</Chat>
						</>
					</div>
				)}
				<div className='user-details rounded-md p-4 shadow-[0_0_10px_-5px_rgba(0,0,0,0.6)] bg-white mb-3'>
					<h5 className='rightbarTitle mb-[10px] font-bold'>Details</h5>

					<div className='rightbarInfo mt-3 leading-7 flex flex-col mb-3'>
						{user.city && user.from && (
							<div className='inline-flex gap-2 items-center'>
								<MdHome size={22} />
								<span>
									Lives in{' '}
									<b>
										{user.city}, {user.from}
									</b>
								</span>
							</div>
						)}
						{followers > 0 && (
							<div className='inline-flex gap-2 items-center '>
								<HiMiniUsers size={22} />
								<span>Followed By {followers}</span>
							</div>
						)}
					</div>
				</div>
				<div className='bg-white rounded-md shadow-[0_0_10px_-5px_rgba(0,0,0,0.6)] p-4 border'>
					<h5 className='rightbarTitle text-md font-bold mb-2'>Friends</h5>
					<div className='friends grid gap-3 grid-cols-5 lg:grid-cols-2'>
						{friends.map((friend) => {
							return (
								<Link
									to={`/profile/${friend._id}/${friend.username}`}
									key={friend._id}
									className='rightbarFollowing flex flex-col justify-start'
								>
									<img
										src={PF + 'profile/' + friend.profilePicture}
										alt=''
										className='rightbarFollowingImg aspect-square w-full object-cover rounded-md'
									/>
									<span className='rightbarFollowingName p-1 font-semibold leading-none break-words'>
										{friend.username}
									</span>
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		);
	};
	return (
		<div className='rightbar'>
			<div className='rightbarWrapper py-4'>
				{user ? <FriendsBar /> : <InfoBar />}
			</div>
		</div>
	);
};

export default Rightbar;
