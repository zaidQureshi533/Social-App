import express from 'express';
import {
	DeleteUser,
	FollowUser,
	GetCurrentUser,
	GetUser,
	GetUserFriends,
	UnfollowUser,
	UpdateUser,
	UpdateUserProfilePicture,
} from '../routes-controller/users-controller.js';
const router = express.Router();

router.put('/:id', UpdateUser);
router.delete('/:id', DeleteUser);
router.post('/getuser', GetCurrentUser);
router.get('/:userId', GetUser);
router.get('/friends/:userId', GetUserFriends);
router.put('/:id/follow', FollowUser);
router.put('/:id/unfollow', UnfollowUser);
router.post('/update/profile', UpdateUserProfilePicture);

export default router;
