const { users } = require('../config/mongoCollections');

const getUserByUsername = async (username) => {
	const usersCollection = await users();
	usersCollection.findOne({ username });
};

module.exports = {
	getUserByUsername,
};
