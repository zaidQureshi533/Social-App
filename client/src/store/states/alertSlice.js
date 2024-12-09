import {createSlice} from '@reduxjs/toolkit';

const AlertSlice = createSlice({
	name: 'Alert',
	initialState: {type: '', message: ''},
	reducers: {
		errorAlert: (state, action) => {
			state.type = 'error';
			state.message = action.payload;
		},
		hideAlert: (state) => {
			state.type = '';
			state.message = '';
		},
	},
});

export const {errorAlert, hideAlert} = AlertSlice.actions;
export default AlertSlice.reducer;
