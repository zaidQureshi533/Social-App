import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import { fileURLToPath } from "url"; // To convert URL to file path
import { dirname } from "path"; // To get directory name
import authRoute from "./routes/auth.js";
import userRoute from "./routes/users.js";
import postRoute from "./routes/posts.js";

const app = express();
const port = 8800;
dotenv.config();

// Connect to database
const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Failed to connect to MongoDB:", err);
  }
};
connectToDb();

// Resolve directory path using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure public folder
app.use("/images", express.static(`${__dirname}/../uploads/images`));

// Middlewares
app.use(express.json());
app.use(cors());

// Create Storage For Posts Images
const PostStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../uploads/images/posts`);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const PostUpload = multer({ storage: PostStorage });
app.post("/api/upload/post", PostUpload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.error(error);
  }
});

// Create Storage For Profile Images
const ProfileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../uploads/images/profile`);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const ProfileUpload = multer({ storage: ProfileStorage });
app.post("/api/upload/profile", ProfileUpload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.error(error);
  }
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

// Start server
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});

