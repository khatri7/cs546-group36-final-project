const { ObjectId } = require('mongodb');
const { users } = require('../../config/mongoCollections');
const {
	notFoundErr,
	isValidObjectId,
	internalServerErr,
	badRequestErr,
	forbiddenErr,
} = require('../../utils');
const { isValidUsername, isValidExperienceObj } = require('../../utils/users');
const { getUserByUsername, getUserById } = require('./index');

const getExperienceById = async (experienceIdParam) => {
	const experienceId = isValidObjectId(experienceIdParam);
	const usersCollection = await users();
	const user = await usersCollection.findOne({
		experience: { $elemMatch: { _id: ObjectId(experienceId) } },
	});
	if (!user) throw notFoundErr('No experience found for the provided id');
	return user;
};

const createExperience = async (
	usernameParam,
	currentUserParam,
	experienceObjParam
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
		throw forbiddenErr('You cannot add an experience for another user');
	const experienceObj = isValidExperienceObj(experienceObjParam);
	experienceObj._id = ObjectId();
	const usersCollection = await users();
	const acknowledgement = await usersCollection.updateOne(
		{ _id: user._id },
		{ $push: { experience: experienceObj } }
	);
	if (!acknowledgement.acknowledged || !acknowledgement.modifiedCount)
		throw internalServerErr('Could not add the experience. Please try again');
	const updatedUser = await getUserById(user._id.toString());
	return updatedUser;
};

const updateExperience = async (
	usernameParam,
	experienceIdParam,
	currentUserParam,
	experienceObjParam
) => {
	const username = isValidUsername(usernameParam);
	const experienceId = isValidObjectId(experienceIdParam);
	const currentUser = {
		_id: isValidObjectId(currentUserParam._id),
		username: isValidUsername(currentUserParam.username),
	};
	const user = await getUserByUsername(username);
	const experienceOwner = await getExperienceById(experienceId);
	if (user._id.toString() !== experienceOwner._id.toString())
		throw notFoundErr('No experience found for the provided id');
	if (
		user._id.toString() !== currentUser._id ||
		user.username.toLowerCase() !== currentUser.username.toLowerCase()
	)
		throw forbiddenErr('You cannot edit an experience of another user');
	const experienceObj = isValidExperienceObj(experienceObjParam);
	experienceObj._id = ObjectId(experienceId);
	const usersCollection = await users();
	const result = await usersCollection.updateOne(
		{
			_id: experienceOwner._id,
			'experience._id': experienceObj._id,
		},
		{
			$set: {
				'experience.$': experienceObj,
			},
		}
	);
	if (!result || result.matchedCount === 0)
		throw notFoundErr('Could not find experience with the given Id');
	if (!result || result.modifiedCount === 0)
		throw badRequestErr(
			'Could not update the experience, as all the fields are the same as before'
		);
	const updatedUser = await getUserById(user._id.toString());
	return updatedUser;
};

const removeExperience = async (
	usernameParam,
	experienceIdParam,
	currentUserParam
) => {
	const username = isValidUsername(usernameParam);
	const experienceId = isValidObjectId(experienceIdParam);
	const currentUser = {
		_id: isValidObjectId(currentUserParam._id),
		username: isValidUsername(currentUserParam.username),
	};
	const user = await getUserByUsername(username);
	const experienceOwner = await getExperienceById(experienceId);
	if (user._id.toString() !== experienceOwner._id.toString())
		throw notFoundErr('No experience found for the provided id');
	if (
		user._id.toString() !== currentUser._id ||
		user.username.toLowerCase() !== currentUser.username.toLowerCase()
	)
		throw forbiddenErr('You cannot delete an experience of another user');
	const usersCollection = await users();
	const result = await usersCollection.updateOne(
		{
			_id: experienceOwner._id,
		},
		{
			$pull: {
				experience: {
					_id: ObjectId(experienceId),
				},
			},
		}
	);
	if (!result || result.matchedCount === 0)
		throw notFoundErr('Could not find experience with the given Id');
	if (!result || result.modifiedCount === 0)
		throw internalServerErr('Error removing experience');
	const updatedUser = await getUserById(user._id.toString());
	return updatedUser;
};

module.exports = {
	getExperienceById,
	createExperience,
	updateExperience,
	removeExperience,
};
