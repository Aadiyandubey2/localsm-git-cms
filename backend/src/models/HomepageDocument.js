const mongoose = require('../utils/mongoose-mock');

const homepageDocumentSchema = new mongoose.Schema(
	{
		heroImageCaption: {
			type: String,
			default: 'LocalSM Corporate Headquarters',
		},
		heroImageCode: {
			type: String,
			default: 'HQ-01 // GURUGRAM',
		},
		founderTeaser: {
			type: String,
			default: '',
		},
		founderLetterDate: {
			type: String,
			default: 'February 6, 2026',
		},
		businessSectionSubtitle: {
			type: String,
			default: 'Under the LocalSM umbrella, we operate three market-leading hyper-local platforms.',
		},
		visionTitle: {
			type: String,
			default: 'Enduring institutions built on local empowerment.',
		},
		visionDescription: {
			type: String,
			default: '',
		},
		missionTitle: {
			type: String,
			default: 'To endure, evolve, and empower.',
		},
		missionDescription: {
			type: String,
			default: '',
		},
		impactMetrics: [
			{
				category: String,
				value: String,
				description: String,
			}
		],
		cultureTeaserSubtitle: {
			type: String,
			default: 'Working at LocalSM',
		},
		cultureTeaserTitle: {
			type: String,
			default: 'This place is designed to make you feel uncomfortable.',
		},
		cultureTeaserDescription: {
			type: String,
			default: '',
		},
		cultureTeaserImage: {
			type: String,
			default: '',
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.models.HomepageDocument || mongoose.model('HomepageDocument', homepageDocumentSchema);
