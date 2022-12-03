// ======================================================================
const express = require('express');
const router = express.Router();

const ideasData = require('../data/ideas');

const { successStatusCodes, badRequestErr } = require('../utils');
const { authenticateToken } = require('../middleware/auth');
const { isValidIdeaName, isValidStatus, isValidLookingFor } = require('../utils/ideas');
const { isValidTechnologies } = require('../utils/projects');
const { sendErrResp, isValidStr, isValidObjectId } = require('../utils');
const { isValidUsername } = require('../utils/users');


// Create a new Idea
// ======================================================================
router
	.route('/')
	.post(authenticateToken, async (request, response) => {
		const { user } = request;
		let { name, description, lookingFor, status, technologies } = request.body;
		try {
			// User Validation
			user._id = isValidObjectId(user._id);
			user.username = isValidUsername(user.username);

			// Name Validation
			name = isValidIdeaName(name);

			// Description Validation
			description = request.body.description
				? isValidStr(request.body.description, 'idea description')
				: null;

			// LookingFor Validation
			lookingFor = isValidLookingFor(lookingFor);

			// Status Validation
			status = isValidStatus(status);

			// Technologies Validation
			technologies = isValidTechnologies(technologies);

			const ideaObject = {
				name,
				description,
				lookingFor,
				status,
				technologies,
			};

			const idea = await ideasData.createIdea(ideaObject, user);

			response
				.status(successStatusCodes.CREATED)
				.json({
					idea
				});

		} catch (e) {
			sendErrResp(response, e);
		}
	});


// Update & Delete an Idea
// ======================================================================
router
	.route('/:ideaId')
	.get(async (request, response) => {
		try {
			const ideaId = isValidObjectId(request.params.ideaId);
			const ideas = await ideasData.getIdeaById(ideaId);
			response
				.json({
					ideas,
				});
		} catch (e) {
			sendErrResp(response, e);
		}
	})
	.put(authenticateToken, async (request, response) => {
		try {
			// User Validation
			const { user } = request;
			user._id = isValidObjectId(user._id);
			user.username = isValidUsername(user.username);

			// Idea ID Validation
			const ideaId = isValidObjectId(request.params.ideaId);
			await ideasData.getIdeaById(ideaId);

			let { name, description, status, lookingFor, technologies } = request.body;

			// Name Validation
			name = isValidIdeaName(name);

			// Description Validation
			description = request.body.description
				? isValidStr(request.body.description, 'idea description')
				: null;

			// LookingFor Validation
			lookingFor = isValidLookingFor(lookingFor);

			// Status Validation
			status = isValidStatus(status);

			// Technologies Validation
			technologies = isValidTechnologies(technologies);

			const idea = await ideasData.updateIdea(
				{ name, description, status, lookingFor, technologies },
				ideaId,
				user
			);

			response
				.status(successStatusCodes.OK)
				.json({
					idea,
					message: 'Idea updated successfully'
				});

		} catch (e) {
			console.log(e);
			sendErrResp(response, e);
		}
	})
	.delete(authenticateToken, async (request, response) => {
		try {
			const { user } = request;
			user._id = isValidObjectId(user._id);
			user.username = isValidUsername(user.username);

			const ideaId = isValidObjectId(request.params.ideaId);
			await ideasData.getIdeaById(ideaId);

			const status = await ideasData.removeIdea(ideaId, user);

			response
				.status(successStatusCodes.DELETED)
				.json({
					status,
				});

		} catch (e) {
			sendErrResp(response, e);
		}
	});



// Like / Dislike an Idea
// ======================================================================
router
	.route('/:ideaId/likes')
	.post(authenticateToken, async (request, response) => {
		const { user } = request;
		try {
			user._id = isValidObjectId(user._id);
			user.username = isValidUsername(user.username);

			const ideaId = isValidObjectId(request.params.ideaId);
			const getIdea = await ideasData.getIdeaById(ideaId);
			if (!getIdea) throw badRequestErr('Could not find any idea with the id');
			const likeIdeaInfo = await ideasData.likeIdea(ideaId, user);

			response
				.status(successStatusCodes.CREATED)
				.json({
					likeIdeaInfo,
				});

		} catch (e) {
			sendErrResp(response, e);
		}
	})
	.delete(authenticateToken, async (request, response) => {
		const { user } = request;
		try {
			user._id = isValidObjectId(user._id);
			user.username = isValidUsername(user.username);

			const ideaId = isValidObjectId(request.params.ideaId);
			const getIdea = await ideasData.getIdeaById(ideaId);
			if (!getIdea) throw badRequestErr('Could not find any idea with the id');
			const unlikeIdeaInfo = await ideasData.unlikeIdea(ideaId, user);

			response
				.status(successStatusCodes.DELETED)
				.json({
					unlikeIdeaInfo,
				});

		} catch (e) {
			sendErrResp(response, e);
		}
	});



// Create a new Comment for a given Idea
// ======================================================================
router
	.route('/:ideaId/comments')
	.post(authenticateToken, async (request, response) => {
		const { user } = request;
		let { comment } = request.body;

		try {
			user._id = isValidObjectId(user._id);
			user.username = isValidUsername(user.username);

			const ideaId = isValidObjectId(request.params.ideaId);
			await ideasData.getIdeaById(ideaId);

			comment = isValidStr(request.body.comment, 'Comment');
			const commentObject = {
				comment,
				ideaId
			};

			const comments = await ideasData.createComment(commentObject, user);

			response
				.status(successStatusCodes.CREATED)
				.json({
					comments
				});

		} catch (e) {
			sendErrResp(response, e);
		}
	});


// Delete the given Comment for a given Idea
// ======================================================================
router
	.route('/:ideaId/comments/:commentId')
	.delete(authenticateToken, async (request, response) => {
		try {
			const { user } = request;
			user._id = isValidObjectId(user._id);
			user.username = isValidUsername(user.username);

			const ideaId = isValidObjectId(request.params.ideaId);
			const commentId = isValidObjectId(request.params.commentId);

			const ideaObj = await ideasData.getIdeaById(ideaId);
			if (!ideaObj) throw badRequestErr('Could not find any idea with the id');

			const removeResp = await ideasData.removeIdeaComment(ideaObj, ideaId, commentId);
			response
				.status(successStatusCodes.DELETED)
				.json({
					removeResp
				});

		} catch (e) {
			sendErrResp(response, e);
		}
	});


// ======================================================================
module.exports = router;
