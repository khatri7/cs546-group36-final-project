const express = require('express');
const multer = require('multer');
const imageUpload = require('../utils/image');
const { authenticateToken } = require('../middleware/auth');
const {
	badRequestErr,
	sendErrResp,
	isValidStr,
	isValidObjectId,
	successStatusCodes,
} = require('../utils');
const { getProjectById } = require('../data/projects');

const upload = multer();
const router = express.Router();

router
	.route('/')
	.post(authenticateToken, upload.single('media'), async (req, res) => {
		try {
			const projectId = isValidObjectId(req.body.projectId);
			const project = await getProjectById(projectId);
			if (req.body.mediaType === 'resume') {
				/* empty */
			} else if (req.body.mediaType === 'image') {
				const imagePos = isValidStr(req.body.imagePos);
				const imageUploaded = await imageUpload.images(
					req.file,
					project,
					imagePos,
					req.body.projectId
				);
				res.status(successStatusCodes.CREATED).json({ project: imageUploaded });
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
