import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    DOB: {
      type: Date,
    },
    profilePicture: {
      type: String,
      default: "noAvatar.jpg",
    },
    coverPicture: {
      type: String,
      default: "noCover.jpg",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      default: "",
      max: 50,
    },
    city: {
      type: String,
      default: "",
      max: 50,
    },
    from: {
      type: String,
      default: "",
      max: 50,
    },
    relationship: {
      type: String,
      default: "",
      max: 50,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

export default User;


