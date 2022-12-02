const { badRequestErr, isValidStr } = require('./index');

const isValidIdeaName = (ideaNameParam) => {
	if (!ideaNameParam) throw badRequestErr('Invalid input for idea name');
	const ideaName = isValidStr(ideaNameParam, 'idea name', 'min', 3);
	return ideaName;
};
const isValidStatus = (status) => {
	const statusValue = status.toLowerCase();
	if (statusValue !== 'active' && statusValue !== 'inactive') {
		throw badRequestErr('Invalid Status');
	} else {
		return statusValue;
	}
};
const isValidLookingFor = (lookingForParam) => {
	if (!lookingForParam) throw badRequestErr('Invalid input for looking for');
	if (typeof lookingForParam !== 'number')
		throw badRequestErr('Invalid input for looking for');
	if (Number.isNaN(lookingForParam))
		throw badRequestErr('Invalid input for looking for');
	if (lookingForParam <= 0)
		throw badRequestErr('Invalid input for looking for');
	return lookingForParam;
};

module.exports = {
	isValidIdeaName,
	isValidStatus,
	isValidLookingFor,
};
