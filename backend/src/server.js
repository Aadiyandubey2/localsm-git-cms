const path = require('path');
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'mongoose') {
    return originalRequire.call(this, path.join(__dirname, './utils/mongoose-mock'));
  }
  if (id === 'bcrypt') {
    return originalRequire.call(this, 'bcryptjs');
  }
  return originalRequire.apply(this, arguments);
};

const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

const startServer = async () => {
	try {
		await connectDB();

		app.listen(env.port, () => {
			console.log(`Server running on port ${env.port}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error.message);
		process.exit(1);
	}
};

startServer();
