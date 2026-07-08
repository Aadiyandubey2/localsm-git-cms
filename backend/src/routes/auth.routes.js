const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');
const { createAdminValidator, updateAdminValidator, adminIdValidator, loginValidator } = require('../validators/auth.validator');

const router = express.Router();

router.post('/login', loginValidator, asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));
router.get('/me', authMiddleware.protect, asyncHandler(authController.me));

router.get('/admins', asyncHandler(authController.getAdmins));
router.get('/admins/:id', adminIdValidator, asyncHandler(authController.getAdminById));
router.post('/admins', authMiddleware.protect, createAdminValidator, asyncHandler(authController.createAdmin));
router.patch('/admins/:id', authMiddleware.protect, updateAdminValidator, asyncHandler(authController.updateAdmin));
router.delete('/admins/:id', authMiddleware.protect, adminIdValidator, asyncHandler(authController.deleteAdmin));

module.exports = router;
