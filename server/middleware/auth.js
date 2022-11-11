const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(' ')[1];
	if (!token) res.status(401).json({ message: 'Unauthorized!' });
	else {
		try {
			const { user } = jwt.verify(token, process.env.JWT_SECRET);
			req.user = user;
			next();
		} catch (e) {
			res.status(403).json({ message: 'Unauthorized! Invalid token' });
		}
	}
};

module.exports = {
	authenticateToken,
};
