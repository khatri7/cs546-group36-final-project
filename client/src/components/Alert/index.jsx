import { Snackbar, Alert as MuiAlert } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dismissAlert } from 'store/alert';

function Alert() {
	const { open, type, message } = useSelector((state) => state.alert);
	const dispatch = useDispatch();
	const handleClose = () => {
		dispatch(dismissAlert());
	};
	return (
		<Snackbar
			open={open}
			autoHideDuration={5000}
			onClose={handleClose}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
		>
			<MuiAlert severity={type || 'info'}>{message}</MuiAlert>
		</Snackbar>
	);
}

export default Alert;
