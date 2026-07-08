const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validation.middleware');

const createHeroValidator = [
	body('title').trim().notEmpty().withMessage('Title is required'),
	body('subtitle').optional().isString().withMessage('Subtitle must be a string'),
	body('description').optional().isString().withMessage('Description must be a string'),
	body('image').optional().isString().withMessage('Image must be a string'),
	body('ctaText').optional().isString().withMessage('CTA text must be a string'),
	body('ctaLink').optional().isString().withMessage('CTA link must be a string'),
	body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
	validateRequest,
];

const updateHeroValidator = [
	param('id').isMongoId().withMessage('Hero id must be valid'),
	body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
	body('subtitle').optional().isString().withMessage('Subtitle must be a string'),
	body('description').optional().isString().withMessage('Description must be a string'),
	body('image').optional().isString().withMessage('Image must be a string'),
	body('ctaText').optional().isString().withMessage('CTA text must be a string'),
	body('ctaLink').optional().isString().withMessage('CTA link must be a string'),
	body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
	validateRequest,
];

const heroIdValidator = [param('id').isMongoId().withMessage('Hero id must be valid'), validateRequest];

module.exports = {
	createHeroValidator,
	updateHeroValidator,
	heroIdValidator,
};
