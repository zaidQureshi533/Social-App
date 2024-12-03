import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {publicRequest} from '../configuration/requestMethod';
import {MdVisibility, MdVisibilityOff} from '../components/icons';
import {useDispatch} from 'react-redux';
import {showAlert} from '../store/states/alertSlice';
const Register = () => {
	const dispatch = useDispatch();
	const [showPassword, setShowPassword] = useState(false);
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		setError,
		clearErrors,
		formState: {errors},
	} = useForm();

	const navigate = useNavigate();
	const [isFetching, setIsFetching] = useState(false);
	const password = watch('password');

	const submitUserData = (data) => {
		if (data.password !== data.confirmPassword) {
			setError('confirmPassword', {
				type: 'manual',
				message: 'Password do not match',
			});
			setValue('confirmPassword', '');
			return;
		}

		setIsFetching(true);
		const {fname, lname, email, password} = data;
		publicRequest
			.post('/auth/register', {username: `${fname} ${lname}`, email, password})
			.then((res) => {
				if (res.data.success) {
					navigate('/login');
					setIsFetching(false);
				}
			})
			.catch((error) => {
				setIsFetching(false);
				dispatch(
					showAlert({type: 'danger', message: error.response.data.message})
				);
			});
	};

	const clearInput = (e) => {
		clearErrors(e.target.name);
	};

	return (
		<div className='register w-full md:h-dvh bg-[#f0f2f5] flex items-center justify-center'>
			<div className='registerWrapper w-full md:w-[70%] p-12 md:p-0 flex flex-col md:flex-row md:gap-10'>
				<div className='registerLeft flex-1 flex flex-col justify-center mb-10 md:m-0'>
					<div className='loginLogo text-[30px] md:text-[60px] font-extrabold text-blue mb-2'>
						facebook
					</div>
					<h4 className='loginDescription'>
						Facebook helps you connect and share with the people in your life.
					</h4>
				</div>
				<div className='registerRight flex-1 flex flex-col'>
					<form
						onSubmit={handleSubmit(submitUserData)}
						className='registerBox flex flex-col gap-4 p-5 bg-white rounded-[10px]'
					>
						<input
							{...register('fname', {required: 'First Name is required'})}
							autoComplete='true'
							placeholder={errors.fname ? errors.fname.message : 'First Name'}
							name='fname'
							className={`registerInput px-2 py-3 border rounded-md text-sm focus:outline-[#474747] ${
								errors.fname && 'placeholder-red-600'
							} focus:outline-gray-400`}
							onChange={clearInput}
						/>
						<input
							{...register('lname', {required: 'Last Name is required'})}
							autoComplete='true'
							placeholder={errors.lname ? errors.lname.message : 'Last Name'}
							name='lname'
							className={`registerInput px-2 py-3 border rounded-md text-sm focus:outline-[#474747] ${
								errors.lname && 'placeholder-red-600'
							} focus:outline-gray-400`}
							onChange={clearInput}
						/>
						<input
							{...register('email', {required: 'Email is required'})}
							autoComplete='true'
							placeholder={errors.email ? errors.email.message : 'Email'}
							type='email'
							name='email'
							className={`registerInput px-2 py-3 border rounded-md text-sm focus:outline-[#474747] ${
								errors.email && 'placeholder-red-600'
							} focus:outline-gray-400`}
							onChange={clearInput}
						/>
						<div className='relative'>
							<input
								{...register('password', {required: 'Password is required'})}
								autoComplete='true'
								placeholder={
									errors.password ? errors.password.message : 'Password'
								}
								type={showPassword ? 'text' : 'password'}
								name='password'
								className={`registerInput w-full p-3 border rounded-md focus:outline-[#3e62da] ${
									errors.password && 'placeholder-red-600'
								} focus:outline-gray-400`}
								onChange={clearInput}
							/>
							<button
								tabIndex={-1}
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
						<div className='relative'>
							<input
								{...register('confirmPassword', {
									required: 'Confirm Password is required',
								})}
								autoComplete='true'
								placeholder={
									errors.confirmPassword
										? errors.confirmPassword.message
										: 'Confirm Password'
								}
								type={showPassword ? 'text' : 'password'}
								name='confirmPassword'
								className={`registerInput w-full p-3 border rounded-md focus:outline-[#3e62da] ${
									errors.confirmPassword && 'placeholder-red-600'
								} focus:outline-gray-400`}
								onChange={clearInput}
							/>
							<button
								tabIndex={-1}
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
							disabled={isFetching}
							type='submit'
							className='signupButton bg-[#3e62da] h5 text-white py-3 font-bold rounded-md hover:bg-[#3e62da]/90 hover:shadow-md transition-all duration-150 outline-none'
						>
							{isFetching ? 'Creating Account...' : 'Sign Up'}
						</button>
						<span className='register text-center text-sm flex flex-col md:flex-row gap-2 justify-center select-none outline-none'>
							Already have an account?
						</span>
						<hr />
						<Link
							to='/login'
							className='registerButton text-center h5 bg-[#4bbe2e] text-white py-3 font-bold rounded-md hover:bg-[#4bbe2e]/90 hover:shadow-md transition-all duration-150 outline-none'
						>
							Sign In
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
