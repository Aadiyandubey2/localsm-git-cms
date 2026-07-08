const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validation.middleware');

const nameField = body('name')
	.trim()
	.notEmpty()
	.withMessage('Name is required')
	.isLength({ min: 2 })
	.withMessage('Name must be at least 2 characters long');

const emailField = body('email')
	.trim()
	.notEmpty()
	.withMessage('Email is required')
	.isEmail()
	.withMessage('Email must be valid')
	.normalizeEmail();

const passwordField = body('password')
	.notEmpty()
	.withMessage('Password is required')
	.isLength({ min: 6 })
	.withMessage('Password must be at least 6 characters long');

const roleField = body('role')
	.optional()
	.isIn(['admin', 'superadmin'])
	.withMessage('Role must be admin or superadmin');

const avatarField = body('avatar').optional().isString().withMessage('Avatar must be a string');

const createAdminValidator = [nameField, emailField, passwordField, roleField, avatarField, validateRequest];

const loginValidator = [
	body('email')
		.trim()
		.notEmpty()
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Email must be valid')
		.normalizeEmail(),
	body('password').notEmpty().withMessage('Password is required'),
	validateRequest,
];

const updateAdminValidator = [
	param('id').isMongoId().withMessage('Admin id must be valid'),
	body('name')
		.optional()
		.trim()
		.isLength({ min: 2 })
		.withMessage('Name must be at least 2 characters long'),
	body('email').optional().trim().isEmail().withMessage('Email must be valid').normalizeEmail(),
	body('password')
		.optional()
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long'),
	body('role').optional().isIn(['admin', 'superadmin']).withMessage('Role must be admin or superadmin'),
	body('avatar').optional().isString().withMessage('Avatar must be a string'),
	validateRequest,
];

const adminIdValidator = [param('id').isMongoId().withMessage('Admin id must be valid'), validateRequest];

module.exports = {
	createAdminValidator,
	loginValidator,
	updateAdminValidator,
	adminIdValidator,
};
