const { MongoClient } = require('mongodb');

let connection;
let db;

module.exports = {
	dbConnection: async () => {
		if (!connection) {
			connection = await MongoClient.connect(process.env.MONGO_URL);
			db = await connection.db(process.env.MONGO_DATABASE);
		}
		return db;
	},
	closeConnection: () => {
		connection.close();
	},
};
