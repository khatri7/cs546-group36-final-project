import React from 'react';
import {
	Routes as RRDRoutes,
	Route,
	useLocation,
	Navigate,
} from 'react-router-dom';
import Home from 'pages';
import Login from 'pages/Login';
import Signup from 'pages/Signup';
import User from 'pages/User';
import Projects from 'pages/Projects';
import Project from 'pages/Project';
import CreateProject from 'pages/CreateProject';
import Ideas from 'pages/Ideas';
import Idea from 'pages/Idea';
import Hiring from 'pages/Hiring';
import { useDispatch, useSelector } from 'react-redux';
import { infoAlert } from 'store/alert';

function Routes() {
	const { pathname } = useLocation();
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const isLoggedIn =
		user !== null && Boolean(user._id) && Boolean(user.username);
	if (isLoggedIn && ['/login', '/signup'].includes(pathname))
		return <Navigate to={`/users/${user.username}`} />;
	if (!isLoggedIn && pathname === '/projects/create') {
		dispatch(infoAlert('Please login'));
		return <Navigate to="/login" />;
	}
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
			<Route path="/hiring">
				<Route index element={<Hiring />} />
			</Route>
		</RRDRoutes>
	);
}

export default Routes;
