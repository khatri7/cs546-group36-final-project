const projectData = require('../../data/projects');
const { badRequestErr } = require('..');
const { upload } = require('.');

const images = async (image, project, imagePos, projectId) => {
	if (!image) {
		throw badRequestErr('Please Pass a file');
	}
	const fileSize = image.size;
	if (!(image.mimetype === 'image/jpeg' || image.mimetype === 'image/png'))
		throw badRequestErr('Please upload file type of JPEG/JPG/PNG only');
	if (fileSize > 5242880)
		throw badRequestErr('the file size of Image uploaded has exceeded 5 mb');
	const photoKey = `${process.env.ENVIRONMENT}/projects/${project._id}/image/${imagePos}/${image.originalname}`;
	const location = await upload(photoKey, image.buffer, image.mimetype);
	await projectData.updateProjectImages(location, imagePos, projectId);
	const updatedProject = await projectData.getProjectById(projectId);
	return updatedProject;
};

module.exports = {
	images,
};
