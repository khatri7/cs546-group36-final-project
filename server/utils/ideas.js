// ======================================================================
const { badRequestErr, isValidObj, isValidStr } = require('./index');


// Idea-Name Validation
// ======================================================================
const isValidIdeaName = (ideaNameParam) => {
	if (!ideaNameParam) throw badRequestErr('Invalid input for idea name');
	const ideaName = isValidStr(ideaNameParam, 'idea name', 'min', 3);

	return ideaName;
};


// Idea-Status Validation
// ======================================================================
const isValidStatus = (status) => {
	const statusValue = status.toLowerCase();
	if (statusValue !== 'active' && statusValue !== 'inactive') {
		throw badRequestErr('Invalid Status');
	} else {

		return statusValue;
	}
};


// Idea-LookingFor Validation
// ======================================================================
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


// checkUserAccess
// ======================================================================
const checkUserAccess = (user, owner) => {

	return (user._id === owner._id.toString()) ? true : false;
};



// getAllComments
// ======================================================================
const getAllComments = (comments) => {
	const commentList = [];
	comments.forEach(comment => {
		if (comment._id) {
			commentList.push(comment._id.toString());
		}
	});

	return commentList;
};



// ======================================================================
module.exports = {
	isValidIdeaName,
	isValidStatus,
	isValidLookingFor,
	checkUserAccess,
	getAllComments
};
