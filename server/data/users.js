const { users } = require('../config/mongoCollections');
const { notFoundErr, isValidObjectId, internalServerErr } = require('../utils');
const { isValidUsername, isValidUserObj } = require('../utils/users');

const getUserByUsername = async (usernameParam) => {
	const username = isValidUsername(usernameParam);
	const usersCollection = await users();
	const user = await usersCollection.findOne({ username });
	if (!user) throw notFoundErr('No user found for the provided username');
	return user;
};

const getUserById = async (idParam) => {
	const id = isValidObjectId(idParam);
	const usersCollection = await users();
	const user = await usersCollection.findOne({ _id: id });
	if (!user) throw notFoundErr('No user found for the provided id');
	return user;
};

const createUser = async (userObjParam) => {
	const userObj = await isValidUserObj(userObjParam);
	const usersCollection = await users();
	const result = await usersCollection.insertOne(userObj);
	if (!result?.acknowledged || !result?.insertedId)
		throw internalServerErr('Could not create user. Please try again');
	const createdUser = await getUserById(result.insertedId.toString());
	return createdUser;
};

module.exports = {
	getUserByUsername,
	createUser,
};
