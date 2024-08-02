import {createSlice} from '@reduxjs/toolkit';

const UserSlice = createSlice({
	name: 'User',
	initialState: {value: {isOnline: false}},
	reducers: {
		updateUser: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const {updateUser} = UserSlice.actions;
export default UserSlice.reducer;
