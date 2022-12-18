const express = require('express');
const usersData = require('../data/users/index');
const { sendErrResp } = require('../utils');
const { isValidQueryParamTechnologies } = require('../utils/projects');
const { isValidAvailabilityQueryParams } = require('../utils/users');

const router = express.Router();

router.route('/').get(async (req, res) => {
	try {
		let { skills, availability } = req.query;
		// xss checks done in isValidQueryParamTechnologies and isValidAvailabilityQueryParams()
		if (skills) skills = isValidQueryParamTechnologies(skills);
		if (availability)
			availability = isValidAvailabilityQueryParams(availability);
		const users = await usersData.getAllUsers({
			skills,
			availability,
		});
		res.json({ users });
	} catch (e) {
		sendErrResp(res, e);
	}
});

module.exports = router;
