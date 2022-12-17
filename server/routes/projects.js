const express = require('express');
const xss = require('xss');
const projectsData = require('../data/projects');
const commentsData = require('../data/comments');
const bookmarksData = require('../data/bookmarks');
const { successStatusCodes } = require('../utils');

const { sendErrResp, isValidStr, isValidObjectId } = require('../utils');
const {
	isValidProjectName,
	isValidGithub,
	isValidQueryParamTechnologies,
	isValidTechnologies,
} = require('../utils/projects');
const { authenticateToken } = require('../middleware/auth');
const technologyTags = require('../utils/data/technologies');
const { isValidUsername } = require('../utils/users');

const router = express.Router();

router
	.route('/')
	.post(authenticateToken, async (req, res) => {
		const { user } = req;
		let { name, description, github, technologies, deploymentLink } = req.body;
		try {
			user._id = isValidObjectId(xss(user._id));
			user.username = isValidUsername(xss(user.username));
			name = isValidProjectName(name);
			description = xss(req.body.description)
				? isValidStr(xss(req.body.description), 'project description')
				: null;
			github = xss(req.body.github)
				? isValidGithub(xss(req.body.github))
				: null;
			// need to do xss for technologies
			technologies.map((tech) => xss(tech));
			technologies = isValidTechnologies(technologies);
			deploymentLink = xss(req.body.deploymentLink)
				? isValidStr(xss(req.body.deploymentLink), 'project deployment link')
				: null;
			const projectObject = {
				name,
				description,
				github,
				technologies,
				deploymentLink,
			};
			const project = await projectsData.createProject(projectObject, user);
			res.status(successStatusCodes.CREATED).json({
				project,
			});
		} catch (e) {
			sendErrResp(res, e);
		}
	})
	.get(async (req, res) => {
		try {
			let { technologies, name } = req.query;
			// did technology xss checks in isValidQueryParamTechnologies()
			technologies = xss(technologies)?.trim() ?? '';
			name = xss(name)?.trim() ?? '';
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
		const projectId = isValidObjectId(xss(req.params.projectId));
		const project = await projectsData.getProjectById(projectId);
		res.json({ project });
	} catch (e) {
		sendErrResp(res, e);
	}
});

router
	.route('/:project_id')
	.put(authenticateToken, async (req, res) => {
		const { user } = req;
		let { name, description, github, technologies, deploymentLink } = req.body;
		try {
			user._id = isValidObjectId(xss(user._id));
			user.username = isValidUsername(xss(user.username));
			const projectId = isValidObjectId(xss(req.params.project_id));
			await projectsData.getProjectById(projectId);
			name = isValidProjectName(xss(name));
			description = xss(req.body.description)
				? isValidStr(xss(req.body.description), 'project description')
				: null;
			github = xss(req.body.github)
				? isValidGithub(xss(req.body.github))
				: null;
			// Need to do for technologies
			technologies.map((tech) => xss(tech));
			technologies = isValidTechnologies(technologies);
			deploymentLink = xss(req.body.deploymentLink)
				? isValidStr(xss(req.body.deploymentLink), 'project deployment link')
				: null;
			const projectObject = {
				name,
				description,
				github,
				technologies,
				deploymentLink,
			};
			const project = await projectsData.updateProject(
				projectObject,
				projectId,
				user
			);
			res.json({ project, message: 'Project udpated successfully' });
		} catch (e) {
			sendErrResp(res, e);
		}
	})
	.delete(authenticateToken, async (req, res) => {
		try {
			const { user } = req;
			user._id = isValidObjectId(xss(user._id));
			user.username = isValidUsername(xss(user.username));
			const projectId = isValidObjectId(xss(req.params.project_id));
			await projectsData.getProjectById(projectId);
			const status = await projectsData.removeProject(projectId, user);
			res.status(successStatusCodes.DELETED).json({
				status,
			});
		} catch (e) {
			sendErrResp(res, e);
		}
	});

router
	.route('/:projectId/comments')
	.post(authenticateToken, async (req, res) => {
		const { user } = req;
		let { comment } = req.body;
		try {
			user._id = isValidObjectId(xss(user._id));
			user.username = isValidUsername(xss(user.username));
			const projectId = isValidObjectId(xss(req.params.projectId));
			await projectsData.getProjectById(projectId);
			comment = isValidStr(xss(req.body.comment), 'Comment');
			const commentObject = {
				comment,
				projectId,
			};
			const projectComment = await commentsData.createComment(
				commentObject,
				user
			);
			res.status(successStatusCodes.CREATED).json({
				comment: projectComment,
			});
		} catch (e) {
			sendErrResp(res, e);
		}
	});
router.route('/:projectId/likes').post(authenticateToken, async (req, res) => {
	const { user } = req;
	try {
		user._id = isValidObjectId(xss(user._id));
		user.username = isValidUsername(xss(user.username));
		const projectId = isValidObjectId(xss(req.params.projectId));
		const likeProjectInfo = await projectsData.likeProject(user, projectId);
		res.status(successStatusCodes.CREATED).json({
			likes: likeProjectInfo,
		});
	} catch (e) {
		sendErrResp(res, e);
	}
});
router
	.route('/:projectId/likes')
	.delete(authenticateToken, async (req, res) => {
		const { user } = req;
		try {
			user._id = isValidObjectId(xss(user._id));
			user.username = isValidUsername(xss(user.username));
			const projectId = isValidObjectId(xss(req.params.projectId));
			const unlikeProjectInfo = await projectsData.unlikeProject(
				user,
				projectId
			);
			res.status(successStatusCodes.OK).json({
				likes: unlikeProjectInfo,
			});
		} catch (e) {
			sendErrResp(res, e);
		}
	});

router
	.route('/:projectId/comments/:commentId')
	.delete(authenticateToken, async (req, res) => {
		const { user } = req;
		try {
			user._id = isValidObjectId(xss(user._id));
			user.username = isValidUsername(xss(user.username));
			const projectId = isValidObjectId(xss(req.params.projectId));
			const commentId = isValidObjectId(xss(req.params.commentId));
			await projectsData.getProjectById(projectId);
			await commentsData.getCommentById(commentId);
			const commentObject = {
				projectId,
				commentId,
			};
			const comments = await commentsData.removeComment(commentObject, user);
			res.status(successStatusCodes.OK).json({
				comments,
			});
		} catch (e) {
			sendErrResp(res, e);
		}
	});

router
	.route('/:projectId/bookmark')
	.post(authenticateToken, async (req, res) => {
		const { user } = req;
		try {
			user._id = isValidObjectId(xss(user._id));
			user.username = isValidUsername(xss(user.username));
			const projectId = isValidObjectId(xss(req.params.projectId));
			await projectsData.getProjectById(projectId);
			const bookmarkedUsers = await bookmarksData.addBookmark(projectId, user);
			res.status(successStatusCodes.CREATED).json({
				savedBy: bookmarkedUsers,
			});
		} catch (e) {
			sendErrResp(res, e);
		}
	})
	.delete(authenticateToken, async (req, res) => {
		const { user } = req;
		try {
			user._id = isValidObjectId(xss(user._id));
			user.username = isValidUsername(xss(user.username));
			const projectId = isValidObjectId(xss(req.params.projectId));
			await projectsData.getProjectById(projectId);
			const bookmarkedUsers = await bookmarksData.removeBookmark(
				projectId,
				user
			);
			res.status(successStatusCodes.OK).json({
				savedBy: bookmarkedUsers,
			});
		} catch (e) {
			sendErrResp(res, e);
		}
	});

module.exports = router;
