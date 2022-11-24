const express = require('express');
const { commentsData } = require('../data');
const { sendErrResp, isValidStr, isValidObjectId } = require('../utils');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router
	.route('/:projectId/comments')
	.post(authenticateToken, async (req, res) => {
		const { user } = req;
		let { comment } = req.body;
		try {
			comment = isValidStr(req.body.comment, 'Comment');
			projectId = req.params.projectId;

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
