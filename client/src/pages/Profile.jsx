import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Rightbar from "../components/Rightbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Camera } from "../components/Icons";
import { useSelector } from "react-redux";

const Profile = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.SERVER_API;

  const [user, setUser] = useState({});
  const { userId } = useParams();
  const [file, setFile] = useState(null);
  const CurrentUser = useSelector((state) => state.user.value);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${API}/users/${userId}`);
      setUser(res.data);
    };
    fetchData();
  }, [userId]);

  // update profile picture

  const handleProfileUpdate = async () => {
    const fileName =
      Date.now() + CurrentUser._id + "." + file.name.split(".").slice(-1);
    if (file) {
      const data = new FormData();
      data.append("name", fileName);
      data.append("file", file);
      try {
        await axios.post(`${API}/upload/profile`, data);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      await axios.post(`${API}/users/update/profile`, {
        id: CurrentUser._id,
        file: fileName,
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Topbar />
      {/* Confirmation modal for updating profile */}
      {file && (
        <>
          <div className='fixed top-0 h-dvh w-full flex justify-center items-center z-20 animate-zoomIn'>
            <div className='bg-black bg-opacity-50 fixed top-0 h-full w-full flex justify-center items-center'>
              <div className='modal w-[30%] rounded-sm shadow-md bg-white p-4 flex flex-col gap-8 '>
                <div className='modal-top'>
                  <span className='text-md text-center text-gray-600 font-medium'>
                    Are you Sure you want to update your profile picture!
                  </span>
                </div>
                <div className='modal-bottom flex justify-between'>
                  <button
                    onClick={handleProfileUpdate}
                    className='py-1 px-2 bg-sky-600 hover:bg-sky-700 hover:shadow-md transition-all duration-100 text-white rounded-sm'>
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setFile(null);
                    }}
                    className='py-1 px-2 border hover:bg-gray-200 hover:shadow-md transition-all duration-100 rounded-sm'>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className='profile flex'>
        <div className='profileLeftbar w-1/4'>
          <Sidebar />
        </div>
        <div className='profileRightbar w-3/4'>
          <div className='profileRightbarTop'>
            <img
              src={`${user.coverPicture ? PF + user.coverPicture : PF + "noCover.jpg"
                }`}
              alt=''
              className='profileCoverImg w-full object-cover rounded-b-lg h-80'
            />
            <div className='relative -top-8 flex justify-center'>
              <div className='flex flex-col items-center gap-2'>
                <div className='relative'>
                  <img
                    src={`${PF + "profile/" + user.profilePicture}`}
                    alt=''
                    className='userProfileImg rounded-full w-36 h-36 object-cover border-4 shadow-md border-white'
                  />
                  {/* input for update profile Picture */}
                  {CurrentUser._id === userId && (
                    <form className='absolute bottom-0 right-0'>
                      <label htmlFor='updateProfile'>
                        <Camera />
                      </label>
                      <input
                        className='hidden'
                        type='file'
                        name='file'
                        id='updateProfile'
                        accept='.jpg,.png,.jpeg,.webp'
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </form>
                  )}
                </div>
                <div className='profileInfo pt-2 flex flex-col items-center'>
                  <h1 className='profileName font-bold text-2xl text-gray-700'>
                    {user.username}
                  </h1>
                  <span className='profileDesc cursor-pointer hover:underline font-light'>
                    {user.desc}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='profileRightbarBottom flex'>
            <div className='w-2/3'>
              <Feed />
            </div>
            <div className='w-1/3'>
              <Rightbar user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
