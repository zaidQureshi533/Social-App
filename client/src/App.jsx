import React, {useEffect, useState} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Alert from './components/Alert';
import {useDispatch, useSelector} from 'react-redux';
import {updateUser} from './store/states/userSlice';

const App = () => {
	const CurrentUser = useSelector((state) => state.user.value);
	const {isOnline} = CurrentUser;
	const dispatch = useDispatch();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			dispatch(updateUser({isOnline: true}));
		}
	}, []);

	const [alert, setAlert] = useState({type: '', message: ''});

	const showAlert = (type, message) => {
		setAlert({
			type: type,
			message: message,
		});
		setTimeout(() => {
			setAlert({type: '', message: ''});
		}, 2000);
	};

	return (
		<>
			{alert.message && <Alert alert={alert} />}
			<BrowserRouter>
				<Routes>
					<Route
						exact
						path='/'
						element={isOnline ? <Home /> : <Navigate to={'/login'} />}
					></Route>
					<Route
						path='/login'
						element={
							!isOnline ? <Login setAlert={showAlert} /> : <Navigate to={'/'} />
						}
					></Route>
					<Route
						path='/register'
						element={
							isOnline ? <Navigate to='/' /> : <Register setAlert={showAlert} />
						}
					></Route>
					<Route
						path='/profile/:userId/:username'
						element={<Profile />}
					></Route>
				</Routes>
			</BrowserRouter>
		</>
	);
};

export default App;