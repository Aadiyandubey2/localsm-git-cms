const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validation.middleware');

const pointValidator = body('points').optional().isArray().withMessage('Points must be an array');

const createBusinessValidator = [
	body('title').trim().notEmpty().withMessage('Title is required'),
	body('description').optional().isString().withMessage('Description must be a string'),
	body('image').optional().isString().withMessage('Image must be a string'),
	pointValidator,
	body('points.*.title').optional().if(body('points').exists()).isString().withMessage('Point title must be a string'),
	body('points.*.description').optional().if(body('points').exists()).isString().withMessage('Point description must be a string'),
	body('ctaText').optional().isString().withMessage('CTA text must be a string'),
	body('ctaLink').optional().isString().withMessage('CTA link must be a string'),
	body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
	body('sortOrder').optional().isInt().withMessage('sortOrder must be an integer'),
	validateRequest,
];

const updateBusinessValidator = [
	param('id').isMongoId().withMessage('Business id must be valid'),
	body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
	body('description').optional().isString().withMessage('Description must be a string'),
	body('image').optional().isString().withMessage('Image must be a string'),
	pointValidator,
	body('points.*.title').optional().if(body('points').exists()).isString().withMessage('Point title must be a string'),
	body('points.*.description').optional().if(body('points').exists()).isString().withMessage('Point description must be a string'),
	body('ctaText').optional().isString().withMessage('CTA text must be a string'),
	body('ctaLink').optional().isString().withMessage('CTA link must be a string'),
	body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
	body('sortOrder').optional().isInt().withMessage('sortOrder must be an integer'),
	validateRequest,
];

const businessIdValidator = [param('id').isMongoId().withMessage('Business id must be valid'), validateRequest];

module.exports = {
	createBusinessValidator,
	updateBusinessValidator,
	businessIdValidator,
};
