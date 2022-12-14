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
export const DELETE = async (
	endpoint,
	body = {},
	params = {},
	headers = {}
) => {
	const { data } = await axios.delete(endpoint, {
		data: body,
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

export const createIdeaComment = async (comment, ideaId) =>
	POST(`/ideas/${ideaId}/comments`, comment);

export const deleteIdeaComment = async (ideaId, commentId) =>
	DELETE(`/ideas/${ideaId}/comments/${commentId}`);

export const createProjectComment = async (comment, projectId) =>
	POST(`/projects/${projectId}/comments`, comment);

export const deleteProjectComment = async (projectId, commentId) =>
	DELETE(`/projects/${projectId}/comments/${commentId}`);

export const initialReq = async () => POST('/auth');

// jQuery AJAX request
export const createProject = async (projectObj) => {
	const result = await $.ajax({
		method: 'POST',
		url: `${process.env.REACT_APP_SERVER_URL}/projects`,
		contentType: 'application/json',
		data: JSON.stringify(projectObj),
		xhrFields: {
			withCredentials: true,
		},
	});
	return result;
};

export const createIdea = async (ideaObj) => POST('/ideas', ideaObj);

export const uploadMedia = (body = {}) => {
	const formData = new FormData();
	Object.entries(body).forEach((item) => {
		formData.append(item[0], item[1]);
	});
	return POST(
		'/media',
		formData,
		{},
		{ 'Content-Type': 'multipart/form-data' }
	);
};

export const uploadResume = (resume, userId) =>
	uploadMedia({
		media: resume,
		userId,
		mediaType: 'resume',
	});

export const uploadAvatar = (avatar, userId) =>
	uploadMedia({
		media: avatar,
		userId,
		mediaType: 'avatar',
	});

export const uploadProjectImage = (media, imagePos, projectId) =>
	uploadMedia({
		media,
		projectId,
		imagePos,
		mediaType: 'image',
	});

export const deleteProject = (projectId) => DELETE(`/projects/${projectId}`);

export const likeProject = (projectId) => POST(`/projects/${projectId}/likes`);
export const unlikeProject = (projectId) =>
	DELETE(`/projects/${projectId}/likes`);

export const bookmarkProject = (projectId) =>
	POST(`/projects/${projectId}/bookmark`);
export const removeProjectBookmark = (projectId) =>
	DELETE(`/projects/${projectId}/bookmark`);

export const likeIdea = (ideaId) => POST(`/ideas/${ideaId}/likes`);
export const unlikeIdea = (ideaId) => DELETE(`/ideas/${ideaId}/likes`);

export const deleteIdea = (ideaId) => DELETE(`/ideas/${ideaId}`);

export const updateProject = (projectId, projectObj) =>
	PUT(`/projects/${projectId}`, projectObj);

export const removeProjectMedia = (imagePos, projectId) =>
	DELETE('/media', {
		imagePos,
		projectId,
		mediaType: 'image',
	});
