import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
	name: 'app',
	initialState: {
		appInitialized: false,
	},
	reducers: {
		initializeApp: (state) => {
			return {
				...state,
				appInitialized: true,
			};
		},
	},
});

export const { initializeApp } = appSlice.actions;

export default appSlice.reducer;
