const mongoose = require('../utils/mongoose-mock');
const Footer = require('../models/Footer');

const createError = (statusCode, message) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
};

const assertValidId = (id) => {
	if (!mongoose.isValidObjectId(id)) {
		throw createError(400, 'Invalid footer id');
	}
};

const createFooter = async (data) => Footer.create(data);

const getAllFooters = async () => Footer.find().sort({ createdAt: -1 });

const getFooterById = async (id) => {
	assertValidId(id);

	const footer = await Footer.findById(id);

	if (!footer) {
		throw createError(404, 'Footer not found');
	}

	return footer;
};

const updateFooter = async (id, data) => {
	assertValidId(id);

	const footer = await Footer.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});

	if (!footer) {
		throw createError(404, 'Footer not found');
	}

	return footer;
};

const deleteFooter = async (id) => {
	assertValidId(id);

	const footer = await Footer.findByIdAndDelete(id);

	if (!footer) {
		throw createError(404, 'Footer not found');
	}

	return footer;
};

module.exports = {
	createFooter,
	getAllFooters,
	getFooterById,
	updateFooter,
	deleteFooter,
};
