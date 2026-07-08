const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validation.middleware');

const createContactValidator = [
	body('name').trim().notEmpty().withMessage('Name is required'),
	body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be valid').normalizeEmail(),
	body('phone').optional().isString().withMessage('Phone must be a string'),
	body('subject').optional().isString().withMessage('Subject must be a string'),
	body('message').trim().notEmpty().withMessage('Message is required'),
	body('status').optional().isIn(['new', 'read', 'replied', 'archived']).withMessage('Status is invalid'),
	body('isRead').optional().isBoolean().withMessage('isRead must be boolean'),
	validateRequest,
];

const updateContactValidator = [
	param('id').isMongoId().withMessage('Contact id must be valid'),
	body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
	body('email').optional().trim().isEmail().withMessage('Email must be valid').normalizeEmail(),
	body('phone').optional().isString().withMessage('Phone must be a string'),
	body('subject').optional().isString().withMessage('Subject must be a string'),
	body('message').optional().trim().notEmpty().withMessage('Message cannot be empty'),
	body('status').optional().isIn(['new', 'read', 'replied', 'archived']).withMessage('Status is invalid'),
	body('isRead').optional().isBoolean().withMessage('isRead must be boolean'),
	validateRequest,
];

const contactIdValidator = [param('id').isMongoId().withMessage('Contact id must be valid'), validateRequest];

module.exports = {
	createContactValidator,
	updateContactValidator,
	contactIdValidator,
};
