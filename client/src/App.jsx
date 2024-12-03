import './App.css';
import React, {createContext, useEffect, useState} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Post from './pages/Post';
import Alert from './components/Alert';
import {useDispatch, useSelector} from 'react-redux';
import {login} from './store/states/userSlice';
import {publicRequest} from './configuration/requestMethod';
import ScrollToTop from './components/ScrollToTop';
import Error from './components/Error';
import {registerUser, socket} from './configuration/socket';
import ChatRoom from './components/ChatRoom';

export const ThemeContext = createContext();

const App = () => {
	const [token, setToken] = useState(localStorage.getItem('token'));
	const CurrentUser = useSelector((state) => state.user.value);
	const {isOnline} = CurrentUser;
	const dispatch = useDispatch();
	const isInternetConnected = navigator.onLine;
	if (!isInternetConnected) {
		return <Error />;
	}

	useEffect(() => {
		if (token) {
			publicRequest
				.post('/users/getuser', {}, {headers: {Authorization: token}})
				.then((res) => {
					dispatch(login(res.data));
				})
				.catch((error) => console.log(error));
		}
	}, [token]);

	useEffect(() => {
		const emitLogout = () => {
			socket.emit('userLogout', CurrentUser._id || '');
		};

		if (CurrentUser && CurrentUser._id) {
			registerUser(CurrentUser);
			window.addEventListener('unload', emitLogout);
		}

		return () => {
			window.removeEventListener('unload', emitLogout);
		};
	}, [CurrentUser]);

	return (
		<>
			<Alert />
			<ChatRoom />
			<BrowserRouter>
				<ScrollToTop />
				<Routes>
					<Route
						exact
						path='/'
						element={isOnline ? <Home /> : <Navigate to={'/login'} />}
					></Route>
					<Route
						path='/login'
						element={
							!isOnline ? <Login token={setToken} /> : <Navigate to={'/'} />
						}
					></Route>
					<Route
						path='/register'
						element={isOnline ? <Navigate to='/' /> : <Register />}
					></Route>
					<Route
						path='/profile/:userId/:username'
						element={<Profile />}
					></Route>
					<Route path='/posts/:postId' element={<Post />} />
				</Routes>
			</BrowserRouter>
		</>
	);
};

export default App;
