// Projects Validations
const { badRequestErr } = require('../utils/index');
const { isValidStr, isValidObj, isValidArray } = require('./index');
const isValidProjectName = (projectName) => {
	projectName = isValidStr(projectName, 'project name', 'min', 3);
	return projectName;
};
const isValidGithub = (inputLink) => {
	inputLink = inputLink.isValidStr(inputLink);
	githubUrlValidation(inputLink);
	return inputLink;
};
// taken from https://github.com/jonschlinkert/is-git-url.git check it out for more info
const githubUrlValidation = (inputLink) => {
	var regex =
		/(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
	let output = regex.test(str);
	if (output === false) throw badRequestErr('Github URL invalid');
};

const isValidProjectObject = (projectObject) => {
	isValidObj(projectObject);
	return {
		name: isValidProjectName(projectObject.name, 'Project name', 'min', 3),
		description: projectObject.description
			? isValidStr(projectObject.description, 'project description')
			: null,
		github: projectObject.github ? isValidGithub(projectObject.github) : null,
		// TODO - github url validation
		media: isValidArray(projectObject.media, 'media', 'min', 1),
		technologies: isValidArray(
			projectObject.technologies,
			'technologies',
			'min',
			1
		),
	};
};
module.exports = {
	isValidProjectName,
	isValidProjectObject,
	isValidGithub,
};
