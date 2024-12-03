import express from 'express';
import {GetChats, GetMessages} from '../routes-controller/chat-controller.js';

const router = express.Router();

router.get('/:userId', GetChats);
router.get('/:userId/:friendId', GetMessages);
export default router;
