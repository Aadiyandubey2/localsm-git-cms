const mongoose = require('mongoose');
const Business = require('../models/Business');

const createError = (statusCode, message) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
};

const assertValidId = (id) => {
	if (!mongoose.isValidObjectId(id)) {
		throw createError(400, 'Invalid business id');
	}
};

const createBusiness = async (data) => Business.create(data);

const getAllBusinesses = async () => Business.find().sort({ sortOrder: 1, createdAt: -1 });

const getBusinessById = async (id) => {
	assertValidId(id);

	const business = await Business.findById(id);

	if (!business) {
		throw createError(404, 'Business not found');
	}

	return business;
};

const updateBusiness = async (id, data) => {
	assertValidId(id);

	const business = await Business.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});

	if (!business) {
		throw createError(404, 'Business not found');
	}

	return business;
};

const deleteBusiness = async (id) => {
	assertValidId(id);

	const business = await Business.findByIdAndDelete(id);

	if (!business) {
		throw createError(404, 'Business not found');
	}

	return business;
};

module.exports = {
	createBusiness,
	getAllBusinesses,
	getBusinessById,
	updateBusiness,
	deleteBusiness,
};
