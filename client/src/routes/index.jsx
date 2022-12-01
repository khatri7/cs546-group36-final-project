import React from 'react';
import { Routes as RRDRoutes, Route } from 'react-router-dom';
import Home from 'pages';
import Login from 'pages/Login';
import Signup from 'pages/Signup';
import User from 'pages/User';
import Projects from 'pages/Projects';
import Project from 'pages/Project';

function Routes() {
	return (
		<RRDRoutes>
			<Route index element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/users">
				<Route path=":username" element={<User />} />
			</Route>
			<Route path="/projects">
				<Route index element={<Projects />} />
				<Route path=":projectId" element={<Project />} />
			</Route>
		</RRDRoutes>
	);
}

export default Routes;
