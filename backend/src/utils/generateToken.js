const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (payload, options = {}) => {
	if (!env.jwtSecret) {
		throw new Error('JWT secret is not configured');
	}

	return jwt.sign(payload, env.jwtSecret, {
		expiresIn: env.jwtExpiresIn,
		...options,
	});
};

module.exports = generateToken;
