const express = require('express');
const { usersData } = require('../data');
const {
	getProjectsByOwnerUsername,
	getSavedProjects,
} = require('../data/projects');
const { getUserByUsername, checkUsernameAvailable } = require('../data/users');
const {
	sendErrResp,
	isValidObjectId,
	successStatusCodes,
	badRequestErr,
} = require('../utils');
const { isValidUsername } = require('../utils/users');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.route('/username').post(async (req, res) => {
	try {
		const username = isValidUsername(req.res.username);
		const isAvailable = await checkUsernameAvailable(username);
		if (!isAvailable) throw badRequestErr('Username already taken');
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

module.exports = router;
