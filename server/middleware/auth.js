const jwt = require('jsonwebtoken');
const { getUserById } = require('../data/users');
const { sendErrResp, unauthorizedErr } = require('../utils');

const authenticateToken = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader?.split(' ')[1];
		if (!token) throw unauthorizedErr('No JWT found');
		try {
			const { user } = jwt.verify(token, process.env.JWT_SECRET);
			// eslint-disable-next-line no-underscore-dangle
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
