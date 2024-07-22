import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { format } from "timeago.js";
import Avatar from "./Avatar";
import { Heart, Like, MoreVert } from "./Icons";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const CurrentUser = useSelector((state) => state.user.value);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.SERVER_API;

  const { _id, desc, photo, userId, likes, comments, createdAt } = post;
  const [likeCount, setLikeCount] = useState(likes.length);
  const [user, setUser] = useState({});
  const [isLiked, setIsLiked] = useState(likes.includes(CurrentUser._id));
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${API}/users/${userId}`);
      setUser(res.data);
    };
    fetchData();
  }, [userId]);

  const likeHandler = async () => {
    try {
      axios({
        method: "put",
        url: `${API}/posts/${_id}/like`,
        data: { userId: CurrentUser._id },
      });
    } catch (err) {
      console.log(err);
    }
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    setIsLiked(!isLiked);
  };

  return (
    <>
      <div className='post mt-5 p-3 rounded-lg shadow-[0_0_14px_-8px_rgba(0,0,0,0.4)]'>
        <div className='postWrapper'>
          <div className='postTop flex justify-between'>
            <div className='postTopLeft flex items-center gap-4'>
              <Link to={`/profile/${user._id}/${user.username}`}>
                <Avatar
                  src={`${PF + "profile/" + user.profilePicture}`}
                  isOnline={user.isOnline}
                />
              </Link>
              <div className='flex flex-col'>
                <Link to={`/profile/${user._id}/${user.username}`}>
                  <span className='postUsername text-gray-800 font-semibold hover:underline cursor-pointer'>
                    {user.username}
                  </span>
                </Link>
                <span className='postDate text-sm text-gray-600'>
                  {format(createdAt)}
                </span>
              </div>
            </div>
            <div className='postTopRight'>
              <MoreVert />
            </div>
          </div>

          <div className='postCenter py-2'>
            <p className='postText py-2'>{desc ? desc : ""}</p>
            {photo && (
              <img
                src={`${PF}posts/${photo}`}
                alt=''
                className='postImg w-full aspect-5/3 object-cover rounded-sm'
              />
            )}
          </div>
          <div className='postBottom text-sm text-gray-600 flex justify-between items-center'>
            <div className='postBottomLeft flex items-center'>
              <Like onClick={likeHandler} />
              <Heart onClick={likeHandler} />
              <span className='postLikeCounter ms-2 select-none'>
                {likeCount} People like this
              </span>
            </div>
            <div className='postBottomRight'>
              <span className='postComment select-none cursor-pointer'>
                {comments} comments
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
