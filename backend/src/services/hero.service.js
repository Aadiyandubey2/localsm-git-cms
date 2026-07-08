const mongoose = require('mongoose');
const Hero = require('../models/Hero');

const createError = (statusCode, message) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
};

const assertValidId = (id) => {
	if (!mongoose.isValidObjectId(id)) {
		throw createError(400, 'Invalid hero id');
	}
};

const createHero = async (data) => Hero.create(data);

const getAllHeroes = async () => Hero.find().sort({ createdAt: -1 });

const getHeroById = async (id) => {
	assertValidId(id);

	const hero = await Hero.findById(id);

	if (!hero) {
		throw createError(404, 'Hero not found');
	}

	return hero;
};

const updateHero = async (id, data) => {
	assertValidId(id);

	const hero = await Hero.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});

	if (!hero) {
		throw createError(404, 'Hero not found');
	}

	return hero;
};

const deleteHero = async (id) => {
	assertValidId(id);

	const hero = await Hero.findByIdAndDelete(id);

	if (!hero) {
		throw createError(404, 'Hero not found');
	}

	return hero;
};

module.exports = {
	createHero,
	getAllHeroes,
	getHeroById,
	updateHero,
	deleteHero,
};
