const { v2: cloudinary } = require('cloudinary');
const env = require('./env');

const configureCloudinary = () => {
	const { cloudName, apiKey, apiSecret } = env.cloudinary;

	if (!cloudName || !apiKey || !apiSecret) {
		return cloudinary;
	}

	cloudinary.config({
		cloud_name: cloudName,
		api_key: apiKey,
		api_secret: apiSecret,
		secure: true,
	});

	return cloudinary;
};

module.exports = configureCloudinary();
module.exports.configureCloudinary = configureCloudinary;
module.exports.cloudinary = cloudinary;
