import Axios from 'axios';
import $ from 'jquery';

const axios = Axios.create({
	baseURL: process.env.REACT_APP_SERVER_URL,
	withCredentials: true,
});

export const handleError = (error) => {
	if (error.response?.data?.message) return error.response.data.message;
	if (error.message) return error.message;
	return error;
};

/**
 *
 * @param {string} endpoint to which the API request is to be made
 * @param {object} params query parameters
 * @returns response data or error response
 */
export const GET = async (endpoint, params = {}, headers = {}) => {
	const { data } = await axios.get(endpoint, { params, headers });
	return data;
};

/**
 *
 * @param {string} endpoint to which the API request is to be made
 * @param {object} body request body
 * @param {object} params query parameters
 * @returns
 */
export const POST = async (endpoint, body = {}, params = {}, headers = {}) => {
	const { data } = await axios.post(endpoint, body, {
		params,
		headers,
	});
	return data;
};

/**
 *
 * @param {string} endpoint to which the API request is to be made
 * @param {object} body request body
 * @param {object} params query parameters
 * @returns
 */
export const PUT = async (endpoint, body = {}, params = {}, headers = {}) => {
	const { data } = await axios.put(endpoint, body, {
		params,
		headers,
	});
	return data;
};

/**
 *
 * @param {string} endpoint to which the API request is to be made
 * @param {object} body request body
 * @param {object} params query parameters
 * @returns
 */
export const DELETE = async (endpoint, params = {}, headers = {}) => {
	const { data } = await axios.delete(endpoint, {
		params,
		headers,
	});
	return data;
};

/**
 * Types of axios request possible
 * @typedef {('GET'|'POST'|'PUT'|'DELETE')} requestType
 */

export const requestTypes = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
};

Object.freeze(requestTypes);

export const createUser = async (user) => POST('/auth/signup', user);

export const login = async (userLoginObj) => POST('/auth/login', userLoginObj);

export const logout = async () => POST('/auth/logout');

export const updateUser = async (username, updateUserObj) =>
	PUT(`/users/${username}`, updateUserObj);

export const createExperience = async (username, experienceObj) =>
	POST(`/users/${username}/experience`, experienceObj);

export const updateExperience = async (username, experienceObj, experienceId) =>
	PUT(`/users/${username}/experience/${experienceId}`, experienceObj);

export const deleteExperience = async (username, experienceId) =>
	DELETE(`/users/${username}/experience/${experienceId}`);

export const createEducation = async (username, educationObj) =>
	POST(`/users/${username}/education`, educationObj);

export const updateEducation = async (username, educationObj, educationId) =>
	PUT(`/users/${username}/education/${educationId}`, educationObj);

export const deleteEducation = async (username, educationId) =>
	DELETE(`/users/${username}/education/${educationId}`);

export const checkUsernameAvailable = async (username) =>
	POST('/users/username', {
		username,
	});

export const initialReq = async () => POST('/auth');

// jQuery AJAX request
export const createProject = async (projectObj) => {
	const result = await $.ajax({
		method: 'POST',
		url: `${process.env.REACT_APP_SERVER_URL}/projects`,
		contentType: 'application/json',
		data: JSON.stringify(projectObj),
		withCredentials: true,
	});
	return result;
};
