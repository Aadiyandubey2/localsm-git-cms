const mongoose = require('mongoose');
const WebsiteSettings = require('../models/WebsiteSettings');

const createError = (statusCode, message) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
};

const assertValidId = (id) => {
	if (!mongoose.isValidObjectId(id)) {
		throw createError(400, 'Invalid website settings id');
	}
};

const createWebsiteSettings = async (data) => WebsiteSettings.create(data);

const getAllWebsiteSettings = async () => WebsiteSettings.find().sort({ createdAt: -1 });

const getWebsiteSettingsById = async (id) => {
	assertValidId(id);

	const settings = await WebsiteSettings.findById(id);

	if (!settings) {
		throw createError(404, 'Website settings not found');
	}

	return settings;
};

const updateWebsiteSettings = async (id, data) => {
	assertValidId(id);

	const settings = await WebsiteSettings.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});

	if (!settings) {
		throw createError(404, 'Website settings not found');
	}

	return settings;
};

const deleteWebsiteSettings = async (id) => {
	assertValidId(id);

	const settings = await WebsiteSettings.findByIdAndDelete(id);

	if (!settings) {
		throw createError(404, 'Website settings not found');
	}

	return settings;
};

module.exports = {
	createWebsiteSettings,
	getAllWebsiteSettings,
	getWebsiteSettingsById,
	updateWebsiteSettings,
	deleteWebsiteSettings,
};
