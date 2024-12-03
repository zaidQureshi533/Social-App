import {configureStore} from '@reduxjs/toolkit';
import userReducer from './states/userSlice';
import chatReducer from './states/chatSlice';
import alertReducer from './states/alertSlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		chat: chatReducer,
		alert: alertReducer,
	},
});
