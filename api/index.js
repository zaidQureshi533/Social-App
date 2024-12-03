import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import {fileURLToPath} from 'url'; // To convert URL to file path
import {dirname} from 'path'; // To get directory name
import authRoute from './routes/auth.js';
import chatRoute from './routes/chat.js';
import userRoute from './routes/users.js';
import postRoute from './routes/posts.js';
import uploadFileRoute from './routes/upload-file.js';
import notificationRoute from './routes/notification.js'
import {createServer} from 'http';
import {Server} from 'socket.io';
import socketHandler from './socket.js';
const app = express();
const port = 8800;
const corsConfig = {
	origin: 'http://localhost:5173',
	methods: ['GET', 'POST', 'DELETE', 'PUT'],
	credentials: true,
};
dotenv.config();
app.use(express.json());
app.use(cors(corsConfig));

const server = createServer(app);
const io = new Server(server, {cors: corsConfig});
socketHandler(io);

// Resolve directory path using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Public folder
app.use('/images', express.static(`${__dirname}/../uploads/images`));

// Connect to database
const connectToDb = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URL);
		console.log('Connected to MongoDB');
	} catch (err) {
		console.log('Failed to connect to MongoDB:', err);
	}
};
connectToDb();

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/upload', uploadFileRoute);
app.use('/api/chats', chatRoute);
app.use('/api/notifications', notificationRoute);

// Initialize server
server.listen(port, () => {
	console.log(`Backend server is running on port ${port}`);
});
