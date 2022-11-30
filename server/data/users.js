const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { users } = require('../config/mongoCollections');
const {
	notFoundErr,
	isValidObjectId,
	internalServerErr,
	badRequestErr,
	forbiddenErr,
} = require('../utils');
const {
	isValidUsername,
	isValidUserObj,
	comparePassword,
	isValidUserLoginObj,
	isValidEmail,
	hashPassword,
	isValidEducationObj,
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

// Education Data Functions

const getEducationById = async (educationIdParam) => {
	const educationId = isValidObjectId(educationIdParam);
	const usersCollection = await users();
	const user = await usersCollection.findOne({
		education: { $elemMatch: { _id: ObjectId(educationId) } },
	});
	if (!user) throw notFoundErr('No education found for the provided id');
	return user;
};

const createEducation = async (
	usernameParam,
	currentUserParam,
	educationObjParam
) => {
	const username = isValidUsername(usernameParam);
	const currentUser = {
		_id: isValidObjectId(currentUserParam._id),
		username: isValidUsername(currentUserParam.username),
	};
	const user = await getUserByUsername(username);
	if (
		user._id.toString() !== currentUser._id ||
		user.username.toLowerCase() !== currentUser.username.toLowerCase()
	)
		throw forbiddenErr('You cannot create an education for another user');
	const educationObj = isValidEducationObj(educationObjParam);
	educationObj._id = ObjectId();
	const usersCollection = await users();
	const educationAcknowledgement = await usersCollection.updateOne(
		{ _id: user._id },
		{ $push: { education: educationObj } }
	);
	if (
		!educationAcknowledgement.acknowledged ||
		!educationAcknowledgement.modifiedCount
	)
		throw internalServerErr('Could not upload the education. Please try again');
	return educationObj;
};

const updateEducation = async (
	usernameParam,
	educationIdParam,
	currentUserParam,
	educationObjParam
) => {
	const username = isValidUsername(usernameParam);
	const educationId = isValidObjectId(educationIdParam);
	const currentUser = {
		_id: isValidObjectId(currentUserParam._id),
		username: isValidUsername(currentUserParam.username),
	};
	const user = await getUserByUsername(username);
	const educationOwner = await getEducationById(educationId);
	if (user._id.toString() !== educationOwner._id.toString())
		throw notFoundErr('No education found for the provided id');
	if (
		user._id.toString() !== currentUser._id ||
		user.username.toLowerCase() !== currentUser.username.toLowerCase()
	)
		throw forbiddenErr('You cannot edit an education of another user');
	const educationObj = isValidEducationObj(educationObjParam);
	educationObj._id = ObjectId(educationId);
	const usersCollection = await users();
	const result = await usersCollection.updateOne(
		{
			_id: educationOwner._id,
			'education._id': educationObj._id,
		},
		{
			$set: {
				'education.$': educationObj,
			},
		}
	);
	if (!result || result.matchedCount === 0)
		throw notFoundErr('Could not find education with the given Id');
	if (!result || result.modifiedCount === 0)
		throw badRequestErr(
			'Could not update the education, as all the fields are the same as before'
		);
	return educationObj;
};

const removeEducation = async (
	usernameParam,
	educationIdParam,
	currentUserParam
) => {
	const username = isValidUsername(usernameParam);
	const educationId = isValidObjectId(educationIdParam);
	const currentUser = {
		_id: isValidObjectId(currentUserParam._id),
		username: isValidUsername(currentUserParam.username),
	};
	const user = await getUserByUsername(username);
	const educationOwner = await getEducationById(educationId);
	if (user._id.toString() !== educationOwner._id.toString())
		throw notFoundErr('No education found for the provided id');
	if (
		user._id.toString() !== currentUser._id ||
		user.username.toLowerCase() !== currentUser.username.toLowerCase()
	)
		throw forbiddenErr('You cannot delete an education of another user');
	const usersCollection = await users();
	const result = await usersCollection.updateOne(
		{
			_id: educationOwner._id,
		},
		{
			$pull: {
				education: {
					_id: ObjectId(educationId),
				},
			},
		}
	);
	if (!result || result.matchedCount === 0)
		throw notFoundErr('Could not find education with the given Id');
	if (!result || result.modifiedCount === 0)
		throw internalServerErr('Error removing education');
	return true;
};

// End of Education Data Functions

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
	getEducationById,
	createEducation,
	updateEducation,
	removeEducation,
};
