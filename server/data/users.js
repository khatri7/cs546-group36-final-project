const jwt = require('jsonwebtoken');
const { users } = require('../config/mongoCollections');
const {
	notFoundErr,
	isValidObjectId,
	internalServerErr,
	badRequestErr,
} = require('../utils');
const {
	isValidUsername,
	isValidUserObj,
	comparePassword,
	isValidUserLoginObj,
} = require('../utils/users');

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

const checkUsernameAvailable = async (usernameParam) => {
	const username = isValidUsername(usernameParam);
	let user = null;
	try {
		user = await getUserByUsername(username);
	} catch (e) {
		if (e.status === 404) return true;
	}
	if (user && user.username.toLowerCase() === username.toLowerCase())
		throw badRequestErr('The username provided has already been taken');
	return true;
};

const createUser = async (userObjParam) => {
	const userObj = await isValidUserObj(userObjParam);
	await checkUsernameAvailable(userObj.username);
	const usersCollection = await users();
	const result = await usersCollection.insertOne(userObj);
	if (!result?.acknowledged || !result?.insertedId)
		throw internalServerErr('Could not create user. Please try again');
	const createdUser = await getUserById(result.insertedId.toString());
	return createdUser;
};

const authenticateUser = async (userLoginObjParam) => {
	const userLoginObj = isValidUserLoginObj(userLoginObjParam);
	try {
		const user = await getUserByUsername(userLoginObj.username);
		const doPasswordsMatch = await comparePassword(
			userLoginObj.password,
			user.password
		);
		if (!doPasswordsMatch) throw badRequestErr('Invalid username or password');
		const token = jwt.sign(user, process.env.JWT_SECRET);
		return { token };
	} catch (e) {
		throw badRequestErr('Invalid username or Password');
	}
};

module.exports = {
	getUserByUsername,
	createUser,
	authenticateUser,
};
