const express = require('express');
const projectsData = require('../data/projects');
const {
	sendErrResp,
	isValidArray,
	isValidStr,
	isValidObjectId,
} = require('../utils');
const {
	isValidProjectName,
	isValidGithub,
	isValidQueryParamTechnologies,
} = require('../utils/projects');
const { authenticateToken } = require('../middleware/auth');
const { commentsData } = require('../data');
const { isValidUsername } = require('../utils/users');
const technologyTags = require('../utils/data/technologies');

const router = express.Router();

router
	.route('/')
	.post(authenticateToken, async (req, res) => {
		const { user } = req;
		let { name, description, github, media, technologies, deploymentLink } =
			req.body;
		try {
			name = isValidProjectName(name);
			description = req.body.description
				? isValidStr(req.body.description, 'project description')
				: null;
			github = req.body.github ? isValidGithub(req.body.github) : null;
			media = isValidArray(media, 'media', 'min', 1);
			technologies = isValidArray(technologies, 'technologies', 'min', 1);
			deploymentLink = req.body.deploymentLink
				? isValidStr(req.body.deploymentLink, 'project deployment link')
				: null;

			const projectObject = {
				name,
				description,
				github,
				media,
				technologies,
				deploymentLink,
			};
			const project = await projectsData.createProject(projectObject, user);
			res.json({ project });
		} catch (e) {
			sendErrResp(res, e);
		}
	})
	.get(async (req, res) => {
		try {
			let { technologies, name } = req.query;
			technologies = technologies?.trim() ?? '';
			name = name?.trim() ?? '';
			if (technologies && technologies.length > 0)
				technologies = isValidQueryParamTechnologies(technologies);
			if (name && name.length > 0)
				name = isValidStr(name, 'project name query param', 'min', 1);
			const projects = await projectsData.getAllProjects({
				name,
				technologies,
			});
			res.json({ projects });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

// returns list of all technology tags
router.route('/technologies').get(async (req, res) => {
	res.json({
		technologies: technologyTags || [],
	});
});

router.route('/:projectId').get(async (req, res) => {
	try {
		const projectId = isValidObjectId(req.params.projectId);
		const project = await projectsData.getProjectById(projectId);
		res.json({ project });
	} catch (e) {
		sendErrResp(res, e);
	}
});

router
	.route('/:projectId/comments')
	.post(authenticateToken, async (req, res) => {
		const { user } = req;
		user._id = isValidObjectId(user._id);
		user.username = isValidUsername(user.username);
		let { comment } = req.body;
		try {
			comment = isValidStr(req.body.comment, 'Comment');
			projectId = isValidObjectId(req.params.projectId);
			projectId = projectId.toString();

			const commentObject = {
				comment,
				projectId,
			};
			const projectComment = await commentsData.createComment(
				commentObject,
				user
			);
			res.json({ projectComment });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

module.exports = router;
