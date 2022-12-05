import { createSlice } from '@reduxjs/toolkit';

export const alertSlice = createSlice({
	name: 'alert',
	initialState: {
		open: false,
		type: 'info',
		message: '',
	},
	reducers: {
		errorAlert: (state, action) => {
			state.open = true;
			state.type = 'error';
			state.message = action.payload;
		},
		warningAlert: (state, action) => {
			state.open = true;
			state.type = 'warning';
			state.message = action.payload;
		},
		infoAlert: (state, action) => {
			state.open = true;
			state.type = 'info';
			state.message = action.payload;
		},
		successAlert: (state, action) => {
			state.open = true;
			state.type = 'success';
			state.message = action.payload;
		},
		dismissAlert: (state) => {
			state.open = false;
			state.type = 'info';
			state.message = '';
		},
	},
});

export const {
	infoAlert,
	warningAlert,
	successAlert,
	errorAlert,
	dismissAlert,
} = alertSlice.actions;

export default alertSlice.reducer;
