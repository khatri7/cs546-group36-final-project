const jwt = require('jsonwebtoken');
const { getUserById } = require('../data/users');
const { sendErrResp, unauthorizedErr, isValidObjectId } = require('../utils');
const { isValidUsername } = require('../utils/users');

const authenticateToken = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader?.split(' ')[1];
		if (!token) throw unauthorizedErr('No JWT found');
		try {
			const { user } = jwt.verify(token, process.env.JWT_SECRET);
			user._id = isValidObjectId(user._id);
			user.username = isValidUsername(user.username);
			const dbUser = await getUserById(user._id);
			if (dbUser.username !== user.username) throw new Error();
			req.user = user;
			next();
		} catch (e) {
			throw unauthorizedErr('Invalid JWT');
		}
	} catch (e) {
		sendErrResp(res, e);
	}
};

module.exports = {
	authenticateToken,
};
