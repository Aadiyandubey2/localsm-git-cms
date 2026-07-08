const brandingService = require('../services/branding.service');

const createBranding = async (req, res) => {
	const branding = await brandingService.createBranding(req.body);

	res.status(201).json({
		success: true,
		message: 'Branding created successfully',
		data: branding,
	});
};

const getBrandings = async (req, res) => {
	const brandings = await brandingService.getAllBrandings();

	res.status(200).json({
		success: true,
		data: brandings,
	});
};

const getBrandingById = async (req, res) => {
	const branding = await brandingService.getBrandingById(req.params.id);

	res.status(200).json({
		success: true,
		data: branding,
	});
};

const updateBranding = async (req, res) => {
	const branding = await brandingService.updateBranding(req.params.id, req.body);

	res.status(200).json({
		success: true,
		message: 'Branding updated successfully',
		data: branding,
	});
};

const deleteBranding = async (req, res) => {
	await brandingService.deleteBranding(req.params.id);

	res.status(200).json({
		success: true,
		message: 'Branding deleted successfully',
	});
};

module.exports = {
	createBranding,
	getBrandings,
	getBrandingById,
	updateBranding,
	deleteBranding,
};
