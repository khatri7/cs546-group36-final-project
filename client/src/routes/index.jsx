import React from 'react';
import { Routes as RRDRoutes, Route } from 'react-router-dom';
import Home from 'pages';
import Login from 'pages/Login';
import Signup from 'pages/Signup';
import User from 'pages/User';
import Projects from 'pages/Projects';

function Routes() {
	return (
		<RRDRoutes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/users">
				<Route path=":username" element={<User />} />
			</Route>
			<Route path="/projects" element={<Projects />} />
		</RRDRoutes>
	);
}

export default Routes;
