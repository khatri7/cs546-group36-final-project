const moment = require('moment/moment');
const bcrypt = require('bcrypt');
const {
	isValidStr,
	isLetterChar,
	badRequestErr,
	isNumberChar,
	isValidObj,
	internalServerErr,
} = require('./index');

const saltRounds = 16;

// Taken from HTML spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
const rEmail =
	// eslint-disable-next-line no-useless-escape
	/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 *
 * @param {string} name
 * @param {string} varName
 * @param {boolean} allowPunctuations
 * @returns {string} name after trimming if it is a valid director name otherwise throws an error
 */
const isValidName = (nameParam, varName, allowPunctuations = false) => {
	const name = isValidStr(nameParam, varName, 'min', 3);
	name
		.toLowerCase()
		.split('')
		.forEach((char) => {
			if (
				!isLetterChar(char) &&
				!(allowPunctuations && ["'", '.', '-'].includes(char))
			)
				throw badRequestErr(
					`The ${varName} should not consist of numbers or any special characters`
				);
		});
	return name;
};

/**
 *
 * @param {string} date in format MM-DD-YYYY
 * @returns {string} date string if it is valid otherwise throws an error
 */
const isValidDob = (dateParam) => {
	const date = isValidStr(dateParam, 'DOB');
	date.split('').forEach((char) => {
		if (!isNumberChar(char) && char !== '-') throw badRequestErr('Invalid DOB');
	});
	let [month, day, year] = date.split('-');
	if (month.length !== 2 || day.length !== 2 || year.length !== 4)
		throw badRequestErr('Invalid DOB');
	year = parseInt(year.trim(), 10);
	month = parseInt(month.trim(), 10);
	day = parseInt(day.trim(), 10);
	if (
		!Number.isFinite(year) ||
		!Number.isFinite(month) ||
		!Number.isFinite(day)
	)
		throw badRequestErr('Invalid DOB');
	const momentDate = moment(
		`${year.toString().padStart(4, '0')}-${month
			.toString()
			.padStart(2, '0')}-${day.toString().padStart(2, '0')}`
	);
	if (!momentDate.isValid()) throw badRequestErr('Invalid DOB');
	const difference = moment().diff(momentDate, 'year');
	if (difference < 12 || difference > 100)
		throw badRequestErr('Invalid DOB: should be between 12-100 years in age');
	return momentDate.format('MM-DD-YYYY');
};

/**
 *
 * @param {string} usernameParam
 * @returns {string} username after trimming if it is a valid user otherwise throws an error
 */
const isValidUsername = (usernameParam) => {
	const username = isValidStr(usernameParam);
	if (!isLetterChar(username.charAt(0)))
		throw badRequestErr('Invalid username: Should start with a letter');
	username.split('').forEach((char) => {
		if (!isLetterChar(char) && !isNumberChar(char))
			throw badRequestErr(
				'Invalid username: Should only contain letters or numbers'
			);
	});
	return username;
};

/**
 *
 * @param {string} email
 * @returns {string} email after trimming and converting to lower case if it is a valid email otherwise throws an error
 */
const isValidEmail = (emailParam) => {
	const email = isValidStr(emailParam, 'Email');
	if (!rEmail.test(email)) throw badRequestErr('Invalid Email');
	return email.toLowerCase();
};

/**
 *
 * @param {string} password
 * @returns {string} hash of the password
 */
const hashPassword = async (password) => {
	try {
		const hash = await bcrypt.hash(password, saltRounds);
		return hash;
	} catch (e) {
		throw internalServerErr('Error hashing password. Please try again');
	}
};

/**
 *
 * @param {string} password
 * @returns {string} hash of the password if it is a valid password otherwise throws an error
 */
const isValidPassword = async (passwordParam) => {
	const password = isValidStr(passwordParam, 'Password', 'min', 8);
	const passwordHash = await hashPassword(password);
	return passwordHash;
};

// TODO - validate location and bio
// TODO - check email specs on wiki and create validation (HTML input validation breaks when there is missing TLD after .)
/**
 *
 * @param {object} userObj
 * @returns {object} user object after validating each field
 */
const isValidUserObj = async (userObjParam) => {
	isValidObj(userObjParam);
	return {
		firstName: isValidName(userObjParam.firstName, 'First Name', false),
		lastName: isValidName(userObjParam.lastName, 'First Name', false),
		username: isValidUsername(userObjParam.username),
		dob: isValidDob(userObjParam.dob),
		bio: userObjParam.bio ? isValidStr(userObjParam.bio) : '',
		location: isValidStr(userObjParam.location),
		email: isValidEmail(userObjParam.email),
		password: await isValidPassword(),
	};
};

module.exports = {
	isValidUsername,
	isValidUserObj,
};