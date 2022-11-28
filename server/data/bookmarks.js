const { ObjectId } = require('mongodb');
const { getProjectById } = require('./projects');
const { projects } = require('../config/mongoCollections');
const { internalServerErr, isValidObjectId } = require('../utils');
const { isValidUsername } = require('../utils/users');
const { isValidStatus } = require('../utils/bookmarks');

const bookmarkProject = async (projectId, user, status) => {
	projectId = isValidObjectId(projectId);
	user._id = ObjectId(isValidObjectId(user._id));
	user.username = isValidUsername(user.username);
	status = isValidStatus(status);
	const projectCollection = await projects();
	const projectFind = await getProjectById(projectId);
	const userId = user._id.toString();
	let savedByUsers = projectFind.savedBy;
	if (status) {
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
					'Could not bookmark the project. Please try again'
				);
		}
	} else {
		const index = savedByUsers.indexOf(userId);
		const firstArray = savedByUsers.slice(0, index);
		const secondArray = savedByUsers.slice(index + 1, savedByUsers.length);
		let savedByUsersArray = firstArray.concat(secondArray);
		const projectCollection = await projects();
		const bookmarkAcknowledgement = await projectCollection.updateOne(
			{ _id: projectFind._id },
			{ $set: { savedBy: savedByUsersArray } }
		);
		if (
			!bookmarkAcknowledgement.acknowledged ||
			!bookmarkAcknowledgement.modifiedCount
		)
			throw internalServerErr('Could not unsave the project. Please try again');
	}
	const projectUpdate = await getProjectById(projectId);
	return projectUpdate.savedBy;
};

module.exports = {
	bookmarkProject,
};
