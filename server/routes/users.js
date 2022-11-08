const express = require('express');
const { usersData } = require('../data');
const { sendErrResp } = require('../utils');
const { isValidUsername, isValidUserObj } = require('../utils/users');

const router = express.Router();

router.route('/').post(async (req, res) => {
	try {
		const userObj = await isValidUserObj(req.body);
		const user = await usersData.createUser(userObj);
		res.status(201).json({ user });
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

module.exports = router;
