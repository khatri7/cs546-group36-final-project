const express = require('express');
const xss = require('xss');
const jwt = require('jsonwebtoken');
const { authenticateUser, createUser, getUserById } = require('../data/users');
const { authenticateToken } = require('../middleware/auth');
const {
	sendErrResp,
	successStatusCodes,
	isValidObjectId,
} = require('../utils');
const {
	isValidUserObj,
	isValidUserLoginObj,
	isValidUsername,
} = require('../utils/users');

const router = express.Router();

router.route('/').post(async (req, res) => {
	try {
		if (!req.cookies.token) throw new Error();
		const { user } = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
		user._id = isValidObjectId(xss(user._id));
		user.username = isValidUsername(xss(user.username));
		const dbUser = await getUserById(user._id);
		if (dbUser.username !== user.username) throw new Error();
		return res.json({
			user: {
				_id: dbUser._id,
				firstName: dbUser.firstName,
				lastName: dbUser.lastName,
				username: dbUser.username,
				avatar: dbUser.avatar,
			},
		});
	} catch (e) {
		return res.clearCookie('token').send();
	}
});

router.route('/login').post(async (req, res) => {
	try {
		const userLoginObj = isValidUserLoginObj(req.body);
		// XSS validation done in authenticateUser()
		const { user, token } = await authenticateUser(userLoginObj);
		res
			.cookie('token', token, {
				maxAge: 345600000, // expires in 4 days
				httpOnly: true,
				sameSite: 'lax',
			})
			.status(successStatusCodes.CREATED)
			.json({ user });
	} catch (e) {
		sendErrResp(res, e);
	}
});

router.route('/signup').post(async (req, res) => {
	try {
		// xss validation done in isValidUserObj()
		const userObj = await isValidUserObj(req.body);
		const { user, token } = await createUser(userObj);
		res
			.cookie('token', token, {
				maxAge: 345600000, // expires in 4 days
				httpOnly: true,
				sameSite: 'lax',
			})
			.status(successStatusCodes.CREATED)
			.json({ user });
	} catch (e) {
		sendErrResp(res, e);
	}
});

router.route('/logout').post(authenticateToken, async (req, res) => {
	try {
		res.clearCookie('token').status(successStatusCodes.CREATED).send();
	} catch (e) {
		sendErrResp(res, e);
	}
});

module.exports = router;
