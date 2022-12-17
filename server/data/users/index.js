const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { users } = require('../../config/mongoCollections');
const {
	notFoundErr,
	isValidObjectId,
	internalServerErr,
	badRequestErr,
	forbiddenErr,
	isValidStr,
	isValidFile,
	unauthorizedErr,
} = require('../../utils');
const { deleteFile, upload } = require('../../utils/aws');
const { isValidQueryParamTechnologies } = require('../../utils/projects');
const {
	isValidUsername,
	isValidUserObj,
	comparePassword,
	isValidUserLoginObj,
	isValidEmail,
	hashPassword,
	isValidUpdateUserObj,
	isValidAvailabilityQueryParams,
} = require('../../utils/users');

const getAllUsers = async (
	options = {
		skills: '',
		availability: '',
	}
) => {
	let { skills, availability } = options;
	const usersCollection = await users();
	const query = {
		isAvailable: true,
	};
	if (skills && skills.trim().length > 0) {
		skills = isValidQueryParamTechnologies(skills).split(',');
		query.skills = { $all: skills };
	}
	if (availability && availability.trim().length > 0) {
		availability = isValidAvailabilityQueryParams(availability);
		query.availability = availability;
	}
	const allUsers = await usersCollection.find(query).toArray();
	return allUsers;
};

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

const udpateAvatar = async (url, userName, userId) => {
	try {
		const user = await getUserByUsername(userName);
		isValidStr(url, 'avatar');
		if (user._id.toString() !== userId) {
			throw badRequestErr('user doesnt not have appropriate persmissions');
		}
		const usersCollection = await users();
		const updateInfo = await usersCollection.updateOne(
			{ _id: ObjectId(userId) },
			{ $set: { avatar: url } }
		);

		if (!updateInfo.acknowledged)
			throw badRequestErr('Could not update the User. Please try again.');
		const udpatedAvatar = await getUserByUsername(userName);
		return udpatedAvatar;
	} catch (e) {
		throw badRequestErr(
			'Invalid AWS request/ AWS unable to process your avatar right now'
		);
	}
};

const updateUser = async (
	usernameParam,
	currentUserParam,
	updateUserObjParam
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
		throw forbiddenErr('You cannot edit details of another user');
	const updateUserObj = isValidUpdateUserObj(updateUserObjParam);
	const usersCollection = await users();
	const result = await usersCollection.updateOne(
		{
			_id: user._id,
		},
		{
			$set: {
				...user,
				...updateUserObj,
			},
		}
	);
	if (!result || result.matchedCount === 0)
		throw notFoundErr('Could not find user with given username');
	if (!result || result.modifiedCount === 0)
		throw badRequestErr(
			'Could not update details, as all the fields are the same as before'
		);
	const updatedUser = await getUserById(user._id.toString());
	return updatedUser;
};

const udpateResume = async (userIdParam, currentUserParam, resume) => {
	const userId = isValidObjectId(userIdParam);
	const user = await getUserById(userId);
	const currentUser = {
		_id: isValidObjectId(currentUserParam._id),
		username: isValidUsername(currentUserParam.username),
	};
	isValidFile(resume, 'resume');
	if (currentUser._id !== user._id.toString())
		throw unauthorizedErr('You cannot update resume of another user');
	let location = null;
	try {
		if (user.resumeUrl) {
			const existingResumeKey = user.resumeUrl.substr(
				user.resumeUrl.indexOf('.com/') + 5
			);
			await deleteFile(existingResumeKey);
		}
		const resumeKey = `${process.env.ENVIRONMENT}/resumes/${userId}/${resume.originalname}`;
		location = await upload(resumeKey, resume.buffer, resume.mimetype, 5485760);
	} catch (e) {
		throw internalServerErr('Error updating resume on AWS');
	}
	const usersCollection = await users();
	const updateInfo = await usersCollection.updateOne(
		{ _id: ObjectId(userId) },
		{ $set: { resumeUrl: location } }
	);
	if (!updateInfo.acknowledged)
		throw badRequestErr('Could not update the User. Please try again.');
	const updatedUser = await getUserById(userId);
	return updatedUser;
};

const authenticateUser = async (userLoginObjParam) => {
	const userLoginObj = isValidUserLoginObj(userLoginObjParam);
	try {
		const { _id, firstName, lastName, avatar, username, password } =
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
			user: { _id, firstName, lastName, username, avatar },
			token,
		};
	} catch (e) {
		throw badRequestErr('Invalid username or Password');
	}
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
	await getUserById(result.insertedId.toString());
	const createdUser = await authenticateUser({
		username: userObj.username,
		password: userObj.password,
	});
	return createdUser;
};

module.exports = {
	getUserById,
	getUserByUsername,
	createUser,
	updateUser,
	authenticateUser,
	checkUsernameAvailable,
	getAllUsers,
	udpateResume,
	udpateAvatar,
};
