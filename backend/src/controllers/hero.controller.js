const heroService = require('../services/hero.service');

const createHero = async (req, res) => {
	const hero = await heroService.createHero(req.body);

	res.status(201).json({
		success: true,
		message: 'Hero created successfully',
		data: hero,
	});
};

const getHeroes = async (req, res) => {
	const heroes = await heroService.getAllHeroes();

	res.status(200).json({
		success: true,
		data: heroes,
	});
};

const getHeroById = async (req, res) => {
	const hero = await heroService.getHeroById(req.params.id);

	res.status(200).json({
		success: true,
		data: hero,
	});
};

const updateHero = async (req, res) => {
	const hero = await heroService.updateHero(req.params.id, req.body);

	res.status(200).json({
		success: true,
		message: 'Hero updated successfully',
		data: hero,
	});
};

const deleteHero = async (req, res) => {
	await heroService.deleteHero(req.params.id);

	res.status(200).json({
		success: true,
		message: 'Hero deleted successfully',
	});
};

module.exports = {
	createHero,
	getHeroes,
	getHeroById,
	updateHero,
	deleteHero,
};
