const AWS = require('aws-sdk');
const projectData = require('../../data/projects');
const { badRequestErr } = require('..');

const images = async (image, project, imagePos, projectId) => {
	if (!image) {
		throw badRequestErr('Please Pass a file');
	}
	const fileSize = image.size;
	if (!(image.mimetype === 'image/jpeg' || image.mimetype === 'image/png'))
		throw badRequestErr('file type wrong');
	if (fileSize > 5242880)
		throw badRequestErr('the file size of Image uploaded has exceeded 5 mb');

	AWS.config.update({
		secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
		accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
		region: process.env.AWS_S3_REGION,
		signatureVersion: 'v4',
	});
	const s3 = new AWS.S3({ signatureVersion: 'v4' });
	const photoKey = `${process.env.ENVIRONMENT}/projects/${project._id}/image/${imagePos}/${image.originalname}`;
	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: photoKey,
		Body: image.buffer,
		ContentType: image.mimetype,
	};
	const s3result = await s3.upload(params).promise();
	await projectData.updateImageOrResume(s3result.Location, imagePos, projectId);
	const updatedProject = await projectData.getProjectById(projectId);
	return updatedProject;
};

module.exports = {
	images,
};
