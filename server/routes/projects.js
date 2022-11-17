const { ObjectId } = require('bson');
const express = require('express');
const projectsData = require('../data/projects');
const {
	sendErrResp,
	isValidArray,
	isValidObj,
	isValidStr,
} = require('../utils');
const { isValidProjectName } = require('../utils/projects');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.route('/project').post(authenticateToken, async (req, res) => {
	const { user } = req;
	const {
		name,
		description,
		github,
		media,
		technologies,
		owner,
		comments,
		likes,
	} = req.body;
	try {
		// name,description,github,media,technologies,owner,comments,likes
		// make the validations sent as parameters accurate later
		name = isValidProjectName(name);
		description = isValidStr(description);
		github = isValidStr(github);
		media = isValidArray(media);
		technologies = isValidArray(technologies);
		owner = isValidObj(owner);
		comments = isValidArray(comments);
		likes = isValidArray(likes);

		const projectObject = {
			name: name,
			description: description,
			github: github,
			media: media,
			technologies: technologies,
			owner: owner,
			comments: comments,
			likes: likes,
		};
		const project = await projectsData.createProject(projectObject, user);
		res.json({ project });
	} catch (e) {
		sendErrResp(res, e);
	}
});

module.exports = router;
