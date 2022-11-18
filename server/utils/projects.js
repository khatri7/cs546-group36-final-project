// Projects Validations
const { isValidStr, isValidObj, isValidArray } = require('./index');
const isValidProjectName = (projectName) => {
	const projectName = isValidStr(projectName, 'project name', 'min', 3);
	return projectName;
};
const alphanumericCheck = (inputString) => {
	for (let i = 0; i < inputString.length; i++) {
		let x = inputString.charCodeAt(i);
		if ((x > 47 && x < 58) || (x > 64 && x < 91) || (x > 96 && x < 123)) {
		} else {
			return false;
		}
	}
	return true;
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
	if (output === false) throw 'Not a valid Github URL';
};
const isValidUsername = (inputString) => {
	if (inputString === undefined) throw 'Not a valid input';
	for (let i = 0; i < inputString.length; i++) {
		if (inputString[i] === ' ') throw 'Cannot have spaces in username';
	}
	let checkAlpha = alphanumericCheck(inputString);
	if (checkAlpha === false) throw 'Need to have only alphanumeric values';
	if (inputString.length < 4) throw 'Need to be atleast 4 characters';
	return inputString;
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
	isValidUsername,
	isValidGithub,
};
