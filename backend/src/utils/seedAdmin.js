const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const env = require('../config/env');
const logger = require('./logger');

const DEFAULT_ADMIN = {
	name: 'LocalSM Admin',
	email: 'admin@localsm.com',
	password: 'Admin@12345',
	role: 'superadmin',
};

const seedAdmin = async (adminData = {}) => {
	const candidate = {
		...DEFAULT_ADMIN,
		...adminData,
		email: (adminData.email || DEFAULT_ADMIN.email).toLowerCase().trim(),
	};

	if (!candidate.password) {
		throw new Error('Admin password is required for seeding');
	}

	const existingAdmin = await Admin.findOne({ email: candidate.email });

	if (existingAdmin) {
		logger.info(`Admin already exists for ${candidate.email}`);
		return existingAdmin;
	}

	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(candidate.password, saltRounds);

	const createdAdmin = await Admin.create({
		name: candidate.name,
		email: candidate.email,
		password: hashedPassword,
		role: candidate.role,
		avatar: candidate.avatar || '',
		isActive: candidate.isActive ?? true,
	});

	logger.info(`Seeded admin account for ${createdAdmin.email}`);

	return createdAdmin;
};

seedAdmin.defaults = DEFAULT_ADMIN;

module.exports = seedAdmin;
