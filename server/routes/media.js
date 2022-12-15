const express = require('express');
const imageUpload = require('../utils/aws/image');
const resumeUpload = require('../utils/aws/resume');
const avatarUpload = require('../utils/aws/avatar');
const { authenticateToken } = require('../middleware/auth');
const {
	badRequestErr,
	sendErrResp,
	isValidStr,
	isValidObjectId,
	successStatusCodes,
} = require('../utils');
const { getProjectById, removeProjectMedia } = require('../data/projects');
const { getUserById } = require('../data/users');
const uploadMedia = require('../middleware/uploadMedia');
const { isValidUsername } = require('../utils/users');

const router = express.Router();

router
	.route('/')
	.post(authenticateToken, uploadMedia, async (req, res) => {
		const { user } = req;
		try {
			if (req.body.mediaType === 'resume') {
				if (!req.file) {
					throw badRequestErr('Please Pass a file');
				}
				const fileSize = req.file.size;
				if (req.file.mimetype !== 'application/pdf')
					throw badRequestErr('Please upload file type of PDF only');
				if (fileSize > 5253365.76)
					throw badRequestErr('the file size of resume has exceeded 5 mb');

				const users = await getUserById(req.body.userId);
				const resumeUploaded = await resumeUpload.resume(
					req.file,
					users,
					req.body.userId
				);
				res.status(successStatusCodes.CREATED).json({ user: resumeUploaded });
			} else if (req.body.mediaType === 'image') {
				if (!req.file) {
					throw badRequestErr('Please Pass a file');
				}
				const fileSize = req.file.size;
				if (
					!(
						req.file.mimetype === 'image/jpeg' ||
						req.file.mimetype === 'image/png'
					)
				)
					throw badRequestErr('Please upload file type of JPEG/JPG/PNG only');
				if (fileSize > 5253365.76)
					throw badRequestErr(
						'the file size of Image uploaded has exceeded 5 mb'
					);

				const projectId = isValidObjectId(req.body.projectId);
				const project = await getProjectById(projectId);
				const imagePos = isValidStr(req.body.imagePos);
				const imageUploaded = await imageUpload.images(
					req.file,
					project,
					imagePos,
					req.body.projectId,
					user
				);
				res.status(successStatusCodes.CREATED).json({ project: imageUploaded });
			} else if (req.body.mediaType === 'avatar') {
				if (!req.file) {
					throw badRequestErr('Please Pass a file');
				}
				const fileSize = req.file.size;
				if (
					!(
						req.file.mimetype === 'image/jpeg' ||
						req.file.mimetype === 'image/png'
					)
				)
					throw badRequestErr('file type wrong');
				if (fileSize > 5253365.76)
					throw badRequestErr(
						'the file size of Avatar Image has exceeded 5 mb'
					);

				const users = await getUserById(req.body.userId);
				const avatarUploaded = await avatarUpload.avatar(
					req.file,
					users,
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
