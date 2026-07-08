const express = require('express');
const navigationController = require('../controllers/navigation.controller');
const authMiddleware = require('../middleware/auth.middleware');
const {
	createNavigationValidator,
	updateNavigationValidator,
	navigationIdValidator,
} = require('../validators/navigation.validator');

const router = express.Router();

router.get('/', navigationController.getNavigations);
router.get('/:id', navigationIdValidator, navigationController.getNavigationById);
router.post('/', authMiddleware.protect, createNavigationValidator, navigationController.createNavigation);
router.patch('/:id', authMiddleware.protect, updateNavigationValidator, navigationController.updateNavigation);
router.delete('/:id', authMiddleware.protect, navigationIdValidator, navigationController.deleteNavigation);

module.exports = router;
