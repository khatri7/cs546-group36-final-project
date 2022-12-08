const express = require('express');
const { usersData } = require('../data');
const {
	getProjectsByOwnerUsername,
	getSavedProjects,
} = require('../data/projects');
const {
	getUserByUsername,
	checkUsernameAvailable,
	updateUser,
} = require('../data/users');
const {
	createEducation,
	getEducationById,
	updateEducation,
	removeEducation,
} = require('../data/users/education');
const {
	sendErrResp,
	isValidObjectId,
	successStatusCodes,
	badRequestErr,
} = require('../utils');
const {
	isValidUsername,
	isValidEducationObj,
	isValidExperienceObj,
	isValidUpdateUserObj,
} = require('../utils/users');
const { authenticateToken } = require('../middleware/auth');
const {
	createExperience,
	getExperienceById,
	updateExperience,
	removeExperience,
} = require('../data/users/experience');

const router = express.Router();

router.route('/username').post(async (req, res) => {
	try {
		const username = isValidUsername(req.body.username);
		const isAvailable = await checkUsernameAvailable(username);
		if (!isAvailable)
			throw badRequestErr('The username provided has already been taken');
		res.status(successStatusCodes.CREATED).json({ username });
	} catch (e) {
		sendErrResp(res, e);
	}
});

router
	.route('/:username')
	.get(async (req, res) => {
		try {
			const username = isValidUsername(req.params.username);
			const user = await usersData.getUserByUsername(username);
			res.json({ user });
		} catch (e) {
			sendErrResp(res, e);
		}
	})
	.put(authenticateToken, async (req, res) => {
		try {
			const username = isValidUsername(req.params.username);
			await getUserByUsername(username);
			const currentUser = {
				_id: isValidObjectId(req.user._id),
				username: isValidUsername(req.user.username),
			};
			const updateUserObj = isValidUpdateUserObj(req.body);
			const updatedUser = await updateUser(
				username,
				currentUser,
				updateUserObj
			);
			res.json({ user: updatedUser });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

router.route('/:username/projects').get(async (req, res) => {
	try {
		const username = isValidUsername(req.params.username);
		await getUserByUsername(username);
		const projects = await getProjectsByOwnerUsername(username);
		res.json({ projects });
	} catch (e) {
		sendErrResp(res, e);
	}
});

router
	.route('/:username/saved-projects')
	.get(authenticateToken, async (req, res) => {
		const { user } = req;
		try {
			const username = isValidUsername(req.params.username);
			const loggedinId = isValidObjectId(user._id);
			await getUserByUsername(username);
			const projects = await getSavedProjects(username, loggedinId);
			res.json({ projects });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

/**
 * User Education Routes
 */

router
	.route('/:username/education')
	.post(authenticateToken, async (req, res) => {
		try {
			const username = isValidUsername(req.params.username);
			await getUserByUsername(username);
			const currentUser = {
				_id: isValidObjectId(req.user._id),
				username: isValidUsername(req.user.username),
			};
			const educationObj = isValidEducationObj(req.body);
			const user = await createEducation(username, currentUser, educationObj);
			res.status(successStatusCodes.CREATED).json({ user });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

router
	.route('/:username/education/:educationId')
	.put(authenticateToken, async (req, res) => {
		try {
			const username = isValidUsername(req.params.username);
			const educationId = isValidObjectId(req.params.educationId);
			await getUserByUsername(username);
			await getEducationById(educationId);
			const currentUser = {
				_id: isValidObjectId(req.user._id),
				username: isValidUsername(req.user.username),
			};
			const educationObj = isValidEducationObj(req.body);
			const user = await updateEducation(
				username,
				educationId,
				currentUser,
				educationObj
			);
			res.json({ user });
		} catch (e) {
			sendErrResp(res, e);
		}
	})
	.delete(authenticateToken, async (req, res) => {
		try {
			const username = isValidUsername(req.params.username);
			const educationId = isValidObjectId(req.params.educationId);
			await getUserByUsername(username);
			await getEducationById(educationId);
			const currentUser = {
				_id: isValidObjectId(req.user._id),
				username: isValidUsername(req.user.username),
			};
			const user = await removeEducation(username, educationId, currentUser);
			res.json({ user });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

/**
 * User Experience Routes
 */

router
	.route('/:username/experience')
	.post(authenticateToken, async (req, res) => {
		try {
			const username = isValidUsername(req.params.username);
			await getUserByUsername(username);
			const currentUser = {
				_id: isValidObjectId(req.user._id),
				username: isValidUsername(req.user.username),
			};
			const experienceObj = isValidExperienceObj(req.body);
			const user = await createExperience(username, currentUser, experienceObj);
			res.status(successStatusCodes.CREATED).json({ user });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

router
	.route('/:username/experience/:experienceId')
	.put(authenticateToken, async (req, res) => {
		try {
			const username = isValidUsername(req.params.username);
			const experienceId = isValidObjectId(req.params.experienceId);
			await getUserByUsername(username);
			await getExperienceById(experienceId);
			const currentUser = {
				_id: isValidObjectId(req.user._id),
				username: isValidUsername(req.user.username),
			};
			const experienceObj = isValidExperienceObj(req.body);
			const user = await updateExperience(
				username,
				experienceId,
				currentUser,
				experienceObj
			);
			res.json({ user });
		} catch (e) {
			sendErrResp(res, e);
		}
	})
	.delete(authenticateToken, async (req, res) => {
		try {
			const username = isValidUsername(req.params.username);
			const experienceId = isValidObjectId(req.params.experienceId);
			await getUserByUsername(username);
			await getExperienceById(experienceId);
			const currentUser = {
				_id: isValidObjectId(req.user._id),
				username: isValidUsername(req.user.username),
			};
			const user = await removeExperience(username, experienceId, currentUser);
			res.json({ user });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

module.exports = router;
