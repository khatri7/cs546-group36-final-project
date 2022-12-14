const AWS = require('aws-sdk');

const upload = async (Key, Body, ContentType, ContentLengthRange) => {
	AWS.config.update({
		secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
		accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
		region: process.env.AWS_S3_REGION,
		signatureVersion: 'v4',
	});
	const s3 = new AWS.S3({ signatureVersion: 'v4' });
	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key,
		Body,
		ContentType,
	};
	if (ContentLengthRange) params.ContentLengthRange = ContentLengthRange;
	const result = await s3.upload(params).promise();
	return result.Location;
};

const deleteFile = async (Key) => {
	AWS.config.update({
		secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
		accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
		region: process.env.AWS_S3_REGION,
		signatureVersion: 'v4',
	});
	const s3 = new AWS.S3({ signatureVersion: 'v4' });
	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key,
	};
	const result = await s3.deleteObject(params).promise();
	return result;
};

module.exports = {
	upload,
	deleteFile,
};
