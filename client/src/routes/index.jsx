import React from 'react';
import { Routes as RRDRoutes, Route } from 'react-router-dom';
import Home from 'pages';
import Login from 'pages/login';

function Routes() {
	return (
		<RRDRoutes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
		</RRDRoutes>
	);
}

export default Routes;
