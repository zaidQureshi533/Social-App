import {createSlice} from '@reduxjs/toolkit';

const ChatSlice = createSlice({
	name: 'Chat',
	initialState: {
		showChat: false,
		chatUser: {},
	},
	reducers: {
		openChat: (state, action) => {
			state.showChat = true;
			state.chatUser = action.payload;
		},
		closeChat: (state) => {
			state.showChat = false;
			state.chatUser = {};
		},
	},
});

export const {openChat, closeChat} = ChatSlice.actions;
export default ChatSlice.reducer;
