const founderService = require('../services/founder.service');

const createFounder = async (req, res) => {
	const founder = await founderService.createFounder(req.body);

	res.status(201).json({
		success: true,
		message: 'Founder created successfully',
		data: founder,
	});
};

const getFounders = async (req, res) => {
	const founders = await founderService.getAllFounders();

	res.status(200).json({
		success: true,
		data: founders,
	});
};

const getFounderById = async (req, res) => {
	const founder = await founderService.getFounderById(req.params.id);

	res.status(200).json({
		success: true,
		data: founder,
	});
};

const updateFounder = async (req, res) => {
	const founder = await founderService.updateFounder(req.params.id, req.body);

	res.status(200).json({
		success: true,
		message: 'Founder updated successfully',
		data: founder,
	});
};

const deleteFounder = async (req, res) => {
	await founderService.deleteFounder(req.params.id);

	res.status(200).json({
		success: true,
		message: 'Founder deleted successfully',
	});
};

module.exports = {
	createFounder,
	getFounders,
	getFounderById,
	updateFounder,
	deleteFounder,
};
