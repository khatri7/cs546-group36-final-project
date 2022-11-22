import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
	name: 'user',
	initialState: null,
	reducers: {
		setUser: (state, action) => {
			return action.payload;
		},
		unsetUser: () => {
			return null;
		},
	},
});

export const { setUser, unsetUser } = userSlice.actions;

export default userSlice.reducer;
