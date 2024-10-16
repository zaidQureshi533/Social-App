import {createSlice} from '@reduxjs/toolkit';

const UserSlice = createSlice({
	name: 'User',
	initialState: {value: {isOnline: false}},
	reducers: {
		login: (state, action) => {
			state.value = action.payload;
		},
		logout: (state) => {
			state.value = {isOnline: false};
		},
	},
});

export const {login, logout} = UserSlice.actions;
export default UserSlice.reducer;
