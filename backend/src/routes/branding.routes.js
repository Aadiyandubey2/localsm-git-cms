const express = require('express');
const brandingController = require('../controllers/branding.controller');
const authMiddleware = require('../middleware/auth.middleware');
const {
	createBrandingValidator,
	updateBrandingValidator,
	brandingIdValidator,
} = require('../validators/branding.validator');

const router = express.Router();

router.get('/', brandingController.getBrandings);
router.get('/:id', brandingIdValidator, brandingController.getBrandingById);
router.post('/', authMiddleware.protect, createBrandingValidator, brandingController.createBranding);
router.patch('/:id', authMiddleware.protect, updateBrandingValidator, brandingController.updateBranding);
router.delete('/:id', authMiddleware.protect, brandingIdValidator, brandingController.deleteBranding);

module.exports = router;
