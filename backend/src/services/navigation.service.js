const mongoose = require('mongoose');
const Navigation = require('../models/Navigation');

const createError = (statusCode, message) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
};

const assertValidId = (id) => {
	if (!mongoose.isValidObjectId(id)) {
		throw createError(400, 'Invalid navigation id');
	}
};

const createNavigation = async (data) => Navigation.create(data);

const getAllNavigations = async () => Navigation.find().sort({ createdAt: -1 });

const getNavigationById = async (id) => {
	assertValidId(id);

	const navigation = await Navigation.findById(id);

	if (!navigation) {
		throw createError(404, 'Navigation not found');
	}

	return navigation;
};

const updateNavigation = async (id, data) => {
	assertValidId(id);

	const navigation = await Navigation.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});

	if (!navigation) {
		throw createError(404, 'Navigation not found');
	}

	return navigation;
};

const deleteNavigation = async (id) => {
	assertValidId(id);

	const navigation = await Navigation.findByIdAndDelete(id);

	if (!navigation) {
		throw createError(404, 'Navigation not found');
	}

	return navigation;
};

module.exports = {
	createNavigation,
	getAllNavigations,
	getNavigationById,
	updateNavigation,
	deleteNavigation,
};
