const usersRoutes = require('./users');
const authRoutes = require('./auth');

const constructorMethod = (app) => {
	// will remove later
	app.get('/', async (req, res) => {
		res.json({ msg: 'hello world' });
	});

	app.use('/users', usersRoutes);

	app.use('/auth', authRoutes);

	app.use('*', (req, res) => {
		res.status(404).json({ error: 'Not found' });
	});
};

module.exports = constructorMethod;
