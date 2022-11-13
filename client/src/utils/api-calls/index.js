import Axios from 'axios';

const axios = Axios.create({
	baseURL: process.env.REACT_APP_SERVER_URL,
});

export const handleError = (error) => {
	if (error.response && error.response.message) return error.response.message;
	if (error.message) return error.message;
	return error;
};

/**
 *
 * @param {string} endpoint to which the API request is to be made
 * @param {object} params query parameters
 * @returns response data or error response
 */
export const GET = async (endpoint, params = {}) => {
	const { data } = await axios.get(endpoint, { params });
	return data;
};

/**
 *
 * @param {string} endpoint to which the API request is to be made
 * @param {object} body request body
 * @param {object} params query parameters
 * @returns
 */
export const POST = async (endpoint, body = {}, params = {}) => {
	const { data } = await axios.post(endpoint, body, {
		params,
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
export const PUT = async (endpoint, body = {}, params = {}) => {
	const { data } = await axios.put(endpoint, body, {
		params,
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
export const DELETE = async (endpoint, params = {}) => {
	const { data } = await axios.delete(endpoint, {
		params,
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
