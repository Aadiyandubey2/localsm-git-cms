const dotenv = require('dotenv');

const vercelPort = process.env.PORT;

dotenv.config();

const env = {
	port: Number(vercelPort || process.env.PORT) || 5000,
	nodeEnv: process.env.NODE_ENV || 'development',
	mongoUri: process.env.MONGODB_URI || process.env.MONGO_URI || '',
	jwtSecret: process.env.JWT_SECRET || 'localsm_default_secret_key_987654321',
	jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
	cloudinary: {
		cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
		apiKey: process.env.CLOUDINARY_API_KEY || '',
		apiSecret: process.env.CLOUDINARY_API_SECRET || '',
	},
};

module.exports = env;
