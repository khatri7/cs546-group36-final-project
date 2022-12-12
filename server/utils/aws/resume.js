const AWS = require('aws-sdk');
const userData = require('../../data/users');
const { badRequestErr } = require('..');

const resume = async (incomingResume, user, userId) => {
	if (!incomingResume) {
		throw badRequestErr('Please Pass a file');
	}
	const fileSize = incomingResume.size;
	if (incomingResume.mimetype !== 'application/pdf')
		throw badRequestErr('Please upload file type of PDF only');
	if (fileSize > 5253365.76)
		throw badRequestErr('the file size of Resume uploaded has exceeded 5 mb');

	AWS.config.update({
		secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
		accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
		region: process.env.AWS_S3_REGION,
		signatureVersion: 'v4',
	});
	const s3 = new AWS.S3({ signatureVersion: 'v4' });
	const photoKey = `${process.env.ENVIRONMENT}/resumes/${user._id}/${incomingResume.originalname}`;
	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: photoKey,
		Body: incomingResume.buffer,
		ContentType: incomingResume.mimetype,
		ContentLengthRange: 5485760,
	};
	const s3result = await s3.upload(params).promise();
	await userData.udpateResume(s3result.Location, user.username, userId);

	const updatedUser = await userData.getUserById(userId);
	return updatedUser;
};

module.exports = {
	resume,
};
