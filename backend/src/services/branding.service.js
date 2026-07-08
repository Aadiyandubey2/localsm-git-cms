const mongoose = require('mongoose');
const Branding = require('../models/Branding');

const createError = (statusCode, message) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
};

const assertValidId = (id) => {
	if (!mongoose.isValidObjectId(id)) {
		throw createError(400, 'Invalid branding id');
	}
};

const createBranding = async (data) => Branding.create(data);

const getAllBrandings = async () => Branding.find().sort({ createdAt: -1 });

const getBrandingById = async (id) => {
	assertValidId(id);

	const branding = await Branding.findById(id);

	if (!branding) {
		throw createError(404, 'Branding not found');
	}

	return branding;
};

const updateBranding = async (id, data) => {
	assertValidId(id);

	const branding = await Branding.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});

	if (!branding) {
		throw createError(404, 'Branding not found');
	}

	return branding;
};

const deleteBranding = async (id) => {
	assertValidId(id);

	const branding = await Branding.findByIdAndDelete(id);

	if (!branding) {
		throw createError(404, 'Branding not found');
	}

	return branding;
};

module.exports = {
	createBranding,
	getAllBrandings,
	getBrandingById,
	updateBranding,
	deleteBranding,
};
