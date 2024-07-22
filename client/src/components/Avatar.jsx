import React from "react";
const Avatar = (props) => {
  const { src, alt, isOnline } = props;

  return (
    <>
      <div className="relative w-10 h-10 ">
        <img
          className={`w-full h-full rounded-full object-cover cursor-pointer shadow-md`}
          src={src}
          alt={alt}
        />
        <div className="rounded-full absolute inset-0 bg-black opacity-0 transition-opacity duration-100 hover:opacity-20"></div>
        {isOnline && (
          <span className="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
        )}
      </div>
    </>
  );
};

export default Avatar;
