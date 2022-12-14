const userData = require('../../data/users');
const { badRequestErr } = require('..');
const { upload, deleteFile } = require('.');

const avatar = async (incomingAvatar, user, userId) => {
	if (!incomingAvatar) {
		throw badRequestErr('Please Pass a file');
	}
	if (
		!(
			incomingAvatar.mimetype === 'image/jpeg' ||
			incomingAvatar.mimetype === 'image/png'
		)
	)
		throw badRequestErr('Please upload file type of JPEG/JPG/PNG only');

	const fileSize = incomingAvatar.size;
	if (fileSize > 5242880)
		throw badRequestErr(
			'the file size of Avatar Image uploaded has exceeded 5 mb'
		);
	if (user.avatar) {
		const existingAvatarPhotoKey = user.avatar.substr(
			user.avatar.indexOf('.com/') + 5
		);
		await deleteFile(existingAvatarPhotoKey);
	}
	const photoKey = `${process.env.ENVIRONMENT}/avatars/${user._id}/${incomingAvatar.originalname}`;
	const location = await upload(
		photoKey,
		incomingAvatar.buffer,
		incomingAvatar.mimetype
	);
	await userData.udpateAvatar(location, user.username, userId);
	const updatedUser = await userData.getUserById(userId);
	return updatedUser;
};

module.exports = {
	avatar,
};
