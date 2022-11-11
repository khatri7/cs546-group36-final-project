const express = require('express');
const { authenticateUser, createUser } = require('../data/users');
const { sendErrResp } = require('../utils');
const { isValidUserObj, isValidUserLoginObj } = require('../utils/users');

const router = express.Router();

router.route('/login').post(async (req, res) => {
	try {
		const userLoginObj = isValidUserLoginObj(req.body);
		const token = await authenticateUser(userLoginObj);
		res.status(201).json({ token });
	} catch (e) {
		sendErrResp(res, e);
	}
});

router.route('/signup').post(async (req, res) => {
	try {
		const userObj = await isValidUserObj(req.body);
		const user = await createUser(userObj);
		res.status(201).json({ user });
	} catch (e) {
		sendErrResp(res, e);
	}
});

module.exports = router;
