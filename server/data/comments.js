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

const getCommentById = async (commentId) => {
	const id = isValidObjectId(commentId);
	const projectsCollection = await projects();
	const comment = await projectsCollection.findOne({
		comments: { $elemMatch: { _id: ObjectId(id) } },
	});
	if (!comment) throw notFoundErr('No comment found for the provided id');
	return comment;
};

// checks if the user is either project owner or comment owner
const iscommentOwner = async (projectParam, commentParam, userParam) => {
	let isOwner = false;
	const projectId = isValidObjectId(projectParam);
	const commentId = isValidObjectId(commentParam);
	const userId = isValidObjectId(userParam.toString());
	const projectFind = await getProjectById(projectId);
	if (projectFind.owner._id.toString() === userId) {
		isOwner = true;
		return isOwner;
	}
	const commentsArray = projectFind.comments;
	commentsArray.forEach((comment) => {
		if (comment._id.toString() === commentId) {
			if (comment.owner._id.toString() === userId) {
				isOwner = true;
			}
		}
	});
	if (!isOwner)
		throw forbiddenErr("You are not authorized to delete other user's comment");
	return isOwner;
};

const createComment = async (commentParam, user) => {
	let { comment, projectId } = commentParam;
	comment = isValidStr(comment, 'Comment');
	projectId = isValidObjectId(projectId);
	const projectCollection = await projects();
	const projectFind = await getProjectById(projectId);
	const commentDate = new Date();
	const commentObject = {
		_id: ObjectId(),
		comment,
		createdAt: commentDate,
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
	const userId = ObjectId(isValidObjectId(user._id));
	const projectCollection = await projects();
	await getProjectById(projectId);
	await getCommentById(commentId);
	await iscommentOwner(projectId, commentId, userId);
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
	return projectId.comments;
};

module.exports = {
	getCommentById,
	createComment,
	removeComment,
};
