import Axios from 'axios';

const axios = Axios.create({
	baseURL: process.env.REACT_APP_SERVER_URL,
});

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
	const { data } = await axios.post(endpoint, { params, data: body });
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
	const { data } = await axios.put(endpoint, { params, data: body });
	return data;
};

/**
 *
 * @param {string} endpoint to which the API request is to be made
 * @param {object} body request body
 * @param {object} params query parameters
 * @returns
 */
export const DELETE = async (endpoint, body = {}, params = {}) => {
	const { data } = await axios.delete(endpoint, { params, data: body });
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

export const createUser = async (user) => POST('/users', user);
