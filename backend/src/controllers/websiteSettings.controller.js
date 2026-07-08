const websiteSettingsService = require('../services/websiteSettings.service');

const createWebsiteSettings = async (req, res) => {
	const settings = await websiteSettingsService.createWebsiteSettings(req.body);

	res.status(201).json({
		success: true,
		message: 'Website settings created successfully',
		data: settings,
	});
};

const getWebsiteSettings = async (req, res) => {
	const settings = await websiteSettingsService.getAllWebsiteSettings();

	res.status(200).json({
		success: true,
		data: settings,
	});
};

const getWebsiteSettingsById = async (req, res) => {
	const settings = await websiteSettingsService.getWebsiteSettingsById(req.params.id);

	res.status(200).json({
		success: true,
		data: settings,
	});
};

const updateWebsiteSettings = async (req, res) => {
	const settings = await websiteSettingsService.updateWebsiteSettings(req.params.id, req.body);

	res.status(200).json({
		success: true,
		message: 'Website settings updated successfully',
		data: settings,
	});
};

const deleteWebsiteSettings = async (req, res) => {
	await websiteSettingsService.deleteWebsiteSettings(req.params.id);

	res.status(200).json({
		success: true,
		message: 'Website settings deleted successfully',
	});
};

module.exports = {
	createWebsiteSettings,
	getWebsiteSettings,
	getWebsiteSettingsById,
	updateWebsiteSettings,
	deleteWebsiteSettings,
};
