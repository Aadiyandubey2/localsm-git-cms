const mongoose = require('../utils/mongoose-mock');

const impactPageDocumentSchema = new mongoose.Schema(
	{
		heroTitle: {
			type: String,
			default: 'Responsible growth at scale.',
		},
		heroDescription: {
			type: String,
			default: '',
		},
		metricsTitle: {
			type: String,
			default: 'Key Progress Metrics',
		},
		metricsSubtitle: {
			type: String,
			default: 'Measuring our real-world impact in real-time.',
		},
		metrics: [
			{
				label: String,
				value: String,
				subText: String,
			}
		],
		initiativesTitle: {
			type: String,
			default: 'Stewardship Initiatives',
		},
		initiativesSubtitle: {
			type: String,
			default: 'Hard targets we measure with scientific discipline.',
		},
		initiatives: [
			{
				iconType: String, // 'Leaf' | 'Shield' | 'Heart'
				title: String,
				description: String,
			}
		],
		socialTitle: {
			type: String,
			default: 'Socioeconomic Empowerment',
		},
		socialDescription: {
			type: String,
			default: '',
		},
		socialImage: {
			type: String,
			default: '',
		},
		socialImageAlt: {
			type: String,
			default: 'LocalSM Delivery Partner',
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

module.exports = mongoose.models.ImpactPageDocument || mongoose.model('ImpactPageDocument', impactPageDocumentSchema);
