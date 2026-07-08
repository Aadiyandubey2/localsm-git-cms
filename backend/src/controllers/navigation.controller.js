const navigationService = require('../services/navigation.service');

const createNavigation = async (req, res) => {
	const navigation = await navigationService.createNavigation(req.body);

	res.status(201).json({
		success: true,
		message: 'Navigation created successfully',
		data: navigation,
	});
};

const getNavigations = async (req, res) => {
	const navigations = await navigationService.getAllNavigations();

	res.status(200).json({
		success: true,
		data: navigations,
	});
};

const getNavigationById = async (req, res) => {
	const navigation = await navigationService.getNavigationById(req.params.id);

	res.status(200).json({
		success: true,
		data: navigation,
	});
};

const updateNavigation = async (req, res) => {
	const navigation = await navigationService.updateNavigation(req.params.id, req.body);

	res.status(200).json({
		success: true,
		message: 'Navigation updated successfully',
		data: navigation,
	});
};

const deleteNavigation = async (req, res) => {
	await navigationService.deleteNavigation(req.params.id);

	res.status(200).json({
		success: true,
		message: 'Navigation deleted successfully',
	});
};

module.exports = {
	createNavigation,
	getNavigations,
	getNavigationById,
	updateNavigation,
	deleteNavigation,
};
