const { ObjectId } = require('mongodb');

const successStatusCodes = {
	OK: 200,
	CREATED: 201,
	DELETED: 204,
};
Object.freeze(successStatusCodes);

const error = {
	BAD_REQUEST: {
		status: 400,
		message: 'Invalid Request Parameter',
	},
	UNAUTHORIZED: {
		status: 401,
		message: 'Invalid or no JWT provided',
	},
	FORBIDDEN: {
		status: 403,
		message: 'You are not authorized to perform this action',
	},
	NOT_FOUND: {
		status: 404,
		message: 'Not Found',
	},
	INTERNAL_SERVER_ERROR: {
		status: 500,
		message: 'Internal Server Error',
	},
};
Object.freeze(error);

const createErrorObj = (err, message) => {
	if (!err || !err.status || !err.message) return error.INTERNAL_SERVER_ERROR;
	return {
		...err,
		message: message || err.message,
	};
};

const badRequestErr = (message) => createErrorObj(error.BAD_REQUEST, message);
const unauthorizedErr = (message) =>
	createErrorObj(error.UNAUTHORIZED, message);
const forbiddenErr = (message) => createErrorObj(error.FORBIDDEN, message);
const notFoundErr = (message) => createErrorObj(error.NOT_FOUND, message);
const internalServerErr = (message) =>
	createErrorObj(error.INTERNAL_SERVER_ERROR, message);

const sendErrResp = (res, { status, message }) =>
	res
		.status(status || error.INTERNAL_SERVER_ERROR)
		.json(message ? { message } : '');

/**
 *
 * @param {string} char
 * @returns {boolean} if the character provided is a lower case letter
 */
const isLetterChar = (char) =>
	char.toLowerCase() >= 'a' && char.toLowerCase() <= 'z';

/**
 *
 * @param {string} char
 * @returns {boolean} if the character provided is a number
 */
const isNumberChar = (char) => char >= '0' && char <= '9';

/**
 *
 * @param {string} str
 * @param {string} varName
 * @param {("min" | "max" | "equal")} compareOp
 * @param {number} compareVal
 * @returns str after trimming if it is a valid string input
 */
const isValidStr = (strParam, varName, compareOp, compareVal) => {
	if (!strParam) throw badRequestErr(`You need to provide a ${varName}`);
	if (typeof strParam !== 'string')
		throw badRequestErr(`${varName} should be of type string`);
	const str = strParam.trim();
	if (str.length === 0)
		throw badRequestErr(
			`Empty string/string with spaces is not a valid ${varName}`
		);
	if (compareOp && compareVal) {
		switch (compareOp) {
			case 'min':
				if (str.length < compareVal)
					throw badRequestErr(
						`${varName} should be at least ${compareVal} in length`
					);
				break;
			case 'max':
				if (str.length > compareVal)
					throw badRequestErr(
						`${varName} should be at max ${compareVal} in length`
					);
				break;
			case 'equal':
				if (str.length !== compareVal)
					throw badRequestErr(`${varName} should be ${compareVal} in length`);
				break;
			default:
				break;
		}
	}
	return str;
};

/**
 *
 * @param {Array} arr
 * @param {string} arrName
 * @param {("min" | "max" | "equal")} compareOp
 * @param {number} compareVal
 */
const isValidArray = (arr, arrName, compareOp, compareVal) => {
	if (!arr) throw badRequestErr(`You need to provide ${arrName}`);
	if (typeof arr !== 'object' || !Array.isArray(arr))
		throw badRequestErr(`${arrName} should be of type array`);
	if (compareOp && compareVal) {
		switch (compareOp) {
			case 'min':
				if (arr.length < compareVal)
					throw badRequestErr(
						`${arrName} length should be at least ${compareVal}`
					);
				break;
			case 'max':
				if (arr.length > compareVal)
					throw badRequestErr(`${arrName} length cannot be more ${compareVal}`);
				break;
			case 'equal':
				if (arr.length !== compareVal)
					throw badRequestErr(`${arrName} length should be ${compareVal}`);
				break;
			default:
				break;
		}
	}
	return arr;
};

/**
 *
 * @param {object} obj
 * @returns {boolean} true if the object provided is a valid object
 */
const isValidObj = (obj) =>
	obj !== null && typeof obj === 'object' && !Array.isArray(obj);

/**
 *
 * @param {string} id
 * @returns {ObjectId} the object id string if it is valid otherwise throws an error
 */
const isValidObjectId = (idParam) => {
	const id = isValidStr(idParam, 'Id');
	if (!ObjectId.isValid(id)) throw badRequestErr('Invalid Object Id');
	return id;
};

module.exports = {
	successStatusCodes,
	unauthorizedErr,
	forbiddenErr,
	notFoundErr,
	badRequestErr,
	internalServerErr,
	sendErrResp,
	isLetterChar,
	isNumberChar,
	isValidStr,
	isValidArray,
	isValidObj,
	isValidObjectId,
};
