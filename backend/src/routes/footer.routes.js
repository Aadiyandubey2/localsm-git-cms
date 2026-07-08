const express = require('express');
const footerController = require('../controllers/footer.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { createFooterValidator, updateFooterValidator, footerIdValidator } = require('../validators/footer.validator');

const router = express.Router();

router.get('/', footerController.getFooters);
router.get('/:id', footerIdValidator, footerController.getFooterById);
router.post('/', authMiddleware.protect, createFooterValidator, footerController.createFooter);
router.patch('/:id', authMiddleware.protect, updateFooterValidator, footerController.updateFooter);
router.delete('/:id', authMiddleware.protect, footerIdValidator, footerController.deleteFooter);

module.exports = router;
