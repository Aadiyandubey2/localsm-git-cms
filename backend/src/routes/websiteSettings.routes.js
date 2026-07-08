const express = require('express');
const websiteSettingsController = require('../controllers/websiteSettings.controller');
const authMiddleware = require('../middleware/auth.middleware');
const {
	createWebsiteSettingsValidator,
	updateWebsiteSettingsValidator,
	websiteSettingsIdValidator,
} = require('../validators/websiteSettings.validator');

const router = express.Router();

router.get('/', websiteSettingsController.getWebsiteSettings);
router.get('/:id', websiteSettingsIdValidator, websiteSettingsController.getWebsiteSettingsById);
router.post('/', authMiddleware.protect, createWebsiteSettingsValidator, websiteSettingsController.createWebsiteSettings);
router.patch('/:id', authMiddleware.protect, updateWebsiteSettingsValidator, websiteSettingsController.updateWebsiteSettings);
router.delete('/:id', authMiddleware.protect, websiteSettingsIdValidator, websiteSettingsController.deleteWebsiteSettings);

module.exports = router;
