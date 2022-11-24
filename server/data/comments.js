const { ObjectId } = require('mongodb');
const moment = require('moment');
const { getProjectById } = require('./projects');
const { projects } = require('../config/mongoCollections');
const { isValidStr, internalServerErr } = require('../utils');

const createComment = async (commentParam, user) => {
	let { comment, projectId } = commentParam;
	comment = isValidStr(comment, 'Comment');

	const projectCollection = await projects();
	const projectFind = await getProjectById(projectId);

	let commentDate = moment().format('MM/DD/YYYY');
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
