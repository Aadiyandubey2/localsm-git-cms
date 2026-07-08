const mongoose = require('mongoose');
const env = require('./env');
const autoSeed = require('../utils/autoSeed');

let mongoServer = null;

const connectDB = async () => {
	// If mock mongoose is being used, just connect and return
	if (mongoose.connection.host === 'LocalJSON' || mongoose.isValidObjectId) {
		return mongoose.connect();
	}

	if (!env.mongoUri) {
		console.log('No MONGODB_URI configured. Launching MongoMemoryServer...');
		const { MongoMemoryServer } = require('mongodb-memory-server');
		mongoServer = await MongoMemoryServer.create();
		env.mongoUri = mongoServer.getUri();
		console.log(`MongoMemoryServer started at: ${env.mongoUri}`);
	}

	if (mongoose.connection.readyState === 1) {
		return mongoose.connection;
	}

	const connection = await mongoose.connect(env.mongoUri);

	console.log(`MongoDB connected: ${connection.connection.host}`);

	// If we are using MongoMemoryServer, auto-seed the database
	if (mongoServer) {
		await autoSeed();
	}

	return connection;
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
