const { ObjectId } = require('mongodb');
const { getProjectById } = require('./projects');
const { projects } = require('../config/mongoCollections');
const {
	isValidStr,
	internalServerErr,
	isValidObjectId,
	notFoundErr,
	forbiddenErr,
} = require('../utils');
const { isValidUsername } = require('../utils/users');

const getCommentById = async (commentId) => {
	const id = isValidObjectId(commentId);
	const projectsCollection = await projects();
	const comment = await projectsCollection.findOne({
		comments: { $elemMatch: { _id: ObjectId(id) } },
	});
	if (!comment) throw notFoundErr('No comment found for the provided id');
	return comment;
};

const iscommentOwner = async (projectId, commentId, userId) => {
	let isOwner = false;
	projectId = isValidObjectId(projectId);
	commentId = isValidObjectId(commentId);
	userId = isValidObjectId(userId.toString());
	const projectFind = await getProjectById(projectId);
	if (projectFind.owner._id.toString() === userId) {
		isOwner = true;
	}
	let commentsArray = projectFind.comments;
	for (let comment in commentsArray) {
		if (commentsArray[comment]._id.toString() === commentId) {
			if (commentsArray[comment].owner._id.toString() === userId) {
				isOwner = true;
			}
		}
	}
	if (!isOwner)
		throw forbiddenErr("You are not authorized to delete other user's comment");
	return isOwner;
};

const createComment = async (commentParam, user) => {
	let { comment, projectId } = commentParam;
	comment = isValidStr(comment, 'Comment');
	projectId = isValidObjectId(projectId);
	user._id = ObjectId(isValidObjectId(user._id));
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

const removeComment = async (commentParam, user) => {
	let { projectId, commentId } = commentParam;
	projectId = isValidObjectId(projectId);
	commentId = isValidObjectId(commentId);
	user._id = ObjectId(isValidObjectId(user._id));
	user.username = isValidUsername(user.username);
	const projectCollection = await projects();
	await getProjectById(projectId);
	await getCommentById(commentId);
	await iscommentOwner(projectId, commentId, user._id);
	const removeCommentAcknowledgement = await projectCollection.updateOne(
		{ _id: ObjectId(projectId) },
		{ $pull: { comments: { _id: ObjectId(commentId) } } }
	);

	if (
		!removeCommentAcknowledgement.acknowledged ||
		!removeCommentAcknowledgement.modifiedCount
	)
		throw internalServerErr('Could not delete the comment. Please try again');
	projectId = await getProjectById(projectId);
	return projectId;
};

module.exports = {
	getCommentById,
	createComment,
	removeComment,
};
