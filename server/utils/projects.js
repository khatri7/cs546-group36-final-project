// Projects Validations
const { badRequestErr } = require('./index');
const { isValidStr, isValidObj, isValidArray } = require('./index');

const isValidProjectName = (projectNameParam) => {
	const projectName = isValidStr(projectNameParam, 'project name', 'min', 3);
	return projectName;
};

// taken from https://github.com/jonschlinkert/is-git-url.git check it out for more info
const githubUrlValidation = (inputLink) => {
	const regex =
		// eslint-disable-next-line no-useless-escape
		/(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
	const output = regex.test(inputLink);
	if (output === false) throw badRequestErr('Github URL invalid');
};

const isValidGithub = (inputLinkParam) => {
	const inputLink = isValidStr(inputLinkParam);
	githubUrlValidation(inputLink);
	return inputLink;
};

const isValidProjectObject = (projectObject) => {
	isValidObj(projectObject);
	return {
		name: isValidProjectName(projectObject.name, 'Project name', 'min', 3),
		description: projectObject.description
			? isValidStr(projectObject.description, 'project description')
			: null,
		github: projectObject.github ? isValidGithub(projectObject.github) : null,
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
