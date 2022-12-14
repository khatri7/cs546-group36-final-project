const express = require('express');
const xss = require('xss');
const ideasData = require('../data/ideas');
const { successStatusCodes, badRequestErr } = require('../utils');
const { authenticateToken } = require('../middleware/auth');
const {
	isValidIdeaName,
	isValidStatus,
	isValidLookingFor,
} = require('../utils/ideas');
const {
	isValidTechnologies,
	isValidQueryParamTechnologies,
} = require('../utils/projects');
const { sendErrResp, isValidStr, isValidObjectId } = require('../utils');
const { isValidUsername } = require('../utils/users');

const router = express.Router();

router
	.route('/')
	.post(authenticateToken, async (req, res) => {
		const { user } = req;
		let { name, description, lookingFor, technologies } = req.body;
		try {
			user._id = isValidObjectId(xss(user._id));
			user.username = isValidUsername(xss(user.username));
			name = isValidIdeaName(xss(name));
			description = isValidStr(
				xss(req.body.description),
				'idea description',
				'min',
				10
			);
			lookingFor = isValidLookingFor(parseInt(xss(lookingFor), 10));
			// xss checks for technologies done in isValidTechnologies()
			technologies = isValidTechnologies(technologies);

			const ideaObject = {
				name,
				description,
				lookingFor,
				status: 'active',
				technologies,
			};

			const idea = await ideasData.createIdea(ideaObject, user);

			res.status(successStatusCodes.CREATED).json({
				idea,
			});
		} catch (e) {
			sendErrResp(res, e);
		}
	})
	.get(async (req, res) => {
		try {
			let { technologies, name, status } = req.query;
			// xss checks for technologies done in isValidQueryParamTechnologies()
			technologies = xss(technologies?.trim() ?? '');
			name = xss(name?.trim() ?? '');
			if (technologies && technologies.length > 0)
				technologies = isValidQueryParamTechnologies(technologies);
			if (name && name.length > 0)
				name = isValidStr(name, 'ideas name query param', 'min', 1);
			if (status && status.length > 0) {
				status = isValidStatus(xss(status));
			}
			const ideas = await ideasData.getAllIdeas({
				name,
				technologies,
				status,
			});
			res.json({ ideas });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

router
	.route('/:ideaId')
	.get(async (req, res) => {
		try {
			const ideaId = isValidObjectId(xss(req.params.ideaId));
			const idea = await ideasData.getIdeaById(ideaId);
			res.json({
				idea,
			});
		} catch (e) {
			sendErrResp(res, e);
		}
	})
	.put(authenticateToken, async (req, res) => {
		try {
			const { user } = req;
			user._id = isValidObjectId(xss(user._id));
			user.username = isValidUsername(xss(user.username));

			const ideaId = isValidObjectId(xss(req.params.ideaId));
			await ideasData.getIdeaById(ideaId);

			let { name, description, status, lookingFor, technologies } = req.body;

			name = isValidIdeaName(xss(name));
			description = isValidStr(
				xss(req.body.description),
				'idea description',
				'min',
				10
			);
			lookingFor = isValidLookingFor(parseInt(xss(lookingFor), 10));
			status = isValidStatus(xss(status));
			// xss checks for technologies done in isValidTechnologies()
			technologies = isValidTechnologies(technologies);

			const idea = await ideasData.updateIdea(
				{ name, description, status, lookingFor, technologies },
				ideaId,
				user
			);
			res.status(successStatusCodes.OK).json({
				idea,
				message: 'Idea updated successfully',
			});
		} catch (e) {
			sendErrResp(res, e);
		}
	})
	.delete(authenticateToken, async (req, res) => {
		try {
			const { user } = req;
			user._id = isValidObjectId(xss(user._id));
			user.username = isValidUsername(xss(user.username));

			const ideaId = isValidObjectId(xss(req.params.ideaId));
			await ideasData.getIdeaById(ideaId);

			const status = await ideasData.removeIdea(ideaId, user);

			res.status(successStatusCodes.DELETED).json({
				status,
			});
		} catch (e) {
			sendErrResp(res, e);
		}
	});

router
	.route('/:ideaId/likes')
	.post(authenticateToken, async (req, res) => {
		const { user } = req;
		try {
			user._id = isValidObjectId(xss(user._id));
			user.username = isValidUsername(xss(user.username));

			const ideaId = isValidObjectId(xss(req.params.ideaId));
			const getIdea = await ideasData.getIdeaById(ideaId);
			if (!getIdea) throw badRequestErr('Could not find any idea with the id');
			const likeIdeaInfo = await ideasData.likeIdea(ideaId, user);

			res.status(successStatusCodes.CREATED).json({
				likes: likeIdeaInfo,
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

			const ideaId = isValidObjectId(xss(req.params.ideaId));
			const getIdea = await ideasData.getIdeaById(ideaId);
			if (!getIdea) throw badRequestErr('Could not find any idea with the id');
			const unlikeIdeaInfo = await ideasData.unlikeIdea(ideaId, user);

			res.status(successStatusCodes.OK).json({
				likes: unlikeIdeaInfo,
			});
		} catch (e) {
			sendErrResp(res, e);
		}
	});

router.route('/:ideaId/comments').post(authenticateToken, async (req, res) => {
	const { user } = req;
	let { comment } = req.body;

	try {
		user._id = isValidObjectId(xss(user._id));
		user.username = isValidUsername(xss(user.username));

		const ideaId = isValidObjectId(xss(req.params.ideaId));
		await ideasData.getIdeaById(ideaId);

		comment = isValidStr(xss(req.body.comment), 'Comment');
		const commentObject = {
			comment,
			ideaId,
		};

		const newComment = await ideasData.createComment(commentObject, user);
		res.status(successStatusCodes.CREATED).json({
			comment: newComment,
		});
	} catch (e) {
		sendErrResp(res, e);
	}
});

router
	.route('/:ideaId/comments/:commentId')
	.delete(authenticateToken, async (req, res) => {
		try {
			const { user } = req;
			user._id = isValidObjectId(xss(user._id));
			user.username = isValidUsername(xss(user.username));

			const ideaId = isValidObjectId(xss(req.params.ideaId));
			const commentId = isValidObjectId(xss(req.params.commentId));

			const ideaObj = await ideasData.getIdeaById(ideaId);
			if (!ideaObj) throw badRequestErr('Could not find any idea with the id');

			const idObj = {
				ideaId,
				commentId,
			};

			const comments = await ideasData.removeIdeaComment(ideaObj, idObj);
			res.status(successStatusCodes.OK).json({
				comments,
			});
		} catch (e) {
			sendErrResp(res, e);
		}
	});

module.exports = router;
