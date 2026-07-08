const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validation.middleware');

const createNavigationValidator = [
  body('logo').optional().isString().withMessage('Logo must be a string'),
  body('menuItems').optional().isArray().withMessage('Menu items must be an array'),
  body('menuItems.*.label').optional().if(body('menuItems').exists()).isString().withMessage('Menu item label must be a string'),
  body('menuItems.*.href').optional().if(body('menuItems').exists()).isString().withMessage('Menu item href must be a string'),
  body('ctaLabel').optional().isString().withMessage('CTA label must be a string'),
  body('ctaHref').optional().isString().withMessage('CTA href must be a string'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  validateRequest,
];

const updateNavigationValidator = [
  param('id').isMongoId().withMessage('Navigation id must be valid'),
  body('logo').optional().isString().withMessage('Logo must be a string'),
  body('menuItems').optional().isArray().withMessage('Menu items must be an array'),
  body('menuItems.*.label').optional().if(body('menuItems').exists()).isString().withMessage('Menu item label must be a string'),
  body('menuItems.*.href').optional().if(body('menuItems').exists()).isString().withMessage('Menu item href must be a string'),
  body('ctaLabel').optional().isString().withMessage('CTA label must be a string'),
  body('ctaHref').optional().isString().withMessage('CTA href must be a string'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  validateRequest,
];

const navigationIdValidator = [param('id').isMongoId().withMessage('Navigation id must be valid'), validateRequest];

module.exports = {
  createNavigationValidator,
  updateNavigationValidator,
  navigationIdValidator,
};