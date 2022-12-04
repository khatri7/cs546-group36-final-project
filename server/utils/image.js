const AWS = require('aws-sdk');
const projectData = require('../data/projects');
const { badRequestErr } = require('.');

const images = async (image, project, imagePos, projectId) => {
	try {
		AWS.config.update({
			secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
			accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
			region: process.env.AWS_S3_REGION,
			signatureVersion: 'v4',
		});
		const s3 = new AWS.S3({ signatureVersion: 'v4' });
		const photoKey = `${process.env.ENVIRONMENT}/${project._id}/image/${imagePos}/${image.originalname}`;
		const params = {
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: photoKey,
			Body: image.buffer,
			ContentType: image.mimetype,
		};

		s3.upload(params, async (err, result) => {
			if (err) {
				throw badRequestErr('internal error here');
			}
			const resultFinalurl = result.Location;
			await projectData.updateImageOrResume(
				// const response = await projectData.updateImageOrResume(
				resultFinalurl,
				imagePos,
				projectId
			);
			await projectData.getProjectById(projectId);
			// return {updatedProject}; unable to return succesfully the project object here
			const message = { message: 'image added succesfully' };
			return { message };
		});
	} catch (e) {
		throw badRequestErr(
			`Invalid AWS request/ AWS unable to process your request right now`
		);
	}
};

module.exports = {
	images,
};
