const businessService = require('../services/business.service');

const createBusiness = async (req, res) => {
	const business = await businessService.createBusiness(req.body);

	res.status(201).json({
		success: true,
		message: 'Business created successfully',
		data: business,
	});
};

const getBusinesses = async (req, res) => {
	const businesses = await businessService.getAllBusinesses();

	res.status(200).json({
		success: true,
		data: businesses,
	});
};

const getBusinessById = async (req, res) => {
	const business = await businessService.getBusinessById(req.params.id);

	res.status(200).json({
		success: true,
		data: business,
	});
};

const updateBusiness = async (req, res) => {
	const business = await businessService.updateBusiness(req.params.id, req.body);

	res.status(200).json({
		success: true,
		message: 'Business updated successfully',
		data: business,
	});
};

const deleteBusiness = async (req, res) => {
	await businessService.deleteBusiness(req.params.id);

	res.status(200).json({
		success: true,
		message: 'Business deleted successfully',
	});
};

module.exports = {
	createBusiness,
	getBusinesses,
	getBusinessById,
	updateBusiness,
	deleteBusiness,
};
