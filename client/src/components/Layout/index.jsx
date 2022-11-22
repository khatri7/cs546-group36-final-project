import { Container } from '@mui/material';
import Alert from 'components/Alert';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import Navbar from './Navbar';

function Layout({ children }) {
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
