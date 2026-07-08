const mongoose = require('../utils/mongoose-mock');
const Founder = require('../models/Founder');

const createError = (statusCode, message) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
};

const assertValidId = (id) => {
	if (!mongoose.isValidObjectId(id)) {
		throw createError(400, 'Invalid founder id');
	}
};

const createFounder = async (data) => Founder.create(data);

const getAllFounders = async () => Founder.find().sort({ createdAt: -1 });

const getFounderById = async (id) => {
	assertValidId(id);

	const founder = await Founder.findById(id);

	if (!founder) {
		throw createError(404, 'Founder not found');
	}

	return founder;
};

const updateFounder = async (id, data) => {
	assertValidId(id);

	const founder = await Founder.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});

	if (!founder) {
		throw createError(404, 'Founder not found');
	}

	return founder;
};

const deleteFounder = async (id) => {
	assertValidId(id);

	const founder = await Founder.findByIdAndDelete(id);

	if (!founder) {
		throw createError(404, 'Founder not found');
	}

	return founder;
};

module.exports = {
	createFounder,
	getAllFounders,
	getFounderById,
	updateFounder,
	deleteFounder,
};
