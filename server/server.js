require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const configRoutes = require('./routes');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
	res.header('Access-Control-Allow-Credentials', true);
	next();
});

// if the token exists, extend it by 4 days
app.use((req, res, next) => {
	if (req.cookies.token && req.url !== '/auth/logout') {
		res.cookie('token', req.cookies.token, {
			maxAge: 345600000, // extend expiry by 4 days
			httpOnly: true,
			sameSite: 'lax',
		});
	}
	next();
});

configRoutes(app);

app.listen(3005, () => {
	console.log('Server started on port 3005!');
});
