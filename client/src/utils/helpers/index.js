/* eslint-disable no-continue */
import moment from 'moment';
import { initializeApp } from 'store/app';
import { setUser } from 'store/user';
import { initialReq } from 'utils/api-calls';
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

/**
 *
 * @param {string} date in format MM-DD-YYYY
 * @param {string} compareDate in formate MM-DD-YYY
 * @param {('before' | 'after')} comparision before or after the compare date
 */
export const compareDateStr = (date, compareDate, comparision) => {
	const momentDate = moment(date);
	const compareMomentDate = moment(compareDate);
	const diff = compareMomentDate.diff(momentDate, 'days');
	if (comparision === 'before' && diff > 0) return true;
	if (comparision === 'after' && diff < 0) return true;
	return false;
};

export const isFutureDate = (date) => {
	const momentDate = moment(date);
	if (moment().diff(momentDate, 'days') < 0) return true;
	return false;
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
		const resp = await initialReq();
		if (resp.user) dispatch(setUser(resp.user));
	} finally {
		dispatch(initializeApp());
	}
};

const isValidObject = (obj) =>
	obj !== null && typeof obj === 'object' && !Array.isArray(obj);

export const compareArrays = (arr1, arr2) => {
	if (arr1.length !== arr2.length) return false;
	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			if (
				(Array.isArray(arr1[i]) &&
					Array.isArray(arr2[i]) &&
					compareArrays(arr1[i], arr2[i])) ||
				(isValidObject(arr1[i]) &&
					isValidObject(arr2[i]) &&
					// eslint-disable-next-line no-use-before-define
					deepEquality(arr1[i], arr2[i]))
			)
				continue;
			return false;
		}
	}
	return true;
};

export const deepEquality = (obj1, obj2) => {
	const obj1keys = Object.keys(obj1);
	const obj2keys = Object.keys(obj2);
	if (obj1keys.length !== obj2keys.length) return false;
	// eslint-disable-next-line no-restricted-syntax
	for (const key of obj1keys) {
		if (obj1[key] !== obj2[key]) {
			if (
				(Array.isArray(obj1[key]) &&
					Array.isArray(obj2[key]) &&
					compareArrays(obj1[key], obj2[key])) ||
				(isValidObject(obj1[key]) &&
					isValidObject(obj2[key]) &&
					deepEquality(obj1[key], obj2[key]))
			)
				continue;
			return false;
		}
	}
	return true;
};
