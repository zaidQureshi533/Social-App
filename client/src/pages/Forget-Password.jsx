import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {publicRequest} from '../configuration/requestMethod';

const ForgetPassword = () => {
	const [email, setEmail] = useState('');
	const handleChange = (e) => {
		setEmail(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await publicRequest.post('/auth/reset-password', {email});
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className='flex justify-center items-center bg-blue-50 h-dvh'>
			<div className='form-container rounded-md shadow-lg border p-5 bg-white w-1/4 '>
				<h3 className='text-lg font-bold mb-8'>Reset Your Password</h3>
				<p className='text-xs mb-2'>
					Enter your email and we will send you a link to reset your password
				</p>
				<form
					onSubmit={handleSubmit}
					className='flex flex-col justify-center gap-3 text-sm'
				>
					<input
						onChange={handleChange}
						value={email}
						type='email'
						className='border p-2 rounded-sm  focus:outline-gray-400'
						placeholder='Email'
					/>

					<button
						className=' bg-[#3e62da] rounded-sm px-3 py-2 text-white hover:bg-blue-500 transition-colors duration-150 cursor-pointer'
						type='submit'
					>
						Get Link
					</button>
					<span className='text-xs'>
						Remember your password?{' '}
						<Link to={'/'} className='hover:underline font-bold text-blue-700'>
							Login
						</Link>
					</span>
				</form>
			</div>
		</div>
	);
};

export default ForgetPassword;
