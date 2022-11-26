const { projects } = require('../config/mongoCollections');
const {
	internalServerErr,
	isValidObjectId,
	notFoundErr,
	isValidStr,
	forbiddenErr,
	badRequestErr,
} = require('../utils');
const { isValidUsername } = require('../utils/users');
const {
	isValidProjectObject,
	isValidQueryParamTechnologies,
	checkuseraccess,
} = require('../utils/projects');
const { getUserByUsername } = require('./users');
const { ObjectId } = require('mongodb');

const getProjectById = async (idParam) => {
	const id = isValidObjectId(idParam);
	const projectsCollection = await projects();
	const project = await projectsCollection.findOne({ _id: ObjectId(id) });
	if (!project) throw notFoundErr('No project found for the provided id');
	return project;
};

const getAllProjects = async (
	options = {
		name: '',
		technologies: '',
	}
) => {
	const { name, technologies } = options;
	const projectsCollection = await projects();
	const query = {};
	if (
		name &&
		name.trim().length > 0 &&
		isValidStr(name, 'project name query param', 'min', 1)
	)
		query.name = { $regex: name.trim(), $options: 'i' };
	if (technologies && technologies.trim().length > 0) {
		const technologiesArr =
			isValidQueryParamTechnologies(technologies).split(',');
		query.technologies = { $all: technologiesArr };
	}
	const allProjects = await projectsCollection.find(query).toArray();
	return allProjects;
};

const getProjectsByOwnerUsername = async (usernameParam) => {
	const username = isValidUsername(usernameParam);
	await getUserByUsername(username);
	const projectsCollection = await projects();
	const userProjects = await projectsCollection
		.find({
			'owner.username': username,
		})
		.toArray();
	return userProjects;
};

const createProject = async (projectObjParam, user) => {
	const userInfo = user;
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
		updatedAt: date,
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

const updateProject = async (projectObjParam, id, user) => {
	let projectCheck = await getProjectById(id);
	ownercheck = checkuseraccess(user, projectCheck.owner);
	if (!ownercheck)
		throw forbiddenErr(
			`Not Authorised to update this project. Not Project Owner`
		);
	const projectObj = isValidProjectObject(projectObjParam);
	const { name, description, github, media, technologies, deploymentLink } =
		projectObj;
	const date = new Date();
	const updateProjectObject = {
		name,
		description,
		github,
		media,
		deploymentLink,
		updatedAt: date,
		technologies,
	};

	const projectCollection = await projects();
	const updateInfo = await projectCollection.updateOne(
		{ _id: ObjectId(id) },
		{ $set: updateProjectObject }
	);
	const project = await getProjectById(id);
	if (!project) throw notFoundErr('No Project found ');

	return project;
};

const removeProject = async (id, user) => {
	let projectCheck = await getProjectById(id);
	ownercheck = checkuseraccess(user, projectCheck.owner);
	if (!ownercheck)
		throw forbiddenErr(
			`Not Authorised to update this project. Not Project Owner`
		);
	id = isValidObjectId(id);
	const projectCollection = await projects();
	const removedInfo = await projectCollection.deleteOne({ _id: ObjectId(id) });
	if (removedInfo.deletedCount == 1) {
		return true;
	} else {
		throw notFoundErr('the element is already deleted');
	}
};
module.exports = {
	removeProject,
	updateProject,
	getProjectById,
	getAllProjects,
	createProject,
	getProjectsByOwnerUsername,
};
