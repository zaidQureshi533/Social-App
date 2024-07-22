import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import axios from "axios";

const Register = ({ setAlert }) => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate();
  const API = process.env.SERVER_API;
  const [isFetching, setIsFetching] = useState(false);

  const submitUserData = (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        throw "Password doesn't match, Please ensure the password you entered should match";
      } else {
        setIsFetching(true);
        const { username, email, password } = data;
        axios
          .post(`${API}/auth/register`, { username, email, password })
          .then((res) => {
            if (res.data.success) {
              navigate("/login");
              setIsFetching(false);
            }
          })
          .catch((error) => {
            setIsFetching(false);
            setAlert("danger", error.response.data.message);
          });
      }
    } catch (error) {
      setAlert("danger", error);
    }
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
              onSubmit={handleSubmit(submitUserData)}
              className='loginBox flex flex-col gap-4 p-5 bg-white rounded-[10px]'>
              <input
                {...register('username', { required: "Username is required" })}
                autoComplete='true'
                placeholder={errors.username ? errors.username.message : "Enter Username"}
                name='username'
                className={`loginInput px-2 py-4 border rounded-md text-sm focus:outline-[#474747] ${errors.username && "placeholder-red-600"}`}
              />
              <input
                {...register('email', { required: "Email is required" })}
                autoComplete='true'
                placeholder={errors.email ? errors.email.message : "Email"}
                type='email'
                name='email'
                className={`loginInput px-2 py-4 border rounded-md text-sm focus:outline-[#474747] ${errors.email && "placeholder-red-600"}`}
              />
              <input
                {...register('password', { required: "Please Enter Password" })}
                autoComplete='true'
                placeholder={errors.password ? errors.password.message : "Password"}
                type='password'
                name='password'
                className={`loginInput px-2 py-4 border rounded-md text-sm focus:outline-[#474747] ${errors.password && "placeholder-red-600"}`}
              />
              <input
                {...register('confirmPassword', { required: "Please Enter Confirm Password" })}
                autoComplete='true'
                placeholder={errors.confirmPassword ? errors.confirmPassword.message : "Confirm Password"}
                type='password'
                name='confirmPassword'
                className={`loginInput px-2 py-4 border rounded-md text-sm focus:outline-[#474747] ${errors.confirmPassword && "placeholder-red-600"}`}
              />
              <button
                disabled={isFetching}
                type='submit'
                className='signupButton bg-[#3e62da] text-white py-3 font-bold text-xl rounded-md hover:bg-[#3e62da]/90 hover:shadow-md transition-all duration-150'>
                {isFetching ? "Creating Account..." : "Sign Up"}
              </button>
              <span className='logIn text-center flex flex-col md:flex-row gap-2 justify-center'>
                Already have an account?
                <Link
                  to='/login'
                  className='cursor-pointer hover:underline font-bold text-gray-700'>
                  Login
                </Link>
              </span>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;
