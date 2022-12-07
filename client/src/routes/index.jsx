import React from 'react';
import { Routes as RRDRoutes, Route } from 'react-router-dom';
import Home from 'pages';
import Login from 'pages/Login';
import Signup from 'pages/Signup';
import User from 'pages/User';
import Projects from 'pages/Projects';
import Project from 'pages/Project';
import CreateProject from 'pages/CreateProject';
import Ideas from 'pages/Ideas';
import Idea from 'pages/Idea';

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
				<Route path="create" element={<CreateProject />} />
			</Route>
			<Route path="/ideas">
				<Route index element={<Ideas />} />
				<Route path=":ideaId" element={<Idea />} />
			</Route>
		</RRDRoutes>
	);
}

export default Routes;
