const express = require('express');

const authRoutes = require('./auth.routes');
const heroRoutes = require('./hero.routes');
const founderRoutes = require('./founder.routes');
const businessRoutes = require('./business.routes');
const navigationRoutes = require('./navigation.routes');
const footerRoutes = require('./footer.routes');
const contactRoutes = require('./contact.routes');
const brandingRoutes = require('./branding.routes');
const uploadRoutes = require('./upload.routes');
const websiteSettingsRoutes = require('./websiteSettings.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/heroes', heroRoutes);
router.use('/founders', founderRoutes);
router.use('/businesses', businessRoutes);
router.use('/navigation', navigationRoutes);
router.use('/footer', footerRoutes);
router.use('/contacts', contactRoutes);
router.use('/branding', brandingRoutes);
router.use('/upload', uploadRoutes);
router.use('/website-settings', websiteSettingsRoutes);
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to LocalSM API",
  });
});
module.exports = router;
