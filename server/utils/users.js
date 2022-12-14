const moment = require('moment/moment');
const xss = require('xss');
const bcrypt = require('bcrypt');
const {
	isValidStr,
	isLetterChar,
	badRequestErr,
	isNumberChar,
	isValidObj,
	internalServerErr,
	isValidArray,
	isBoolean,
	rLinkedIn,
} = require('./index');
const { isValidTechnologies, isValidGithub } = require('./projects');

const saltRounds = 16;

// Taken from HTML spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
const rEmail =
	// eslint-disable-next-line no-useless-escape
	/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const AVAILABILITY = [
	'full-time',
	'part-time',
	'contract',
	'internship',
	'code-collab',
];

/**
 *
 * @param {string} name
 * @param {string} varName
 * @param {boolean} allowPunctuations
 * @returns {string} name after trimming if it is a valid director name otherwise throws an error
 */
const isValidName = (nameParam, varName, allowPunctuations = false) => {
	const name = isValidStr(nameParam, varName, 'min', 3);
	isValidStr(name, varName, 'max', 40);
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

const isValidDateStr = (dateParam, varName) => {
	const date = isValidStr(dateParam, varName);
	date.split('').forEach((char) => {
		if (!isNumberChar(char) && char !== '-')
			throw badRequestErr(`Invalid ${varName}`);
	});
	let [month, day, year] = date.split('-');
	if (month.length !== 2 || day.length !== 2 || year.length !== 4)
		throw badRequestErr(`Invalid ${varName}`);
	year = parseInt(year.trim(), 10);
	month = parseInt(month.trim(), 10);
	day = parseInt(day.trim(), 10);
	if (
		!Number.isFinite(year) ||
		!Number.isFinite(month) ||
		!Number.isFinite(day)
	)
		throw badRequestErr(`Invalid ${varName}`);
	const momentDate = moment(
		`${year.toString().padStart(4, '0')}-${month
			.toString()
			.padStart(2, '0')}-${day.toString().padStart(2, '0')}`
	);
	if (!momentDate.isValid()) throw badRequestErr(`Invalid ${varName}`);
	return momentDate;
};

/**
 *
 * @param {string} date in format MM-DD-YYYY
 * @returns {string} date string if it is valid otherwise throws an error
 */
const isValidDob = (dateParam) => {
	const momentDate = isValidDateStr(dateParam, 'DOB');
	if (!momentDate.isValid()) throw badRequestErr('Invalid DOB');
	const difference = moment().diff(momentDate, 'year');
	if (difference < 12 || difference > 100)
		throw badRequestErr('Invalid DOB: should be between 12-100 years in age');
	return momentDate.format('MM-DD-YYYY');
};

const isValidFromAndToDate = (fromDate, toDate = null, userDob = undefined) => {
	const fromMomentDate = isValidDateStr(fromDate, 'From Date');
	const toMomentDate = toDate ? isValidDateStr(toDate, 'To Date') : null;
	if (!fromMomentDate.isValid()) throw badRequestErr('Invalid From Date');
	if (toMomentDate && !toMomentDate.isValid())
		throw badRequestErr('Invalid To Date');
	if (moment().diff(fromMomentDate, 'days') < 0)
		throw badRequestErr('From Date cannot be in the future');
	if (userDob) {
		const userDobMoment = moment(userDob);
		if (fromMomentDate.diff(userDobMoment, 'days') < 1)
			throw badRequestErr('From date cannot be before or same as your DOB');
	}
	if (toMomentDate) {
		if (moment().diff(toMomentDate, 'days') < 0)
			throw badRequestErr(
				'To Date cannot be in the future, set it as null if it is current'
			);
		const difference = toMomentDate.diff(fromMomentDate, 'days');
		if (difference < 1)
			throw badRequestErr('To Date cannot be same as or before From Date');
	}
	return {
		from: fromMomentDate.format('MM-DD-YYYY'),
		to: toMomentDate ? toMomentDate.format('MM-DD-YYYY') : null,
	};
};

/**
 *
 * @param {string} usernameParam
 * @returns {string} username after trimming and converting to lowercase if it is a valid user otherwise throws an error
 */
const isValidUsername = (usernameParam) => {
	const username = isValidStr(usernameParam, 'Username', 'min', 3);
	isValidStr(username, 'Username', 'max', 20);
	if (!isLetterChar(username.charAt(0)))
		throw badRequestErr('Invalid username: Should start with a letter');
	username.split('').forEach((char) => {
		if (!isLetterChar(char) && !isNumberChar(char))
			throw badRequestErr(
				'Invalid username: Should only contain letters or numbers'
			);
	});
	return username.toLowerCase();
};

const isValidAvailability = (availabilityArr) => {
	const availability = isValidArray(
		availabilityArr,
		'Availability Array',
		'min',
		1
	);
	const availabilitiesSet = new Set(availability);
	const availabilitiesArr = Array.from(availabilitiesSet);
	return availabilitiesArr.map((item) => {
		if (!AVAILABILITY.includes(item.trim().toLowerCase()))
			throw badRequestErr(
				`Invalid availabliity at index ${availability.indexOf(item)}`
			);
		return item.trim().toLowerCase();
	});
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
 * @param {string} password plain text password to compare
 * @param {string} hash hash of the password from DB
 * @returns {boolean} result of the comparision or throws an error
 */
const comparePassword = async (password, hash) => {
	try {
		const isSame = await bcrypt.compare(password, hash);
		return isSame;
	} catch (e) {
		throw internalServerErr('Error checking password. Please try again');
	}
};

/**
 *
 * @param {string} password
 * @returns {string} password if it is a valid password otherwise throws an error
 */
const isValidPassword = (passwordParam) => {
	if (passwordParam.split('').includes(' '))
		throw badRequestErr('Passwords cannot contain spaces');
	const password = isValidStr(passwordParam, 'Password', 'min', 8);
	return password;
};

const isValidLinkedin = (inputLinkParam) => {
	const inputLink = isValidStr(inputLinkParam);
	if (!rLinkedIn.test(inputLink)) throw badRequestErr('Invalid LinkedIn url');
	return inputLink;
};

/**
 *
 * @param {object} userObj
 * @returns {object} user object after validating each field
 */
const isValidUserObj = (userObjParam) => {
	isValidObj(userObjParam);
	return {
		firstName: isValidName(xss(userObjParam.firstName), 'First Name', false),
		lastName: isValidName(xss(userObjParam.lastName), 'Last Name', false),
		username: isValidUsername(xss(userObjParam.username)),
		dob: isValidDob(xss(userObjParam.dob)),
		bio: userObjParam.bio
			? isValidStr(xss(userObjParam.bio), 'Bio', 'min', 3)
			: null,
		email: isValidEmail(xss(userObjParam.email)),
		password: isValidPassword(xss(userObjParam.password)),
		education: [],
		experience: [],
		resumeUrl: null,
		avatar: null,
		// xss validations for skills done in isValidTechnologies()
		skills: isValidTechnologies(userObjParam.skills),
		isAvailable: false,
		availability: [],
		socials: {
			github:
				userObjParam.socials && userObjParam.socials.github
					? isValidGithub(xss(userObjParam.socials.github))
					: null,
			linkedin:
				userObjParam.socials && userObjParam.socials.linkedin
					? isValidLinkedin(xss(userObjParam.socials.linkedin))
					: null,
		},
	};
};

const isValidUpdateUserObj = (userObjParam) => {
	isValidObj(userObjParam);
	const {
		firstName,
		lastName,
		dob,
		bio,
		skills,
		socials,
		isAvailable,
		availability,
	} = userObjParam;
	const updateUserObj = {};
	if (firstName)
		updateUserObj.firstName = isValidName(xss(firstName), 'First Name', false);
	if (lastName)
		updateUserObj.lastName = isValidName(xss(lastName), 'Last Name', false);
	if (dob) updateUserObj.dob = isValidDob(xss(dob));
	if (Object.keys(userObjParam).includes('bio'))
		updateUserObj.bio =
			bio === null || bio.trim().length === 0
				? null
				: isValidStr(xss(bio), 'Bio', 'min', 3);
	// xss validations for skills done in isValidTechnologies()
	if (skills) updateUserObj.skills = isValidTechnologies(skills);
	if (socials) {
		updateUserObj.socials = {
			github: socials.github ? isValidGithub(xss(socials.github)) : null,
			linkedin: socials.linkedin
				? isValidLinkedin(xss(socials.linkedin))
				: null,
		};
	}
	if (Object.keys(userObjParam).includes('isAvailable')) {
		if (!isBoolean(isAvailable))
			throw badRequestErr('isAvailable needs to be of type boolean');
		if (isAvailable === true) {
			updateUserObj.isAvailable = true;
			updateUserObj.availability = isValidAvailability(availability);
		} else {
			updateUserObj.isAvailable = false;
			updateUserObj.availability = [];
		}
	}
	return updateUserObj;
};

const isValidUserLoginObj = (userLoginObjParam) => {
	isValidObj(userLoginObjParam);
	return {
		username: isValidUsername(xss(userLoginObjParam.username)),
		password: isValidPassword(xss(userLoginObjParam.password)),
	};
};

// checks if a string has letters only from the english alphabet. spaces are allowed.
const isValidSchoolName = (nameParam, varName) => {
	const name = isValidStr(nameParam, varName, 'min', 3);
	isValidStr(name, varName, 'max', 60);
	name.split('').forEach((char) => {
		if (!isLetterChar(char) && char !== '' && char !== ' ')
			throw badRequestErr(`Invalid ${varName}`);
	});
	return name;
};

// checks if a string is alpha numeric. spaces are allowed
const isValidCourseName = (nameParam, varName) => {
	const name = isValidStr(nameParam, varName, 'min', 3);
	isValidStr(name, varName, 'max', 60);
	name.split('').forEach((char) => {
		if (
			!isLetterChar(char) &&
			!isNumberChar(char) &&
			char !== '' &&
			char !== ' '
		)
			throw badRequestErr(`Invalid ${varName}`);
	});
	return name;
};

const isValidEducationObj = (educationObjParam, userDob = undefined) => {
	isValidObj(educationObjParam);
	const { from, to } = isValidFromAndToDate(
		educationObjParam.from,
		educationObjParam.to,
		userDob
	);
	return {
		school: isValidSchoolName(educationObjParam.school, 'School Name'),
		course: isValidCourseName(educationObjParam.course, 'Course Name'),
		from,
		to,
	};
};

const isValidExperienceObj = (experienceObjParam, userDob = undefined) => {
	isValidObj(experienceObjParam);
	const { from, to } = isValidFromAndToDate(
		experienceObjParam.from,
		experienceObjParam.to,
		userDob
	);
	return {
		// is valid course name is an alpha numeric check which is what we need for company name
		company: isValidCourseName(experienceObjParam.company, 'Company Name'),
		title: isValidCourseName(experienceObjParam.title, 'Title'),
		from,
		to,
	};
};
const isValidAvailabilityQueryParams = (availabilityParam) => {
	if (!AVAILABILITY.includes(availabilityParam.trim().toLowerCase()))
		throw badRequestErr('Not a valid availability param');
	return xss(availabilityParam.trim().toLowerCase());
};

module.exports = {
	isValidUsername,
	isValidEmail,
	isValidUserObj,
	hashPassword,
	comparePassword,
	isValidUserLoginObj,
	isValidEducationObj,
	isValidExperienceObj,
	isValidUpdateUserObj,
	isValidAvailability,
	isValidAvailabilityQueryParams,
};
