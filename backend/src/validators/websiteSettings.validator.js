const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validation.middleware');

const createWebsiteSettingsValidator = [
	body('siteName').trim().notEmpty().withMessage('Site name is required'),
	body('tagline').optional().isString().withMessage('Tagline must be a string'),
	body('description').optional().isString().withMessage('Description must be a string'),
	body('email').optional().isEmail().withMessage('Email must be valid').normalizeEmail(),
	body('phone').optional().isString().withMessage('Phone must be a string'),
	body('address').optional().isString().withMessage('Address must be a string'),
	body('socialLinks').optional().isArray().withMessage('Social links must be an array'),
	body('seo').optional().isObject().withMessage('SEO must be an object'),
	body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
	validateRequest,
];

const updateWebsiteSettingsValidator = [
	param('id').isMongoId().withMessage('Website settings id must be valid'),
	body('siteName').optional().trim().notEmpty().withMessage('Site name cannot be empty'),
	body('tagline').optional().isString().withMessage('Tagline must be a string'),
	body('description').optional().isString().withMessage('Description must be a string'),
	body('email').optional().isEmail().withMessage('Email must be valid').normalizeEmail(),
	body('phone').optional().isString().withMessage('Phone must be a string'),
	body('address').optional().isString().withMessage('Address must be a string'),
	body('socialLinks').optional().isArray().withMessage('Social links must be an array'),
	body('seo').optional().isObject().withMessage('SEO must be an object'),
	body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
	validateRequest,
];

const websiteSettingsIdValidator = [
	param('id').isMongoId().withMessage('Website settings id must be valid'),
	validateRequest,
];

module.exports = {
	createWebsiteSettingsValidator,
	updateWebsiteSettingsValidator,
	websiteSettingsIdValidator,
};
