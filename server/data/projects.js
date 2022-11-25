const { projects } = require('../config/mongoCollections');
const {
	internalServerErr,
	isValidObjectId,
	notFoundErr,
	isValidStr,
} = require('../utils');
const { isValidUsername } = require('../utils/users');
const {
	isValidProjectObject,
	isValidQueryParamTechnologies,
} = require('../utils/projects');
const { getUserByUsername } = require('./users');

const getProjectById = async (idParam) => {
	const id = isValidObjectId(idParam);
	const projectsCollection = await projects();
	const project = await projectsCollection.findOne({ _id: id });
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
	getAllProjects,
	createProject,
	getProjectsByOwnerUsername,
};
