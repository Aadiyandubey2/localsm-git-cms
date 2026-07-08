const express = require('express');
const founderController = require('../controllers/founder.controller');
const authMiddleware = require('../middleware/auth.middleware');
const {
	createFounderValidator,
	updateFounderValidator,
	founderIdValidator,
} = require('../validators/founder.validator');

const router = express.Router();

router.get('/', founderController.getFounders);
router.get('/:id', founderIdValidator, founderController.getFounderById);
router.post('/', authMiddleware.protect, createFounderValidator, founderController.createFounder);
router.patch('/:id', authMiddleware.protect, updateFounderValidator, founderController.updateFounder);
router.delete('/:id', authMiddleware.protect, founderIdValidator, founderController.deleteFounder);

module.exports = router;
