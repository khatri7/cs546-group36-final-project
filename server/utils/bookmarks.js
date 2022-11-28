const { badRequestErr } = require('./index');

const isValidStatus = (status) => {
	if (status === null || status === undefined)
		throw badRequestErr('Status should be either true or false.');
	if (typeof status !== 'boolean')
		throw badRequestErr('Status should have a boolean value (true/fasle).');
	return status;
};

module.exports = {
	isValidStatus,
};
