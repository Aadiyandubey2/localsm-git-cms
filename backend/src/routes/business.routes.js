const express = require('express');
const businessController = require('../controllers/business.controller');
const authMiddleware = require('../middleware/auth.middleware');
const {
	createBusinessValidator,
	updateBusinessValidator,
	businessIdValidator,
} = require('../validators/business.validator');

const router = express.Router();

router.get('/', businessController.getBusinesses);
router.get('/:id', businessIdValidator, businessController.getBusinessById);
router.post('/', authMiddleware.protect, createBusinessValidator, businessController.createBusiness);
router.patch('/:id', authMiddleware.protect, updateBusinessValidator, businessController.updateBusiness);
router.delete('/:id', authMiddleware.protect, businessIdValidator, businessController.deleteBusiness);

module.exports = router;
