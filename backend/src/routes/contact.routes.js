const express = require('express');
const contactController = require('../controllers/contact.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { createContactValidator, updateContactValidator, contactIdValidator } = require('../validators/contact.validator');

const router = express.Router();

router.post('/', createContactValidator, contactController.createContact);
router.get('/', authMiddleware.protect, contactController.getContacts);
router.get('/:id', authMiddleware.protect, contactIdValidator, contactController.getContactById);
router.patch('/:id', authMiddleware.protect, updateContactValidator, contactController.updateContact);
router.delete('/:id', authMiddleware.protect, contactIdValidator, contactController.deleteContact);

module.exports = router;
