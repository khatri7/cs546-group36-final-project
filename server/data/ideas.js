const { ObjectId } = require('mongodb');
const { ideas } = require('../config/mongoCollections');
const { isValidObjectId, isValidArray, isValidStr } = require('../utils');
const { isValidLookingFor, isValidStatus } = require('../utils/ideas');
const { isValidProjectName } = require('../utils/projects');
const { isValidUsername } = require('../utils/users');
const { isValidTechnologies } = require('../utils/projects');

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
	// once get idea route is done we can call getIdea() and return it.
	return createIdeaAcknowledgement;
};

module.exports = {
	createIdea,
};
