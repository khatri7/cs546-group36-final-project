const xss = require('xss');
const topics = require('./data/technologies');
const {
	badRequestErr,
	isLetterChar,
	isNumberChar,
	isValidUrl,
	rGitHub,
} = require('./index');
const { isValidStr, isValidObj, isValidArray } = require('./index');

const checkuseraccess = (user, owner) => {
	if (user._id === owner._id.toString()) {
		return true;
	}
	return false;
};

const isValidProjectName = (projectNameParam) => {
	const projectName = isValidStr(projectNameParam, 'project name', 'min', 3);
	isValidStr(projectName, 'project name', 'max', 80);
	projectName.split('').forEach((char) => {
		if (
			!isLetterChar(char) &&
			!isNumberChar(char) &&
			char !== '' &&
			char !== ' '
		)
			throw badRequestErr('Invalid Project name');
	});
	return projectName;
};

const isValidGithub = (inputLinkParam) => {
	const inputLink = isValidStr(inputLinkParam);
	if (!rGitHub.test(inputLink)) throw badRequestErr('Invalid GitHub url');
	return inputLink;
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
	if (technologiesArr.length > 10)
		throw badRequestErr('You can add up to 10 technologies.');
	technologiesArr.map((tech) => {
		if (
			!isValidStr(tech, `Technology at index ${technologies.indexOf(tech)}`) ||
			!topics.includes(tech.trim().toLowerCase())
		)
			throw badRequestErr(
				`Invalid technology at index ${technologies.indexOf(
					tech
				)}. Please check /projects/technologies to see valid technologies`
			);
		return tech.trim().toLowerCase();
	});
	return technologies;
};

const isValidQueryParamTechnologies = (technologiesParam) => {
	isValidStr(xss(technologiesParam), 'technologies query param');
	return isValidTechnologies(
		technologiesParam
			.trim()
			.split(',')
			.map((topic) => topic.toLowerCase().trim())
			.filter((topic) => topic !== '')
	).join(',');
};

const isValidProjectObject = (projectObject) => {
	isValidObj(projectObject);
	return {
		name: isValidProjectName(projectObject.name, 'Project name', 'min', 3),
		description: projectObject.description
			? isValidStr(projectObject.description, 'project description', 'min', 3)
			: null,
		github: projectObject.github ? isValidGithub(projectObject.github) : null,
		technologies: isValidTechnologies(projectObject.technologies),
		deploymentLink: projectObject.deploymentLink
			? isValidUrl(projectObject.deploymentLink, 'project deployment link')
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
