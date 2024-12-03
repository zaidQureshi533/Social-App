import express from 'express';
import {
	deleteNotification,
	getNotifications,
	updateNotification,
} from '../routes-controller/notification-controller.js';

const router = express.Router();

router.get('/:userId', getNotifications);
router.put('/:id', updateNotification);
router.delete("/:id", deleteNotification)

export default router;
