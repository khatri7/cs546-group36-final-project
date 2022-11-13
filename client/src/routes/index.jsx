import React from 'react';
import { Routes as RRDRoutes, Route } from 'react-router-dom';
import Home from 'pages';
import Login from 'pages/hj';
import Signup from 'pages/Signup';

function Routes() {
	return (
		<RRDRoutes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
		</RRDRoutes>
	);
}

export default Routes;
