import { Container } from '@mui/material';
import Alert from 'components/Alert';
import { BrowserRouter as Router } from 'react-router-dom';
import React, { useEffect } from 'react';
import Loader from 'components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { autoLogin } from 'utils/helpers';
import Navbar from './Navbar';

function Layout({ children }) {
	const appInitialized = useSelector((state) => state.app.appInitialized);
	const dispatch = useDispatch();
	useEffect(() => {
		if (!appInitialized) autoLogin(dispatch);
	}, [appInitialized, dispatch]);
	if (!appInitialized) return <Loader />;
	return (
		<Router>
			<Navbar />
			<Container
				sx={{
					py: 4,
				}}
			>
				{children}
			</Container>
			<Alert />
		</Router>
	);
}

export default Layout;
