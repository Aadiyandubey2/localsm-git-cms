const bcrypt = require('bcryptjs');
const mongoose = require('../utils/mongoose-mock');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

const createError = (statusCode, message) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
};

const assertValidId = (id) => {
	if (!mongoose.isValidObjectId(id)) {
		throw createError(400, 'Invalid admin id');
	}
};

const createAdmin = async (data) => Admin.create(data);

const getAllAdmins = async () => Admin.find().sort({ createdAt: -1 });

const getAdminById = async (id) => {
	assertValidId(id);

	const admin = await Admin.findById(id);

	if (!admin) {
		throw createError(404, 'Admin not found');
	}

	return admin;
};

const updateAdmin = async (id, data) => {
	assertValidId(id);

	const admin = await Admin.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});

	if (!admin) {
		throw createError(404, 'Admin not found');
	}

	return admin;
};

const deleteAdmin = async (id) => {
	assertValidId(id);

	const admin = await Admin.findByIdAndDelete(id);

	if (!admin) {
		throw createError(404, 'Admin not found');
	}

	return admin;
};

const findAdminByEmail = async (email) => Admin.findOne({ email: email.toLowerCase().trim() });

const loginAdmin = async ({ email, password }) => {
	const normalizedEmail = email.toLowerCase().trim();
	const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');

	if (!admin || !admin.isActive) {
		throw createError(401, 'Invalid email or password');
	}

	const isPasswordValid = await bcrypt.compare(password, admin.password).catch(() => false);

	if (!isPasswordValid) {
		throw createError(401, 'Invalid email or password');
	}

	const token = generateToken({ id: admin._id.toString() });
	const safeAdmin = await Admin.findById(admin._id).select('-password -refreshToken');

	return {
		admin: safeAdmin,
		token,
	};
};

module.exports = {
	createAdmin,
	getAllAdmins,
	getAdminById,
	updateAdmin,
	deleteAdmin,
	findAdminByEmail,
	loginAdmin,
};
