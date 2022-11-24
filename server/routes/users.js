const express = require('express');
const { usersData } = require('../data');
const { getProjectsByOwnerUsername } = require('../data/projects');
const { getUserByUsername } = require('../data/users');
const { sendErrResp } = require('../utils');
const { isValidUsername } = require('../utils/users');

const router = express.Router();

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

module.exports = router;
