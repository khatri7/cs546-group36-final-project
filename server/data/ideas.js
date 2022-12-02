const { ObjectId } = require('mongodb');
const { ideas } = require('../config/mongoCollections');
const { isValidObjectId, isValidArray, isValidStr } = require('../utils');
const { isValidLookingFor, isValidStatus } = require('../utils/ideas');
const { isValidProjectName } = require('../utils/projects');
const { isValidUsername } = require('../utils/users');
const { isValidTechnologies } = require('../utils/projects');
const {
	internalServerErr,
	badRequestErr,
	notFoundErr,
} = require('../utils/index');

const getIdeaById = async (idParam) => {
	const id = isValidObjectId(idParam);
	const ideasCollection = await ideas();
	const idea = await ideasCollection.findOne({ _id: ObjectId(id) });
	if (!idea) throw notFoundErr('No project found for the provided id');
	return idea;
};

const createIdea = async (ideasObjectParam, user) => {
	const userInfo = user;
	userInfo._id = ObjectId(isValidObjectId(userInfo._id));
	userInfo.username = isValidUsername(userInfo.username);
	const ideasCollection = await ideas();
	let { name, description, media, technologies, lookingFor, status } =
		ideasObjectParam;
	name = isValidProjectName(name);
	description = ideasObjectParam.description
		? isValidStr(ideasObjectParam.description, 'idea description')
		: null;
	media = isValidArray(media, 'media', 'min', 1);
	technologies = isValidTechnologies(technologies);
	lookingFor = isValidLookingFor(lookingFor);
	status = isValidStatus(status);
	const date = new Date();
	const createIdeaObject = {
		name,
		description,
		media,
		status,
		lookingFor,
		createdAt: date,
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

module.exports = {
	createIdea,
	likeIdea,
	unlikeIdea,
	getIdeaById,
};
