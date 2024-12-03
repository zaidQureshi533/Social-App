import {createSlice} from '@reduxjs/toolkit';

const AlertSlice = createSlice({
	name: 'Alert',
	initialState: {type: '', message: ''},
	reducers: {
		showAlert: (state, action) => {
			const {type, message} = action.payload;
			state.type = type;
			state.message = message;
		},
		hideAlert: (state) => {
			state.type = '';
			state.message = '';
		},
	},
});

export const {showAlert, hideAlert} = AlertSlice.actions;
export default AlertSlice.reducer;
