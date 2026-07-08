const mongoose = require('../utils/mongoose-mock');

const culturePageDocumentSchema = new mongoose.Schema(
	{
		heroTitle: {
			type: String,
			default: 'This place is designed to make you feel uncomfortable.',
		},
		heroDescription: {
			type: String,
			default: '',
		},
		philosophyImage: {
			type: String,
			default: '',
		},
		philosophyImageAlt: {
			type: String,
			default: 'LocalSM Collaboration Space',
		},
		philosophyQuote: {
			type: String,
			default: '"We don\'t manage people. We manage missions."',
		},
		philosophyBody: {
			type: [String],
			default: [],
		},
		valuesTitle: {
			type: String,
			default: 'Our Core Values',
		},
		valuesSubtitle: {
			type: String,
			default: 'These are the principles that guide our daily actions and long-term decisions.',
		},
		valuesList: [
			{
				num: String,
				title: String,
				description: String,
			}
		],
		ctaTitle: {
			type: String,
			default: 'Are you ready to do the most challenging work of your life?',
		},
		ctaDescription: {
			type: String,
			default: '',
		},
		ctaButtonText: {
			type: String,
			default: 'Explore Open Roles',
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

module.exports = mongoose.models.CulturePageDocument || mongoose.model('CulturePageDocument', culturePageDocumentSchema);
