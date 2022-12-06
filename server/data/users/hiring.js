const { users } = require('../../config/mongoCollections');
const { notFoundErr, badRequestErr } = require('../../utils');
const { isValidUsername } = require('../../utils/users');
const { getUserByUsername } = require('./index');

const updateUserHiring = async (usernameParam, hiringObj) => {
	const username = isValidUsername(usernameParam);
	const user = await getUserByUsername(username);
	const usersCollection = await users();
	const result = await usersCollection.updateOne(
		{
			_id: user._id,
		},
		{
			$set: {
				...user,
				...hiringObj,
			},
		}
	);
	if (!result || result.matchedCount === 0)
		throw notFoundErr('Could not find User with the given Id');
	if (!result || result.modifiedCount === 0)
		throw badRequestErr(
			'Could not update the User, as all the fields are the same as before'
		);

	const updatedUser = await getUserByUsername(username);
	return updatedUser;
};

const clearUserhiringInfo = async (usernameParam) => {
	const username = isValidUsername(usernameParam);
	const user = await getUserByUsername(username);
	const usersCollection = await users();
	const result = await usersCollection.updateOne(
		{
			_id: user._id,
		},
		{
			$set: {
				hiringArray: [],
				isAvailable: false,
			},
		}
	);
	if (!result || result.matchedCount === 0)
		throw notFoundErr('Could not find User with the given Id');
	if (!result || result.modifiedCount === 0)
		throw badRequestErr(
			'Could not update the User, as all the fields are the same as before'
		);

	const updatedUser = await getUserByUsername(username);
	return updatedUser;
};

module.exports = {
	clearUserhiringInfo,
	updateUserHiring,
};
