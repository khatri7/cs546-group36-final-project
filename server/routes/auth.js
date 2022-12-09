const express = require('express');
const { authenticateUser, createUser } = require('../data/users');
const { autoLogin } = require('../middleware/auth');
const { sendErrResp, successStatusCodes } = require('../utils');
const { isValidUserObj, isValidUserLoginObj } = require('../utils/users');

const router = express.Router();

router.route('/login').post(autoLogin, async (req, res) => {
	try {
		const userLoginObj = isValidUserLoginObj(req.body);
		const user = await authenticateUser(userLoginObj);
		res
			.cookie('token', user.token)
			.status(successStatusCodes.CREATED)
			.json({ user });
	} catch (e) {
		sendErrResp(res, e);
	}
});

router.route('/signup').post(async (req, res) => {
	try {
		const userObj = await isValidUserObj(req.body);
		const user = await createUser(userObj);
		res
			.cookie('token', user.token)
			.status(successStatusCodes.CREATED)
			.json({ user });
	} catch (e) {
		sendErrResp(res, e);
	}
});

module.exports = router;
