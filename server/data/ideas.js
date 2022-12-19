const { ObjectId } = require('mongodb');
const { ideas } = require('../config/mongoCollections');
const { isValidObjectId, isValidStr } = require('../utils');
const { isValidProjectName } = require('../utils/projects');
const { isValidUsername } = require('../utils/users');
const {
	isValidTechnologies,
	isValidQueryParamTechnologies,
} = require('../utils/projects');
const {
	internalServerErr,
	badRequestErr,
	forbiddenErr,
	notFoundErr,
} = require('../utils/index');
const {
	isValidIdeaName,
	isValidStatus,
	isValidLookingFor,
	checkUserAccess,
	getAllComments,
} = require('../utils/ideas');

const getAllIdeas = async (
	options = {
		name: '',
		technologies: '',
		status: '',
	}
) => {
	const { name, technologies, status } = options;
	const ideasCollection = await ideas();
	const query = {};
	if (name && name.trim().length > 0 && isValidIdeaName(name))
		query.name = { $regex: name.trim(), $options: 'i' };
	if (technologies && technologies.trim().length > 0) {
		const technologiesArr =
			isValidQueryParamTechnologies(technologies).split(',');
		query.technologies = { $all: technologiesArr };
	}
	if (status) {
		const ideaStatus = isValidStatus(status);
		query.status = { $eq: ideaStatus };
	}
	const allIdeas = await ideasCollection.find(query).toArray();
	allIdeas.sort((a, b) => b.likes.length - a.likes.length);
	return allIdeas;
};

const getIdeaById = async (idParam) => {
	const id = isValidObjectId(idParam);

	const ideasCollection = await ideas();

	const idea = await ideasCollection.findOne({ _id: ObjectId(id) });
	if (!idea) throw notFoundErr('No Idea found for the provided id');

	return idea;
};

const createIdea = async (ideasObjectParam, user) => {
	const userInfo = user;

	userInfo._id = ObjectId(isValidObjectId(userInfo._id));
	userInfo.username = isValidUsername(userInfo.username);

	const ideasCollection = await ideas();

	let { name, description, technologies, lookingFor, status } =
		ideasObjectParam;

	name = isValidIdeaName(name);
	description = isValidStr(
		ideasObjectParam.description,
		'idea description',
		'min',
		10
	);
	technologies = isValidTechnologies(technologies);
	lookingFor = isValidLookingFor(lookingFor);
	status = isValidStatus(status);

	const createIdeaObject = {
		name,
		description,
		status,
		lookingFor,
		createdAt: new Date(),
		technologies,
		owner: userInfo,
		comments: [],
		likes: [],
	};

	const createIdeaAcknowledgement = await ideasCollection.insertOne(
		createIdeaObject
	);
	if (
		!createIdeaAcknowledgement?.acknowledged ||
		!createIdeaAcknowledgement?.insertedId
	)
		throw internalServerErr('Could not create idea. Please try again');
	const createdIdea = await getIdeaById(
		createIdeaAcknowledgement.insertedId.toString()
	);

	return createdIdea;
};

const removeIdea = async (id, user) => {
	const ideaId = isValidObjectId(id);
	const idCheck = await getIdeaById(ideaId);

	const userInfo = user;
	userInfo.name = isValidUsername(userInfo.username);
	userInfo._id = isValidObjectId(userInfo._id);

	if (!checkUserAccess(user, idCheck.owner))
		throw forbiddenErr('Not Authorized to update this Idea. Not Idea Owner');

	const ideasCollection = await ideas();

	const removedInfo = await ideasCollection.deleteOne({
		_id: ObjectId(ideaId),
	});
	if (!removedInfo.acknowledged || !removedInfo.deletedCount) {
		throw internalServerErr('Could not remove the Idea. Please try again.');
	}

	return ideaId;
};

const updateIdea = async (ideaObj, id, user) => {
	const ideaId = isValidObjectId(id);

	const ideaCheck = await getIdeaById(ideaId);

	const userInfo = user;
	userInfo._id = isValidObjectId(userInfo._id);
	userInfo.name = isValidUsername(userInfo.username);
	if (!checkUserAccess(userInfo, ideaCheck.owner))
		throw forbiddenErr(
			`Not Authorized to update this project. Not Project Owner`
		);

	let { name, description, status, lookingFor, technologies } = ideaObj;

	name = isValidProjectName(name);
	description = isValidStr(ideaObj.description, 'idea description', 'min', 10);
	status = isValidStatus(status);
	lookingFor = isValidLookingFor(lookingFor);
	technologies = isValidTechnologies(technologies);

	delete ideaCheck._id;

	const updateidea = {
		...ideaCheck,
		name,
		description,
		status,
		lookingFor,
		technologies,
		updatedAt: new Date(),
	};
	const ideasCollection = await ideas();
	const updateInfo = await ideasCollection.updateOne(
		{ _id: ObjectId(ideaId) },
		{ $set: updateidea }
	);
	if (!updateInfo.acknowledged || !updateInfo.modifiedCount)
		throw internalServerErr('Could not update the Idea. Please try again.');

	const idea = await getIdeaById(ideaId);

	return idea;
};

const likeIdea = async (ideasObjectParam, user) => {
	const userId = isValidObjectId(user._id);
	isValidUsername(user.username);

	const likeIdeaId = isValidObjectId(ideasObjectParam);
	const ideasCollection = await ideas();
	const getIdeaInfo = await getIdeaById(likeIdeaId);
	const likedUsers = getIdeaInfo.likes;

	if (!likedUsers.toString().includes(userId)) {
		getIdeaInfo.likes.push(ObjectId(userId));
		const likeIdeaAcknowledgment = await ideasCollection.updateOne(
			{ _id: ObjectId(likeIdeaId) },
			{ $set: { likes: getIdeaInfo.likes } }
		);
		if (
			!likeIdeaAcknowledgment.acknowledged ||
			!likeIdeaAcknowledgment.modifiedCount
		)
			throw internalServerErr('Could not like the idea. Please try again.');
	} else throw badRequestErr('Idea already liked.');

	const getUpdatedIdea = await getIdeaById(likeIdeaId);

	return getUpdatedIdea.likes;
};

const unlikeIdea = async (ideasObjectParam, user) => {
	const userId = isValidObjectId(user._id);
	isValidUsername(user.username);

	const ideaId = isValidObjectId(ideasObjectParam);
	const ideasCollection = await ideas();
	const getIdeaInfo = await getIdeaById(ideaId);
	const likedUsers = getIdeaInfo.likes;

	if (likedUsers.toString().includes(userId)) {
		const unlikeIdeaAcknowledgment = await ideasCollection.updateOne(
			{ _id: ObjectId(ideaId) },
			{ $pull: { likes: ObjectId(userId) } }
		);
		if (
			!unlikeIdeaAcknowledgment.acknowledged ||
			!unlikeIdeaAcknowledgment.modifiedCount
		)
			throw internalServerErr('Could not unlike the idea. Please try again.');
	} else throw badRequestErr('Idea already unliked.');

	const getUpdatedIdea = await getIdeaById(ideaId);

	return getUpdatedIdea.likes;
};

const createComment = async (commentParam, user) => {
	let { comment, ideaId } = commentParam;
	comment = isValidStr(comment, 'Comment');
	ideaId = isValidObjectId(ideaId);

	const ideasCollection = await ideas();
	const ideaFind = await getIdeaById(ideaId);

	const commentObj = {
		_id: ObjectId(),
		comment,
		createdAt: new Date(),
		owner: user,
	};

	const commentAck = await ideasCollection.updateOne(
		{ _id: ideaFind._id },
		{ $push: { comments: commentObj } }
	);
	if (!commentAck.acknowledged || !commentAck.modifiedCount) {
		throw internalServerErr('Could not upload the comment. Please try again');
	}

	return commentObj;
};

const removeIdeaComment = async (ideaObj, idObj) => {
	let { ideaId, commentId } = idObj;
	ideaId = isValidObjectId(ideaId);
	commentId = isValidObjectId(commentId);

	const ideasCollection = await ideas();
	const commentsList = getAllComments(ideaObj.comments);

	if (commentsList.toString().includes(commentId)) {
		const removeIdeaCommAck = await ideasCollection.updateOne(
			{ _id: ObjectId(ideaId) },
			{ $pull: { comments: { _id: ObjectId(commentId) } } }
		);
		if (!removeIdeaCommAck.acknowledged || !removeIdeaCommAck.modifiedCount) {
			throw internalServerErr(
				'Could not remove the Idea Comment. Please try again.'
			);
		}
	} else {
		throw badRequestErr('Idea Comment already removed or did not exist.');
	}

	const getUpdatedIdea = await getIdeaById(ideaId);

	return getUpdatedIdea.comments;
};

module.exports = {
	getIdeaById,
	createIdea,
	removeIdea,
	updateIdea,
	likeIdea,
	unlikeIdea,
	createComment,
	removeIdeaComment,
	getAllIdeas,
};
