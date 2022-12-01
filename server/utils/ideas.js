const { badRequestErr, isNumberChar, isValidStr } = require('./index');

const isValidIdeaName = (ideaNameParam) => {
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
	isNumberChar(lookingForParam);
	if (lookingForParam <= 0)
		throw badRequestErr('Invalid input for looking for');
	return lookingForParam;
};

module.exports = {
	isValidIdeaName,
	isValidStatus,
	isValidLookingFor,
};
