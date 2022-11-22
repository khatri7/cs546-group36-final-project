const { ObjectId } = require('bson');
const express = require('express');
const projectsData = require('../data/projects');
const {
	sendErrResp,
	isValidArray,
	isValidObj,
	isValidStr,
} = require('../utils');
const { isValidProjectName, isValidGithub } = require('../utils/projects');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.route('/').post(authenticateToken, async (req, res) => {
	// add a deployment link
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
});

module.exports = router;
