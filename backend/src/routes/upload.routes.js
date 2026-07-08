const express = require('express');
const upload = require('../middleware/upload.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const uploadController = require('../controllers/upload.controller');

const router = express.Router();

router.post('/file', authMiddleware.protect, upload.single('file'), uploadController.uploadAsset);
router.delete('/file/:publicId', authMiddleware.protect, uploadController.deleteAsset);

module.exports = router;
