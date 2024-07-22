import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Add, Remove } from "./Icons";
import axios from "axios";

const Rightbar = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.SERVER_API;
  const currentUser = useSelector((state) => state.user.value);
  const [followed, setFollowed] = useState(false);

  // Get Friends
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (user?._id) {
      axios
        .get(`${API}/users/friends/${user?._id}`)
        .then((res) => {
          setFriends(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      setFollowed(currentUser.followings?.includes(user?._id));
    }
  }, [user?._id]);

  // Handle Follow
  const handleFollow = async () => {
    try {
      if (followed) {
        await axios.put(`${API}/users/${user?._id}/unfollow`, {
          userId: currentUser._id,
        });
      } else {
        await axios.put(`${API}/users/${user?._id}/follow`, {
          userId: currentUser._id,
        });
      }
    } catch (err) {
      console.log(err);
    }
    setFollowed(!followed);
  };

  const InfoBar = () => {
    return (
      <>
        <div className="birthdayContainer flex items-center border-b pb-3 mb-2">
          <img
            className="birthdayImg w-10 h-10 mr-3"
            src={`${PF}gift.jpg`}
            alt=""
          />
          <span className="birthdayText font-light text-sm">
            <b>Farooq Khan</b> and <b> 3 others</b> have birthday today.
          </span>
        </div>
        <img
          className="rightbarAd rounded-md"
          src={`${PF}ad.jpg`}
        />
        <div className="rightbarOnline mt-5">
          <h4 className="rightbarTitle font-bold my-2">Online Friends</h4>
          <ul className="rightbarFriendList font-medium shadow-md">
            {/* {user &&
              user.map((user) => {
                return (
                  <OnlineFriend key={user.id} user={user} isOnline={true} />
                );
              })} */}
          </ul>
        </div>
      </>
    );
  };

  const FriendsBar = () => {
    return (
      <>
        {currentUser.username !== user?.username && (
          <button
            className="followButton text-white px-2 py-1 bg-[#3e62da] rounded flex items-center mt-5 mb-2 cursor-pointer hover:bg-[#3e62da]/90 hover:shadow-md transition-all duration-150 font-medium"
            onClick={handleFollow}
          >
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle mb-[10px] font-bold">User information</h4>
        <div className="rightbarInfo mb-[30px]">
          <div className="rightbarInfoItem mb-[10px]">
            <span className="rightbarInfoKey font-medium mr-[10px] text-[#555]">
              City:
            </span>
            <span className="rightbarInfoValue font-light">
              {user?.city}
            </span>
          </div>
          <div className="rightbarInfoItem mb-[10px]">
            <span className="rightbarInfoKey font-medium mr-[10px] text-[#555]">
              From:
            </span>
            <span className="rightbarInfoValue font-light">
              {user?.from}
            </span>
          </div>
          <div className="rightbarInfoItem mb-[10px]">
            <span className="rightbarInfoKey font-medium mr-[10px] text-[#555]">
              Relationship:
            </span>
            <span className="rightbarInfoValue font-light">
              {user?.relationship}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle text-md font-bold mb-2">User Friends</h4>
        <div className="rightbarFollowings grid gap-x-2 gap-y-4 grid-cols-3">
          {friends.map((friend) => {
            return (
              <Link
                to={`/profile/${friend._id}/${friend.username}`}
                key={friend._id}
              >
                <div className="rightbarFollowing flex flex-col items-center justify-center shadow-[0_0_14px_-8px_rgba(0,0,0,0.4)] border-gray-200 border rounded-md">
                  <img
                    src={PF + "profile/" + friend.profilePicture}
                    alt=""
                    className="rightbarFollowingImg w-24 h-24 object-cover rounded-t-md"
                  />
                  <span className="rightbarFollowingName self-center my-2 px-2 leading-5">
                    {friend.username}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper pt-4 pr-4">
        {user?.username ? <FriendsBar /> : <InfoBar />}
      </div>
    </div>
  );
};

export default Rightbar;
