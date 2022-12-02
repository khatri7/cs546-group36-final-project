const express = require('express');
const ideasData = require('../data/ideas');
const { successStatusCodes, badRequestErr } = require('../utils');
const { authenticateToken } = require('../middleware/auth');
const {
	isValidIdeaName,
	isValidStatus,
	isValidLookingFor,
} = require('../utils/ideas');
const { isValidTechnologies } = require('../utils/projects');
const {
	sendErrResp,
	isValidArray,
	isValidStr,
	isValidObjectId,
} = require('../utils');
const { isValidUsername } = require('../utils/users');

const router = express.Router();

router.route('/').post(authenticateToken, async (req, res) => {
	const { user } = req;
	let { name, description, media, lookingFor, status, technologies } = req.body;
	try {
		user._id = isValidObjectId(user._id);
		user.username = isValidUsername(user.username);
		name = isValidIdeaName(name);
		description = req.body.description
			? isValidStr(req.body.description, 'idea description')
			: null;
		media = isValidArray(media, 'media', 'min', 1);
		technologies = isValidTechnologies(technologies);
		lookingFor = isValidLookingFor(lookingFor);
		status = isValidStatus(status);

		const ideaObject = {
			name,
			description,
			media,
			lookingFor,
			status,
			technologies,
		};
		const idea = await ideasData.createIdea(ideaObject, user);
		res.status(successStatusCodes.CREATED).json({
			idea,
		});
	} catch (e) {
		sendErrResp(res, e);
	}
});

router.route('/:ideaId/likes').post(authenticateToken, async (req, res) => {
	const { user } = req;
	try {
		user._id = isValidObjectId(user._id);
		user.username = isValidUsername(user.username);
		const ideaId = isValidObjectId(req.params.ideaId);
		const getIdea = await ideasData.getIdeaById(ideaId);
		if (!getIdea) throw badRequestErr('Could not find any idea with the id');
		const likeIdeaInfo = await ideasData.likeIdea(ideaId, user);
		res.status(successStatusCodes.CREATED).json({
			likeIdeaInfo,
		});
	} catch (e) {
		sendErrResp(res, e);
	}
});

router.route('/:ideaId/likes').delete(authenticateToken, async (req, res) => {
	const { user } = req;
	try {
		user._id = isValidObjectId(user._id);
		user.username = isValidUsername(user.username);
		const ideaId = isValidObjectId(req.params.ideaId);
		const getIdea = await ideasData.getIdeaById(ideaId);
		if (!getIdea) throw badRequestErr('Could not find any idea with the id');
		const unlikeIdeaInfo = await ideasData.unlikeIdea(ideaId, user);
		res.status(successStatusCodes.DELETED).json({
			unlikeIdeaInfo,
		});
	} catch (e) {
		sendErrResp(res, e);
	}
});

module.exports = router;
