import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {publicRequest} from '../configuration/requestMethod';
import {MdVisibility, MdVisibilityOff} from '../components/icons';
import {errorAlert} from '../store/states/alertSlice';

const Login = ({token}) => {
	const [showPassword, setShowPassword] = useState(false);
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
					token(res.data.token);
				}
			})
			.catch((error) => {
				dispatch(errorAlert(error.response.data.message));
			});
	};

	return (
		<>
			<div className='login min-w-full md:h-dvh bg-[#f0f2f5] flex items-center justify-center'>
				<div className='loginWrapper w-full md:w-[70%] p-12 md:p-0 flex flex-col md:flex-row'>
					<div className='loginLeft flex-1 flex flex-col justify-center mb-10 md:m-0 select-none'>
						<h1 className='loginLogo font-extrabold text-blue mb-2'>
							Zaid Social
						</h1>
						<h4 className='loginDescription'>
							Zaid Social helps you connect and share with the people in your
							life.
						</h4>
					</div>
					<div className='loginRight flex-1 flex flex-col items-center'>
						<form
							onSubmit={handleSubmit(submitLoginData)}
							className='loginBox w-full md:w-4/5 flex flex-col gap-4 p-5 bg-white rounded-[10px] shadow-xl'
						>
							<input
								{...register('email', {
									required: 'Email is required',
									pattern: {
										value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
										message: 'Invalid email address',
									},
								})}
								placeholder={errors.email ? errors.email.message : 'Email'}
								name='email'
								className={`loginInput p-3 border rounded-md focus:outline-[#3e62da] ${
									errors.email && 'placeholder-red-600'
								} focus:outline-gray-400`}
								autoComplete='true'
							/>
							<div className='relative'>
								<input
									{...register('password', {
										required: 'Password is required',
									})}
									placeholder={
										errors.password ? errors.password.message : 'Password'
									}
									name='password'
									type={`${showPassword ? 'text' : 'password'}`}
									className={`loginInput w-full p-3 border rounded-md focus:outline-[#3e62da] ${
										errors.password && 'placeholder-red-600'
									} focus:outline-gray-400`}
									autoComplete='false'
								/>
								<button
									type='button'
									className='absolute right-3 top-4 text-gray-600 focus:outline-none'
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<MdVisibility size={20} />
									) : (
										<MdVisibilityOff size={20} />
									)}
								</button>
							</div>
							<button
								type='submit'
								className='loginButton h5 bg-blue text-white py-3 font-bold rounded-md hover:bg-[#3e62da]/90 hover:shadow-md transition-all duration-150 outline-none'
							>
								Log In
							</button>
							<span className='forgotPassword text-blue-700 cursor-pointer hover:underline text-center text-sm outline-none'>
								Forget Password?
							</span>
							<hr />
							<Link
								to={'/register'}
								className='loginButton text-center h5 bg-[#4bbe2e] text-white py-3 font-bold rounded-md hover:bg-[#4bbe2e]/90 hover:shadow-md transition-all duration-150 outline-none'
							>
								Create new account
							</Link>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
