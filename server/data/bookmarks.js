const { getProjectById } = require('./projects');
const { projects } = require('../config/mongoCollections');
const {
	internalServerErr,
	isValidObjectId,
	badRequestErr,
} = require('../utils');
const { isValidUsername } = require('../utils/users');

const addBookmark = async (projectId, user) => {
	projectId = isValidObjectId(projectId);
	let userId = isValidObjectId(user._id);
	user.username = isValidUsername(user.username);
	const projectCollection = await projects();
	const projectFind = await getProjectById(projectId);
	let savedByUsers = projectFind.savedBy;
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

const removeBookmark = async (projectId, user) => {
	projectId = isValidObjectId(projectId);
	let userId = isValidObjectId(user._id);
	user.username = isValidUsername(user.username);

	const projectCollection = await projects();
	const projectFind = await getProjectById(projectId);
	let savedByUsers = projectFind.savedBy;

	if (savedByUsers.includes(userId)) {
		const index = savedByUsers.indexOf(userId);
		const firstArray = savedByUsers.slice(0, index);
		const secondArray = savedByUsers.slice(index + 1, savedByUsers.length);
		let savedByUsersArray = firstArray.concat(secondArray);

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
