const dbConnection = require('./mongoConnection');

const getCollectionFn = (collection) => {
	let col;

	return async () => {
		if (!col) {
			const db = await dbConnection.dbConnection();
			col = await db.collection(collection);
		}

		return col;
	};
};

module.exports = {
	users: getCollectionFn('users'),
	projects: getCollectionFn('projects'),
	ideas: getCollectionFn('ideas'),
};
