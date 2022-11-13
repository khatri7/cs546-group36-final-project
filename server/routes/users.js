const express = require('express');
const { usersData } = require('../data');
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

module.exports = router;
