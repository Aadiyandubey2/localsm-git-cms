const express = require('express');
const heroController = require('../controllers/hero.controller');
const authMiddleware = require('../middleware/auth.middleware');
const {
	createHeroValidator,
	updateHeroValidator,
	heroIdValidator,
} = require('../validators/hero.validator');

const router = express.Router();

router.get('/', heroController.getHeroes);
router.get('/:id', heroIdValidator, heroController.getHeroById);
router.post('/', authMiddleware.protect, createHeroValidator, heroController.createHero);
router.patch('/:id', authMiddleware.protect, updateHeroValidator, heroController.updateHero);
router.delete('/:id', authMiddleware.protect, heroIdValidator, heroController.deleteHero);

module.exports = router;
