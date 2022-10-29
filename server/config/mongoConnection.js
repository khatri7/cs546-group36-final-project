const { MongoClient } = require('mongodb');

let _connection = undefined;
let _db = undefined;

module.exports = {
	dbConnection: async () => {
		if (!_connection) {
			_connection = await MongoClient.connect(process.env.MONGO_URL);
			_db = await _connection.db(process.env.MONGO_DATABASE);
		}
		return _db;
	},
	closeConnection: () => {
		_connection.close();
	},
};
