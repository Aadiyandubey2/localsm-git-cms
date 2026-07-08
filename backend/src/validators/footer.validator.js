const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validation.middleware');

const createFooterValidator = [
  body('logo').optional().isString().withMessage('Logo must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('links').optional().isArray().withMessage('Links must be an array'),
  body('links.*.label').optional().if(body('links').exists()).isString().withMessage('Link label must be a string'),
  body('links.*.href').optional().if(body('links').exists()).isString().withMessage('Link href must be a string'),
  body('socialLinks').optional().isArray().withMessage('Social links must be an array'),
  body('socialLinks.*.platform').optional().if(body('socialLinks').exists()).isString().withMessage('Social platform must be a string'),
  body('socialLinks.*.url').optional().if(body('socialLinks').exists()).isString().withMessage('Social url must be a string'),
  body('copyrightText').optional().isString().withMessage('Copyright text must be a string'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  validateRequest,
];

const updateFooterValidator = [
  param('id').isMongoId().withMessage('Footer id must be valid'),
  body('logo').optional().isString().withMessage('Logo must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('links').optional().isArray().withMessage('Links must be an array'),
  body('links.*.label').optional().if(body('links').exists()).isString().withMessage('Link label must be a string'),
  body('links.*.href').optional().if(body('links').exists()).isString().withMessage('Link href must be a string'),
  body('socialLinks').optional().isArray().withMessage('Social links must be an array'),
  body('socialLinks.*.platform').optional().if(body('socialLinks').exists()).isString().withMessage('Social platform must be a string'),
  body('socialLinks.*.url').optional().if(body('socialLinks').exists()).isString().withMessage('Social url must be a string'),
  body('copyrightText').optional().isString().withMessage('Copyright text must be a string'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  validateRequest,
];

const footerIdValidator = [param('id').isMongoId().withMessage('Footer id must be valid'), validateRequest];

module.exports = {
  createFooterValidator,
  updateFooterValidator,
  footerIdValidator,
};