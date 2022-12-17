const express = require('express');
const imageUpload = require('../utils/aws/image');
const avatarUpload = require('../utils/aws/avatar');
const { authenticateToken } = require('../middleware/auth');
const {
	badRequestErr,
	sendErrResp,
	isValidStr,
	isValidObjectId,
	successStatusCodes,
	isValidFile,
} = require('../utils');
const { getProjectById, removeProjectMedia } = require('../data/projects');
const { getUserById, udpateResume } = require('../data/users');
const uploadMedia = require('../middleware/uploadMedia');
const { isValidUsername } = require('../utils/users');

const router = express.Router();

router
	.route('/')
	.post(authenticateToken, uploadMedia, async (req, res) => {
		try {
			isValidFile(req.file, req.body.mediaType);
			const currentUser = {
				_id: isValidObjectId(req.user._id),
				username: isValidUsername(req.user.username),
			};
			if (req.body.mediaType === 'resume') {
				const userId = isValidObjectId(req.body.userId);
				await getUserById(userId);
				const updatedUser = await udpateResume(userId, currentUser, req.file);
				res.status(successStatusCodes.CREATED).json({ user: updatedUser });
			} else if (req.body.mediaType === 'image') {
				const projectId = isValidObjectId(req.body.projectId);
				const project = await getProjectById(projectId);
				const imagePos = isValidStr(req.body.imagePos);
				const imageUploaded = await imageUpload.images(
					req.file,
					project,
					imagePos,
					req.body.projectId
				);
				res.status(successStatusCodes.CREATED).json({ project: imageUploaded });
			} else if (req.body.mediaType === 'avatar') {
				const userId = isValidObjectId(req.body.userId);
				await getUserById(userId);
				const user = await getUserById(userId);
				const avatarUploaded = await avatarUpload.avatar(
					req.file,
					user,
					req.body.userId
				);
				res.status(successStatusCodes.CREATED).json({ user: avatarUploaded });
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
			if (req.body.mediaType === 'image') {
				const projectId = isValidObjectId(req.body.projectId);
				await getProjectById(projectId);
				const { imagePos } = req.body;
				if (![0, 1, 2, 3, 4].includes(imagePos))
					throw badRequestErr('Invalid image position');
				const currentUser = {
					_id: isValidObjectId(req.user._id),
					username: isValidUsername(req.user.username),
				};
				const project = await removeProjectMedia(
					projectId,
					imagePos,
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
