const { projects } = require('../config/mongoCollections');
const jwt = require('jsonwebtoken');
const getUserData = require('./users');
const { ObjectId } = require('bson');
const {
	internalServerErr,
	isValidArray,
	isValidObj,
	isValidStr,
} = require('../utils');
const {
	isValidProjectObject,
	isValidProjectName,
	isValidUsername,
} = require('../utils/projects');

const createProject = async (projectObj, user) => {
	const userInfo = user;
	if (!ObjectId.isValid(userInfo['_id'])) throw 'Invalid user id';
	let username = isValidUsername(userInfo['name']);
	const projectCollection = await projects();
	projectObj = isValidProjectObject(projectObj);
	const { name, description, github, media, technologies, deploymentLink } =
		projectObj;
	const date = new Date();
	const createProjectObject = {
		name: name,
		description: description,
		github: github,
		media: [],
		deploymentLink: deploymentLink,
		createdAt: date,
		technologies: [],
		owner: {
			_id: userInfo._id,
			username: userInfo.name,
		},
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
		createdProject.insertedId.toString()
	);
	return createdProject;
};

module.exports = {
	createProject,
};
