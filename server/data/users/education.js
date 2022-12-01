const { ObjectId } = require('mongodb');
const { users } = require('../../config/mongoCollections');
const {
	notFoundErr,
	isValidObjectId,
	internalServerErr,
	badRequestErr,
	forbiddenErr,
} = require('../../utils');
const { isValidUsername, isValidEducationObj } = require('../../utils/users');
const { getUserByUsername } = require('./index');

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

module.exports = {
	getEducationById,
	createEducation,
	updateEducation,
	removeEducation,
};