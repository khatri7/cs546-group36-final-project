// Projects Validations
const { isValidStr, isValidObj, isValidArray } = require('./index');
const isValidProjectName = (projectName) => {
	const projectName = isValidStr(projectName, 'project name', 'min', 3);
	return projectName;
};
const isValidProjectObject = (projectObject) => {
	isValidObj(projectObject);
	return {
		name: isValidProjectName(projectObject.name, 'Project name', 'min', 3),
		description: projectName.description,
		github: projectName.github,
		// TODO - github url validation
		media: isValidArray(projectObject.media, 'media', 'min', 0),
		technologies: isValidArray(
			projectObject.technologies,
			'technologies',
			'min',
			1
		),
		owner: isValidObj(projectObject.owner),
		comments: isValidArray(projectObject.comments, 'comments', 'min', 0),
		likes: isValidArray(projectObject.likes, 'likes', 'min', 0),
	};
};
module.exports = {
	isValidProjectName,
	isValidProjectObject,
};
