const express = require('express');
const multer = require('multer');
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
const { getProjectById } = require('../data/projects');
const { getUserById } = require('../data/users');

const upload = multer();
const router = express.Router();

router
	.route('/')
	.post(authenticateToken, upload.single('media'), async (req, res) => {
		try {
			if (req.body.mediaType === 'resume') {
				const user = await getUserById(req.body.userId);
				const resumeUploaded = await resumeUpload.resume(
					req.file,
					user,
					req.body.userId
				);
				res.status(successStatusCodes.CREATED).json({ user: resumeUploaded });
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
				const user = await getUserById(req.body.userId);
				const avatarUploaded = await avatarUpload.avatar(
					req.file,
					user,
					req.body.userId
				);
				res.status(successStatusCodes.CREATED).json({ user: avatarUploaded });
			} else {
				throw badRequestErr(
					'Invald Entry, mediaType needs to be of resume or image'
				);
			}
		} catch (e) {
			sendErrResp(res, e);
		}
	});

module.exports = router;
