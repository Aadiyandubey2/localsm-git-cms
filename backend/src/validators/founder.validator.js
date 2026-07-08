const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validation.middleware');

const createFounderValidator = [
	body('name').trim().notEmpty().withMessage('Name is required'),
	body('title').optional().isString().withMessage('Title must be a string'),
	body('message').optional().isString().withMessage('Message must be a string'),
	body('signatureImage').optional().isString().withMessage('Signature image must be a string'),
	body('portraitImage').optional().isString().withMessage('Portrait image must be a string'),
	body('quote').optional().isString().withMessage('Quote must be a string'),
	body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
	validateRequest,
];

const updateFounderValidator = [
	param('id').isMongoId().withMessage('Founder id must be valid'),
	body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
	body('title').optional().isString().withMessage('Title must be a string'),
	body('message').optional().isString().withMessage('Message must be a string'),
	body('signatureImage').optional().isString().withMessage('Signature image must be a string'),
	body('portraitImage').optional().isString().withMessage('Portrait image must be a string'),
	body('quote').optional().isString().withMessage('Quote must be a string'),
	body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
	validateRequest,
];

const founderIdValidator = [param('id').isMongoId().withMessage('Founder id must be valid'), validateRequest];

module.exports = {
	createFounderValidator,
	updateFounderValidator,
	founderIdValidator,
};
