import moment from 'moment';
import { initializeApp } from 'store/app';
import { setUser } from 'store/user';
import { login } from 'utils/api-calls';
import technologyTags from 'utils/data/technologyTags';

/**
 *
 * @param {string} char
 * @returns {boolean} if the character provided is a number
 */
export const isNumberChar = (char) => char >= '0' && char <= '9';

export const isValidDateStr = (date) => {
	let error = false;
	date.split('').forEach((char) => {
		if (!isNumberChar(char) && char !== '-') error = true;
	});
	if (error) return false;
	let [month, day, year] = date.split('-');
	if (month.length !== 2 || day.length !== 2 || year.length !== 4) return false;
	year = parseInt(year.trim(), 10);
	month = parseInt(month.trim(), 10);
	day = parseInt(day.trim(), 10);
	if (
		!Number.isFinite(year) ||
		!Number.isFinite(month) ||
		!Number.isFinite(day)
	)
		return false;
	const momentDate = moment(
		`${year.toString().padStart(4, '0')}-${month
			.toString()
			.padStart(2, '0')}-${day.toString().padStart(2, '0')}`
	);
	if (!momentDate.isValid()) return false;
	return true;
};

export const isValidDob = (dateParam) => {
	isValidDateStr(dateParam);
	const momentDate = moment(dateParam);
	if (!momentDate.isValid()) return false;
	const difference = moment().diff(momentDate, 'year');
	if (difference < 12 || difference > 100) return false;
	return true;
};

export const isValidSkills = (skills) => {
	const skillsSet = new Set(skills);
	const skillsArr = Array.from(skillsSet);
	let error = false;
	skillsArr.forEach((skill) => {
		if (!technologyTags.includes(skill.toLowerCase().trim())) error = true;
	});
	if (error) return false;
	return true;
};

export const autoLogin = async (dispatch) => {
	try {
		const resp = await login();
		if (!resp.user) throw new Error();
		dispatch(setUser(resp.user));
	} finally {
		dispatch(initializeApp());
	}
};
