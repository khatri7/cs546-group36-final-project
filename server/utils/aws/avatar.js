const AWS = require('aws-sdk');
const userData = require('../../data/users');
const { badRequestErr } = require('..');

const avatar = async (incomingAvatar, user, userId) => {
	try {
		AWS.config.update({
			secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
			accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
			region: process.env.AWS_S3_REGION,
			signatureVersion: 'v4',
		});
		const s3 = new AWS.S3({ signatureVersion: 'v4' });
		const photoKey = `${process.env.ENVIRONMENT}/avatars/${user._id}/${incomingAvatar.originalname}`;
		const params = {
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: photoKey,
			Body: incomingAvatar.buffer,
			ContentType: incomingAvatar.mimetype,
		};
		const s3result = await s3.upload(params).promise();
		await userData.udpateAvatar(s3result.Location, user.username, userId);

		const updatedUser = await userData.getUserById(userId);
		return updatedUser;
	} catch (e) {
		throw badRequestErr(
			`Invalid AWS request/ AWS unable to process your Resume request right now`
		);
	}
};

module.exports = {
	avatar,
};
