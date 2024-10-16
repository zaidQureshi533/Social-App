import './App.css';
import React, {createContext, useEffect, useState} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Alert from './components/Alert';
import {useDispatch, useSelector} from 'react-redux';
import {login} from './store/states/userSlice';
import {publicRequest} from './configuration/requestMethod';
import Post from './pages/Post';

export const ThemeContext = createContext();
const App = () => {
	const CurrentUser = useSelector((state) => state.user.value);
	const {isOnline} = CurrentUser;
	const dispatch = useDispatch();
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			publicRequest
				.post('/users/getuser', {}, {headers: {Authorization: token}})
				.then((res) => dispatch(login(res.data)))
				.catch((error) => console.log(error));
		}
	}, [isOnline]);

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
			<Alert alert={alert} />
			<ThemeContext.Provider value={{showAlert}}>
				<BrowserRouter>
					<Routes>
						<Route
							exact
							path='/'
							element={isOnline ? <Home /> : <Navigate to={'/login'} />}
						></Route>
						<Route
							path='/login'
							element={!isOnline ? <Login /> : <Navigate to={'/'} />}
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
			</ThemeContext.Provider>
		</>
	);
};

export default App;
