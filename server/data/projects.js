const { projects } = require('../config/mongoCollections');
const { internalServerErr, isValidObjectId, notFoundErr } = require('../utils');
const { isValidUsername } = require('../utils/users');
const { isValidProjectObject } = require('../utils/projects');

const getProjectById = async (idParam) => {
	const id = isValidObjectId(idParam);
	const usersCollection = await projects();
	const user = await usersCollection.findOne({ _id: id });
	if (!user) throw notFoundErr('No user found for the provided id');
	return user;
};

const createProject = async (projectObjParam, user) => {
	const userInfo = user;
	// eslint-disable-next-line no-underscore-dangle
	userInfo._id = isValidObjectId(userInfo._id);
	userInfo.username = isValidUsername(userInfo.username);
	const projectCollection = await projects();
	const projectObj = isValidProjectObject(projectObjParam);
	const { name, description, github, media, technologies, deploymentLink } =
		projectObj;
	const date = new Date();
	const createProjectObject = {
		name,
		description,
		github,
		media,
		deploymentLink,
		createdAt: date,
		technologies,
		owner: userInfo,
		savedBy: [],
		comments: [],
		likes: [],
	};
	const createProjectAcknowledgement = await projectCollection.insertOne(
		createProjectObject
	);
	if (
		!createProjectAcknowledgement?.acknowledged ||
		!createProjectAcknowledgement?.insertedId
	)
		throw internalServerErr('Could not create project. Please try again');
	const createdProject = await getProjectById(
		createProjectAcknowledgement.insertedId.toString()
	);
	return createdProject;
};
module.exports = {
	getProjectById,
	createProject,
};
