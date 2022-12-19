const {
	badRequestErr,
	isValidStr,
	isLetterChar,
	isNumberChar,
} = require('./index');

const isValidIdeaName = (ideaNameParam) => {
	if (!ideaNameParam) throw badRequestErr('Invalid input for idea name');
	const ideaName = isValidStr(ideaNameParam, 'idea name', 'min', 3);
	isValidStr(ideaName, 'idea name', 'max', 80);
	ideaName.split('').forEach((char) => {
		if (
			!isLetterChar(char) &&
			!isNumberChar(char) &&
			char !== '' &&
			char !== ' '
		)
			throw badRequestErr('Invalid Idea name');
	});
	return ideaName;
};

const isValidStatus = (statusParam) => {
	const status = isValidStr(statusParam, 'Idea status');
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
	if (lookingForParam > 50)
		throw badRequestErr('Invalid input for looking for: Maximum 50 allowed');
	return lookingForParam;
};

const checkUserAccess = (user, owner) => {
	return user._id === owner._id.toString();
};

const getAllComments = (comments) => {
	const commentList = [];
	comments.forEach((comment) => {
		if (comment._id) {
			commentList.push(comment._id.toString());
		}
	});

	return commentList;
};

module.exports = {
	isValidIdeaName,
	isValidStatus,
	isValidLookingFor,
	checkUserAccess,
	getAllComments,
};
