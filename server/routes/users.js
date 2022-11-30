const express = require('express');
const { usersData } = require('../data');
const {
	getProjectsByOwnerUsername,
	getSavedProjects,
} = require('../data/projects');
const {
	getUserByUsername,
	checkUsernameAvailable,
	createEducation,
	getEducationById,
	updateEducation,
	removeEducation,
} = require('../data/users');
const {
	sendErrResp,
	isValidObjectId,
	successStatusCodes,
	badRequestErr,
	internalServerErr,
} = require('../utils');
const { isValidUsername, isValidEducationObj } = require('../utils/users');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.route('/username').post(async (req, res) => {
	try {
		const username = isValidUsername(req.body.username);
		const isAvailable = await checkUsernameAvailable(username);
		if (!isAvailable)
			throw badRequestErr('The username provided has already been taken');
		res.status(successStatusCodes.CREATED).json({ username });
	} catch (e) {
		sendErrResp(res, e);
	}
});

router.route('/:username').get(async (req, res) => {
	try {
		const username = isValidUsername(req.params.username);
		const user = await usersData.getUserByUsername(username);
		res.json({ user });
	} catch (e) {
		sendErrResp(res, e);
	}
});

router.route('/:username/projects').get(async (req, res) => {
	try {
		const username = isValidUsername(req.params.username);
		await getUserByUsername(username);
		const projects = await getProjectsByOwnerUsername(username);
		res.json({ projects });
	} catch (e) {
		sendErrResp(res, e);
	}
});

router
	.route('/:username/saved-projects')
	.get(authenticateToken, async (req, res) => {
		const { user } = req;
		try {
			const username = isValidUsername(req.params.username);
			const loggedinId = isValidObjectId(user._id);
			await getUserByUsername(username);
			const projects = await getSavedProjects(username, loggedinId);
			res.json({ projects });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

router
	.route('/:username/education')
	.post(authenticateToken, async (req, res) => {
		try {
			const username = isValidUsername(req.params.username);
			await getUserByUsername(username);
			const currentUser = {
				_id: isValidObjectId(req.user._id),
				username: isValidUsername(req.user.username),
			};
			const educationObj = isValidEducationObj(req.body);
			const education = await createEducation(
				username,
				currentUser,
				educationObj
			);
			res.status(successStatusCodes.CREATED).json({ education });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

router
	.route('/:username/education/:educationId')
	.put(authenticateToken, async (req, res) => {
		try {
			const username = isValidUsername(req.params.username);
			const educationId = isValidObjectId(req.params.educationId);
			await getUserByUsername(username);
			await getEducationById(educationId);
			const currentUser = {
				_id: isValidObjectId(req.user._id),
				username: isValidUsername(req.user.username),
			};
			const educationObj = isValidEducationObj(req.body);
			const education = await updateEducation(
				username,
				educationId,
				currentUser,
				educationObj
			);
			res.json({ education });
		} catch (e) {
			sendErrResp(res, e);
		}
	})
	.delete(authenticateToken, async (req, res) => {
		try {
			const username = isValidUsername(req.params.username);
			const educationId = isValidObjectId(req.params.educationId);
			await getUserByUsername(username);
			await getEducationById(educationId);
			const currentUser = {
				_id: isValidObjectId(req.user._id),
				username: isValidUsername(req.user.username),
			};
			const result = await removeEducation(username, educationId, currentUser);
			if (!result) throw internalServerErr('Error removing education');
			res.status(successStatusCodes.DELETED).json();
		} catch (e) {
			sendErrResp(res, e);
		}
	});

module.exports = router;
