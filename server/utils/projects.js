// Projects Validations
const topics = require('./data/technologies');
const { badRequestErr } = require('./index');
const { isValidStr, isValidObj, isValidArray } = require('./index');

const checkuseraccess = (user, owner) => {
	if (user._id === owner._id.toString()) {
		return true;
	}
	return false;
};

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

const isValidQueryParamTechnologies = (technologiesParam) => {
	isValidStr(technologiesParam, 'technologies query param');
	return technologiesParam
		.trim()
		.split(',')
		.map((topic) => topic.toLowerCase().trim())
		.filter((topic) => topic !== '')
		.join(',');
};

const isValidTechnologies = (technologiesParam) => {
	const technologies = isValidArray(
		technologiesParam,
		'technologies',
		'min',
		1
	);
	const technologiesSet = new Set(technologies);
	const technologiesArr = Array.from(technologiesSet);
	technologiesArr.map((tech, index) => {
		if (
			!isValidStr(tech, `Technology at index ${index}`) ||
			!topics.includes(tech.trim().toLowerCase())
		)
			throw badRequestErr(
				`Invalid technology at index ${index}. Please check /projects/technologies to see valid technologies`
			);
		return tech.trim().toLowerCase();
	});
	return technologies;
};

const isValidProjectObject = (projectObject) => {
	isValidObj(projectObject);
	return {
		name: isValidProjectName(projectObject.name, 'Project name', 'min', 3),
		description: projectObject.description
			? isValidStr(projectObject.description, 'project description')
			: null,
		github: projectObject.github ? isValidGithub(projectObject.github) : null,
		technologies: isValidTechnologies(projectObject.technologies),
		deploymentLink: projectObject.deploymentLink
			? isValidStr(projectObject.deploymentLink, 'project deployment link')
			: null,
	};
};
module.exports = {
	checkuseraccess,
	isValidProjectName,
	isValidProjectObject,
	isValidGithub,
	isValidTechnologies,
	isValidQueryParamTechnologies,
};
