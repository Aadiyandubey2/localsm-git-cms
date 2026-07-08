const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validation.middleware');

const createBrandingValidator = [
	body('siteName').trim().notEmpty().withMessage('Site name is required'),
	body('logo').optional().isString().withMessage('Logo must be a string'),
	body('favicon').optional().isString().withMessage('Favicon must be a string'),
	body('primaryColor').optional().isString().withMessage('Primary color must be a string'),
	body('secondaryColor').optional().isString().withMessage('Secondary color must be a string'),
	body('accentColor').optional().isString().withMessage('Accent color must be a string'),
	body('fontFamily').optional().isString().withMessage('Font family must be a string'),
	body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
	validateRequest,
];

const updateBrandingValidator = [
	param('id').isMongoId().withMessage('Branding id must be valid'),
	body('siteName').optional().trim().notEmpty().withMessage('Site name cannot be empty'),
	body('logo').optional().isString().withMessage('Logo must be a string'),
	body('favicon').optional().isString().withMessage('Favicon must be a string'),
	body('primaryColor').optional().isString().withMessage('Primary color must be a string'),
	body('secondaryColor').optional().isString().withMessage('Secondary color must be a string'),
	body('accentColor').optional().isString().withMessage('Accent color must be a string'),
	body('fontFamily').optional().isString().withMessage('Font family must be a string'),
	body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
	validateRequest,
];

const brandingIdValidator = [param('id').isMongoId().withMessage('Branding id must be valid'), validateRequest];

module.exports = {
	createBrandingValidator,
	updateBrandingValidator,
	brandingIdValidator,
};
