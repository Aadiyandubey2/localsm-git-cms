const authService = require('../services/auth.service');
const env = require('../config/env');

const getAuthCookieOptions = () => ({
	httpOnly: true,
	sameSite: 'lax',
	secure: env.nodeEnv === 'production',
	path: '/',
});

const login = async (req, res) => {
	const { admin, token } = await authService.loginAdmin(req.body);

	res.cookie('token', token, getAuthCookieOptions());

	res.status(200).json({
		success: true,
		message: 'Login successful',
		data: {
			admin,
			token,
		},
	});
};

const logout = async (req, res) => {
	res.clearCookie('token', getAuthCookieOptions());

	res.status(200).json({
		success: true,
		message: 'Logout successful',
	});
};

const me = async (req, res) => {
	res.status(200).json({
		success: true,
		data: req.user,
	});
};

const createAdmin = async (req, res) => {
	const admin = await authService.createAdmin(req.body);

	res.status(201).json({
		success: true,
		message: 'Admin created successfully',
		data: admin,
	});
};

const getAdmins = async (req, res) => {
	const admins = await authService.getAllAdmins();

	res.status(200).json({
		success: true,
		data: admins,
	});
};

const getAdminById = async (req, res) => {
	const admin = await authService.getAdminById(req.params.id);

	res.status(200).json({
		success: true,
		data: admin,
	});
};

const updateAdmin = async (req, res) => {
	const admin = await authService.updateAdmin(req.params.id, req.body);

	res.status(200).json({
		success: true,
		message: 'Admin updated successfully',
		data: admin,
	});
};

const deleteAdmin = async (req, res) => {
	await authService.deleteAdmin(req.params.id);

	res.status(200).json({
		success: true,
		message: 'Admin deleted successfully',
	});
};

module.exports = {
	login,
	logout,
	me,
	createAdmin,
	getAdmins,
	getAdminById,
	updateAdmin,
	deleteAdmin,
};
