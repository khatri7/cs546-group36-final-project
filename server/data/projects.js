const { projects } = require('../config/mongoCollections');
const jwt = require('jsonwebtoken');
const {
	internalServerErr,
	isValidArray,
	isValidObj,
	isValidStr,
} = require('../utils');
const {
	isValidProjectObject,
	isValidProjectName,
} = require('../utils/projects');

// require project utils

const createProject = async (projectObj, user) => {
	const userInfo = user;
	// name,description,github,media,technologies,owner,comments,likes
	const {
		name,
		description,
		github,
		media,
		technologies,
		owner,
		comments,
		likes,
	} = projectObj;
	try {
		// Make validations correct with the parameters sent
		// For now.. make changes for function parameters
		projectObj = isValidProjectObject(projectObj);
		name = isValidProjectName(name);
		description = isValidStr(description);
		github = isValidStr(github);
		media = isValidArray(media);
		technologies = isValidArray(technologies);
		owner = isValidObj(owner);
		comments = isValidArray(comments);
		likes = isValidArray(likes);
	} catch (e) {
		res.json({ error: e });
		return;
	}
	// Validations for the userInfo from JWT
	// Need to check it once again
	try {
		if (userInfo._id !== owner._id) {
			throw 'Not an authenticated user';
		}
	} catch (e) {
		res.json({ error: e });
		return;
	}

	const date = new Date();
	const projectCollection = await projects();
	const createProjectObject = {
		name: name,
		description: description,
		github: github,
		media: [],
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
