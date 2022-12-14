const userData = require('../../data/users');
const { badRequestErr } = require('..');
const { upload, deleteFile } = require('.');

const resume = async (incomingResume, user, userId) => {
	if (!incomingResume) {
		throw badRequestErr('Please Pass a file');
	}
	const fileSize = incomingResume.size;
	if (incomingResume.mimetype !== 'application/pdf')
		throw badRequestErr('Please upload file type of PDF only');
	if (fileSize > 5253365.76)
		throw badRequestErr('the file size of Resume uploaded has exceeded 5 mb');
	if (user.resumeUrl) {
		const existingResumeKey = user.resumeUrl.substr(
			user.resumeUrl.indexOf('.com/') + 5
		);
		await deleteFile(existingResumeKey);
	}
	const resumeKey = `${process.env.ENVIRONMENT}/resumes/${user._id}/${incomingResume.originalname}`;
	const location = await upload(
		resumeKey,
		incomingResume.buffer,
		incomingResume.mimetype,
		5485760
	);
	await userData.udpateResume(location, user.username, userId);
	const updatedUser = await userData.getUserById(userId);
	return updatedUser;
};

module.exports = {
	resume,
};
