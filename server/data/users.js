const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
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
	isValidEmail,
	hashPassword,
} = require('../utils/users');

const getUserByUsername = async (usernameParam) => {
	const username = isValidUsername(usernameParam);
	const usersCollection = await users();
	const user = await usersCollection.findOne({ username });
	if (!user) throw notFoundErr('No user found for the provided username');
	return user;
};

const getUserByEmail = async (emailParam) => {
	const email = isValidEmail(emailParam);
	const usersCollection = await users();
	const user = await usersCollection.findOne({ email });
	if (!user) throw notFoundErr('No user found for the provided email');
	return user;
};

const getUserById = async (idParam) => {
	const id = isValidObjectId(idParam);
	const usersCollection = await users();
	const user = await usersCollection.findOne({ _id: ObjectId(id) });
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

const checkEmailTaken = async (emailParam) => {
	const email = isValidEmail(emailParam);
	let user = null;
	try {
		user = await getUserByEmail(email);
	} catch (e) {
		if (e.status === 404) return true;
	}
	if (user && user.email.toLowerCase() === email.toLowerCase())
		throw badRequestErr('An account with the provided email already exists');
	return true;
};

const createUser = async (userObjParam) => {
	await checkUsernameAvailable(userObjParam.username);
	await checkEmailTaken(userObjParam.email);
	const userObj = isValidUserObj(userObjParam);
	const password = await hashPassword(userObj.password);
	const usersCollection = await users();
	const result = await usersCollection.insertOne({
		...userObj,
		password,
	});
	if (!result?.acknowledged || !result?.insertedId)
		throw internalServerErr('Could not create user. Please try again');
	const createdUser = await getUserById(result.insertedId.toString());
	return createdUser;
};

const authenticateUser = async (userLoginObjParam) => {
	const userLoginObj = isValidUserLoginObj(userLoginObjParam);
	try {
		const { _id, firstName, lastName, username, password } =
			await getUserByUsername(userLoginObj.username);
		const doPasswordsMatch = await comparePassword(
			userLoginObj.password,
			password
		);
		if (!doPasswordsMatch) throw badRequestErr('Invalid username or password');
		const token = jwt.sign(
			{
				user: {
					_id,
					username,
				},
			},
			process.env.JWT_SECRET
		);
		return {
			_id,
			firstName,
			lastName,
			username,
			token,
		};
	} catch (e) {
		throw badRequestErr('Invalid username or Password');
	}
};

module.exports = {
	getUserById,
	getUserByUsername,
	createUser,
	authenticateUser,
	checkUsernameAvailable,
};
