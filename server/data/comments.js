const { ObjectId } = require('mongodb');
const moment = require('moment');
const { getProjectById } = require('./projects');
const { projects } = require('../config/mongoCollections');
const { isValidStr, internalServerErr, isValidObjectId } = require('../utils');
const { isValidUsername } = require('../utils/users');

const createComment = async (commentParam, user) => {
	let { comment, projectId } = commentParam;
	comment = isValidStr(comment, 'Comment');
	projectId = isValidObjectId(projectId);
	user._id = isValidObjectId(user._id);
	user.username = isValidUsername(user.username);
	const projectCollection = await projects();
	const projectFind = await getProjectById(projectId);
	let commentDate = new Date();
	let commentObject = {
		_id: ObjectId(),
		comment: comment,
		timestamp: commentDate,
		owner: user,
	};

	const commentAcknowledgement = await projectCollection.updateOne(
		{ _id: projectFind._id },
		{ $push: { comments: commentObject } }
	);
	if (
		!commentAcknowledgement.acknowledged ||
		!commentAcknowledgement.modifiedCount
	)
		throw internalServerErr('Could not upload the comment. Please try again');
	return commentObject;
};

module.exports = {
	createComment,
};
