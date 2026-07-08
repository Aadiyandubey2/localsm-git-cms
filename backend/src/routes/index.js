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

// Generic CRUD routers for new CMS models
const makeCrudRouter = require('../utils/crud-builder');
const HomepageDocument = require('../models/HomepageDocument');
const CulturePageDocument = require('../models/CulturePageDocument');
const ImpactPageDocument = require('../models/ImpactPageDocument');
const CareersPageDocument = require('../models/CareersPageDocument');
const Job = require('../models/Job');
const ContactPageDocument = require('../models/ContactPageDocument');
const Office = require('../models/Office');
const InvestorsPageDocument = require('../models/InvestorsPageDocument');
const FinancialReport = require('../models/FinancialReport');
const ShareholdingPattern = require('../models/ShareholdingPattern');
const BoardMember = require('../models/BoardMember');

router.use('/homepage', makeCrudRouter(HomepageDocument, 'HomepageDocument'));
router.use('/culture-page', makeCrudRouter(CulturePageDocument, 'CulturePageDocument'));
router.use('/impact-page', makeCrudRouter(ImpactPageDocument, 'ImpactPageDocument'));
router.use('/careers-page', makeCrudRouter(CareersPageDocument, 'CareersPageDocument'));
router.use('/jobs', makeCrudRouter(Job, 'Job'));
router.use('/contact-page', makeCrudRouter(ContactPageDocument, 'ContactPageDocument'));
router.use('/offices', makeCrudRouter(Office, 'Office'));
router.use('/investors-page', makeCrudRouter(InvestorsPageDocument, 'InvestorsPageDocument'));
router.use('/financial-reports', makeCrudRouter(FinancialReport, 'FinancialReport'));
router.use('/shareholding-patterns', makeCrudRouter(ShareholdingPattern, 'ShareholdingPattern'));
router.use('/board-members', makeCrudRouter(BoardMember, 'BoardMember'));

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to LocalSM API",
  });
});
module.exports = router;
