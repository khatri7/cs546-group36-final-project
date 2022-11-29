const { getProjectById } = require('./projects');
const { projects } = require('../config/mongoCollections');
const {
	internalServerErr,
	isValidObjectId,
	badRequestErr,
} = require('../utils');

const addBookmark = async (projectParam, user) => {
	const projectId = isValidObjectId(projectParam);
	const userId = isValidObjectId(user._id);
	const projectCollection = await projects();
	const projectFind = await getProjectById(projectId);
	const savedByUsers = projectFind.savedBy;
	if (!savedByUsers.includes(userId)) {
		const bookmarkAcknowledgement = await projectCollection.updateOne(
			{ _id: projectFind._id },
			{ $push: { savedBy: userId } }
		);
		if (
			!bookmarkAcknowledgement.acknowledged ||
			!bookmarkAcknowledgement.modifiedCount
		)
			throw internalServerErr(
				'Could not bookmark the project. Please try again.'
			);
	} else throw badRequestErr('Project already bookmarked.');
	const projectUpdate = await getProjectById(projectId);
	return projectUpdate.savedBy;
};

const removeBookmark = async (projectParam, user) => {
	const projectId = isValidObjectId(projectParam);
	const userId = isValidObjectId(user._id);
	const projectCollection = await projects();
	const projectFind = await getProjectById(projectId);
	const savedByUsers = projectFind.savedBy;

	if (savedByUsers.includes(userId)) {
		const index = savedByUsers.indexOf(userId);
		const firstArray = savedByUsers.slice(0, index);
		const secondArray = savedByUsers.slice(index + 1, savedByUsers.length);
		const savedByUsersArray = firstArray.concat(secondArray);

		const bookmarkAcknowledgement = await projectCollection.updateOne(
			{ _id: projectFind._id },
			{ $set: { savedBy: savedByUsersArray } }
		);
		if (
			!bookmarkAcknowledgement.acknowledged ||
			!bookmarkAcknowledgement.modifiedCount
		)
			throw internalServerErr(
				'Could not unsave the project. Please try again.'
			);
	} else throw badRequestErr('You have already removed the bookmark.');
	const projectUpdate = await getProjectById(projectId);
	return projectUpdate.savedBy;
};

module.exports = {
	addBookmark,
	removeBookmark,
};
