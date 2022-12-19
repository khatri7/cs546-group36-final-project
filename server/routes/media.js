const express = require('express');
const xss = require('xss');
const { authenticateToken } = require('../middleware/auth');
const {
	badRequestErr,
	sendErrResp,
	isValidObjectId,
	successStatusCodes,
	isValidFile,
} = require('../utils');
const {
	getProjectById,
	removeProjectMedia,
	updateProjectImages,
} = require('../data/projects');
const {
	getUserById,
	udpateResume,
	udpateAvatar,
	removeUserMedia,
} = require('../data/users');
const uploadMedia = require('../middleware/uploadMedia');
const { isValidUsername } = require('../utils/users');

const router = express.Router();

router
	.route('/')
	.post(authenticateToken, uploadMedia, async (req, res) => {
		try {
			isValidFile(req.file, xss(req.body.mediaType.trim()));
			const currentUser = {
				_id: isValidObjectId(xss(req.user._id)),
				username: isValidUsername(xss(req.user.username)),
			};
			if (req.body.mediaType.trim() === 'resume') {
				const userId = isValidObjectId(xss(req.body.userId));
				await getUserById(userId);
				const updatedUser = await udpateResume(userId, currentUser, req.file);
				res.status(successStatusCodes.CREATED).json({ user: updatedUser });
			} else if (req.body.mediaType.trim() === 'image') {
				const projectId = isValidObjectId(xss(req.body.projectId));
				await getProjectById(projectId);
				if (!['0', '1', '2', '3', '4'].includes(xss(req.body.imagePos.trim())))
					throw badRequestErr('Invalid image position');
				const updatedProject = await updateProjectImages(
					projectId,
					currentUser,
					req.file,
					xss(req.body.imagePos.trim())
				);
				res
					.status(successStatusCodes.CREATED)
					.json({ project: updatedProject });
			} else if (req.body.mediaType.trim() === 'avatar') {
				const userId = isValidObjectId(xss(req.body.userId));
				await getUserById(userId);
				const updatedUser = await udpateAvatar(userId, currentUser, req.file);
				res.status(successStatusCodes.CREATED).json({ user: updatedUser });
			} else {
				throw badRequestErr(
					'Invald Entry, mediaType needs to be of resume, avatar, or image'
				);
			}
		} catch (e) {
			sendErrResp(res, e);
		}
	})
	.delete(authenticateToken, async (req, res) => {
		try {
			const currentUser = {
				_id: isValidObjectId(xss(req.user._id)),
				username: isValidUsername(xss(req.user.username)),
			};
			if (['resume', 'avatar'].includes(xss(req.body.mediaType.trim()))) {
				const userId = isValidObjectId(xss(req.body.userId));
				await getUserById(userId);
				const updatedUser = await removeUserMedia(
					userId,
					currentUser,
					xss(req.body.mediaType.trim())
				);
				res.status(successStatusCodes.OK).json({
					user: updatedUser,
				});
			} else if (xss(req.body.mediaType.trim()) === 'image') {
				const projectId = isValidObjectId(xss(req.body.projectId));
				await getProjectById(projectId);
				const { imagePos } = req.body;
				if (![0, 1, 2, 3, 4].includes(imagePos))
					throw badRequestErr('Invalid image position');
				const project = await removeProjectMedia(
					projectId,
					parseInt(xss(imagePos.toString()), 10),
					currentUser
				);
				res.status(successStatusCodes.OK).json({ project });
			} else {
				throw badRequestErr(
					'Invald Entry, mediaType needs to be of resume, avatar, or image'
				);
			}
		} catch (e) {
			sendErrResp(res, e);
		}
	});

module.exports = router;
