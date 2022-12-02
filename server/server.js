require('dotenv').config();
const express = require('express');
const configRoutes = require('./routes');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
	next();
});

configRoutes(app);

app.listen(3005, () => {
	console.log('Server running on port 3005!');
});
