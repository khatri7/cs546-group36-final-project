const express = require('express');
const { usersData } = require('../data');

const router = express.Router();

router.route('/:username').get(async (req, res) => {
	const user = await usersData.getUserByUsername(req.params.username);
	res.json({ user });
});

module.exports = router;
