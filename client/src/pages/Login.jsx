import React from 'react';
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {updateUser} from '../store/states/userSlice';
import {publicRequest} from '../configuration/requestMethod';
const Login = ({setAlert}) => {
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm({defaultValues: {email: '', password: ''}});

	const submitLoginData = (data) => {
		publicRequest
			.post(`/auth/login`, data)
			.then((res) => {
				if (res.data.success) {
					localStorage.setItem('token', res.data.token);
					dispatch(updateUser({isOnline: res.data}));
				}
			})
			.catch((error) => {
				setAlert('danger', error.response.data.message);
			});
	};

	return (
		<>
			<div className='login w-full md:h-dvh bg-[#f0f2f5] flex items-center justify-center'>
				<div className='loginWrapper w-full md:w-[70%] p-12 md:p-0 flex flex-col md:flex-row'>
					<div className='loginLeft flex-1 flex flex-col justify-center mb-10 md:m-0'>
						<h3 className='loginLogo text-[50px] font-extrabold text-[#3e62da] mb-2'>
							facebook
						</h3>
						<span className='loginDescription text-xl font-medium pe-10'>
							Connect with friends and the world around you on facebook.
						</span>
					</div>
					<div className='loginRight flex-1 flex flex-col justify-center'>
						<form
							onSubmit={handleSubmit(submitLoginData)}
							className='loginBox flex flex-col gap-4 p-5 bg-white rounded-[10px]'
						>
							<input
								{...register('email', {required: 'Please enter your email'})}
								placeholder={errors.email ? errors.email.message : 'Email'}
								name='email'
								className={`loginInput px-2 py-4 border rounded-md text-sm focus:outline-[#474747] ${
									errors.email && 'placeholder-red-600'
								}`}
								autoComplete='true'
							/>
							<input
								{...register('password', {
									required: 'Please enter your password',
								})}
								placeholder={
									errors.password ? errors.password.message : 'password'
								}
								name='password'
								type='password'
								className={`loginInput px-2 py-4 border rounded-md text-sm focus:outline-[#474747] ${
									errors.password && 'placeholder-red-600'
								}`}
								autoComplete='false'
							/>
							<button
								type='submit'
								className='loginButton bg-[#3e62da] text-white py-3 font-bold text-xl rounded-md hover:bg-[#3e62da]/90 hover:shadow-md transition-all duration-150'
							>
								Log In
							</button>
							<Link
								to={'/forget-password'}
								className='forgotPassword text-blue-700 cursor-pointer hover:underline  text-center'
							>
								Forgot Password?
							</Link>
							<span className='createNewAccount  text-center'>
								Don't have an account?{' '}
								<Link
									to='/register'
									className='cursor-pointer hover:underline font-bold text-gray-700'
								>
									Create Account
								</Link>
							</span>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
