const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Admin = require('../models/Admin');

const createError = (statusCode, message) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
};

const extractToken = (req) => {
	const authHeader = req.headers.authorization;

	if (authHeader && authHeader.startsWith('Bearer ')) {
		return authHeader.split(' ')[1];
	}

	if (req.cookies && req.cookies.token) {
		return req.cookies.token;
	}

	return null;
};

const protect = async (req, res, next) => {
	try {
		const token = extractToken(req);

		if (!token) {
			return next(createError(401, 'Not authorized, token missing'));
		}

		if (!env.jwtSecret) {
			return next(createError(500, 'JWT secret is not configured'));
		}

		const decoded = jwt.verify(token, env.jwtSecret);
		const admin = await Admin.findById(decoded.id).select('-password -refreshToken');

		if (!admin) {
			return next(createError(401, 'Not authorized, user not found'));
		}

		req.user = admin;
		return next();
	} catch (error) {
		return next(createError(401, 'Not authorized, token invalid'));
	}
};

module.exports = {
	protect,
};
