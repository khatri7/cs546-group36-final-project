const { ObjectId } = require('mongodb');
const { projects } = require('../config/mongoCollections');
const {
	internalServerErr,
	isValidObjectId,
	notFoundErr,
	isValidStr,
	forbiddenErr,
	unauthorizedErr,
	badRequestErr,
} = require('../utils');
const { isValidUsername } = require('../utils/users');
const {
	isValidProjectObject,
	isValidQueryParamTechnologies,
	checkuseraccess,
} = require('../utils/projects');
const { getUserByUsername } = require('./users');
const { deleteFile } = require('../utils/aws');

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
	allProjects.sort((a, b) => b.likes.length - a.likes.length);
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
	userInfo._id = ObjectId(isValidObjectId(userInfo._id));
	userInfo.username = isValidUsername(userInfo.username);
	const projectCollection = await projects();
	const projectObj = isValidProjectObject(projectObjParam);
	const { name, description, github, technologies, deploymentLink } =
		projectObj;
	const date = new Date();
	const createProjectObject = {
		name,
		description,
		github,
		media: [],
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

const likeProject = async (user, project) => {
	const userId = isValidObjectId(user._id);
	const projectId = isValidObjectId(project);
	const projectCollection = await projects();
	const getProjectInfo = await getProjectById(projectId);
	const likedUsers = getProjectInfo.likes;
	if (!likedUsers.toString().includes(userId)) {
		getProjectInfo.likes.push(ObjectId(userId));
		const likeProjectAcknowledgment = await projectCollection.updateOne(
			{ _id: ObjectId(projectId) },
			{ $set: { likes: getProjectInfo.likes } }
		);
		if (
			!likeProjectAcknowledgment.acknowledged ||
			!likeProjectAcknowledgment.modifiedCount
		)
			throw internalServerErr('Could not like the project. Please try again.');
	} else throw badRequestErr('Project already liked.');
	const getUpdatedProject = await getProjectById(projectId);
	return getUpdatedProject.likes;
};

const updateProject = async (projectObjParam, id, user) => {
	const projectObj = isValidProjectObject(projectObjParam);
	const projectId = isValidObjectId(id);
	const projectCheck = await getProjectById(projectId);
	const userInfo = user;
	userInfo.name = isValidUsername(userInfo.username);
	userInfo._id = isValidObjectId(userInfo._id);
	const ownercheck = checkuseraccess(userInfo, projectCheck.owner);
	if (!ownercheck)
		throw forbiddenErr(
			`Not Authorised to update this project. Not Project Owner`
		);
	const { name, description, github, technologies, deploymentLink } =
		projectObj;
	const date = new Date();
	delete projectCheck._id;
	const updateProjectObject = {
		...projectCheck,
		name,
		description,
		github,
		deploymentLink,
		updatedAt: date,
		technologies,
	};
	const projectCollection = await projects();
	const updateInfo = await projectCollection.updateOne(
		{ _id: ObjectId(projectId) },
		{ $set: updateProjectObject }
	);
	if (!updateInfo.acknowledged || !updateInfo.modifiedCount)
		throw internalServerErr('Could not update the project. Please try again.');
	const project = await getProjectById(id);
	return project;
};

const removeProject = async (id, user) => {
	const projectId = isValidObjectId(id);
	const projectCheck = await getProjectById(projectId);
	const userInfo = user;
	userInfo.name = isValidUsername(userInfo.username);
	userInfo._id = isValidObjectId(userInfo._id);
	const ownercheck = checkuseraccess(user, projectCheck.owner);
	if (!ownercheck)
		throw forbiddenErr(
			`Not Authorised to update this project. Not Project Owner`
		);
	const projectCollection = await projects();
	const removedInfo = await projectCollection.deleteOne({
		_id: ObjectId(projectId),
	});
	if (!removedInfo.acknowledged || !removedInfo.deletedCount)
		throw internalServerErr('Could not update the project. Please try again.');
	const removeProjectId = projectId;
	return removeProjectId;
};

const getSavedProjects = async (usernameParam, ownerParam) => {
	let savedProjects;
	const userName = isValidUsername(usernameParam);
	const loggedinId = isValidObjectId(ownerParam);
	const user = await getUserByUsername(userName);
	const userId = user._id.toString();
	if (userId === loggedinId) {
		const projectsCollection = await projects();
		savedProjects = await projectsCollection
			.find({
				savedBy: userId,
			})
			.toArray();
	} else
		throw unauthorizedErr(
			"You are not authorized to retrieve other user's saved projects"
		);
	return savedProjects;
};
const unlikeProject = async (user, project) => {
	const userId = isValidObjectId(user._id);
	const projectId = isValidObjectId(project);
	const projectCollection = await projects();
	const getProjectInfo = await getProjectById(projectId);
	const likedUsers = getProjectInfo.likes;
	if (likedUsers.toString().includes(userId)) {
		const unlikeProjectAcknowledgment = await projectCollection.updateOne(
			{ _id: ObjectId(projectId) },
			{ $pull: { likes: ObjectId(userId) } }
		);
		if (
			!unlikeProjectAcknowledgment.acknowledged ||
			!unlikeProjectAcknowledgment.modifiedCount
		)
			throw internalServerErr(
				'Could not unlike the project. Please try again.'
			);
	} else throw badRequestErr('Project already unliked.');
	const getUpdatedProject = await getProjectById(projectId);
	return getUpdatedProject.likes;
};

const updateProjectImages = async (url, pos, projectId) => {
	try {
		const project = await getProjectById(projectId);
		const imageArray = project.media;
		if (imageArray[pos]) {
			const existingPhotoKey = imageArray[pos].substr(
				imageArray[pos].indexOf('.com/') + 5
			);
			await deleteFile(existingPhotoKey);
		}
		imageArray[pos] = url;
		const projectCollection = await projects();
		const updateInfo = await projectCollection.updateOne(
			{ _id: ObjectId(projectId) },
			{ $set: { media: imageArray } }
		);
		if (!updateInfo.acknowledged)
			throw badRequestErr('Could not update the project. Please try again.');
		const updatedProject = await getProjectById(projectId);
		return updatedProject;
	} catch (e) {
		throw badRequestErr(
			'Invalid AWS request/AWS unable to process your request right now'
		);
	}
};

module.exports = {
	removeProject,
	updateProject,
	getProjectById,
	getAllProjects,
	createProject,
	getProjectsByOwnerUsername,
	likeProject,
	getSavedProjects,
	updateProjectImages,
	unlikeProject,
};
