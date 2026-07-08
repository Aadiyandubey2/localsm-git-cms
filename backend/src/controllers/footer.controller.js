const footerService = require('../services/footer.service');

const createFooter = async (req, res) => {
	const footer = await footerService.createFooter(req.body);

	res.status(201).json({
		success: true,
		message: 'Footer created successfully',
		data: footer,
	});
};

const getFooters = async (req, res) => {
	const footers = await footerService.getAllFooters();

	res.status(200).json({
		success: true,
		data: footers,
	});
};

const getFooterById = async (req, res) => {
	const footer = await footerService.getFooterById(req.params.id);

	res.status(200).json({
		success: true,
		data: footer,
	});
};

const updateFooter = async (req, res) => {
	const footer = await footerService.updateFooter(req.params.id, req.body);

	res.status(200).json({
		success: true,
		message: 'Footer updated successfully',
		data: footer,
	});
};

const deleteFooter = async (req, res) => {
	await footerService.deleteFooter(req.params.id);

	res.status(200).json({
		success: true,
		message: 'Footer deleted successfully',
	});
};

module.exports = {
	createFooter,
	getFooters,
	getFooterById,
	updateFooter,
	deleteFooter,
};
