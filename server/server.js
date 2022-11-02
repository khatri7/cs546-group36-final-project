require('dotenv').config();
const express = require('express');

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

app.get('/', async (req, res) => {
	res.json({ msg: 'hello world' });
});

app.listen(3005, () => {
	console.log('Server started on port 3005!');
});
