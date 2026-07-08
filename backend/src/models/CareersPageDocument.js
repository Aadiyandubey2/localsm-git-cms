const mongoose = require('../utils/mongoose-mock');

const careersPageDocumentSchema = new mongoose.Schema(
	{
		heroTitle: {
			type: String,
			default: 'Build things that outlast you.',
		},
		heroDescription: {
			type: String,
			default: '',
		},
		philosophyTitle: {
			type: String,
			default: 'Our Hiring Philosophy',
		},
		philosophySubtitle: {
			type: String,
			default: 'We do not offer jobs; we offer missions.',
		},
		principles: [
			{
				label: String,
				title: String,
				description: String,
			}
		],
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.models.CareersPageDocument || mongoose.model('CareersPageDocument', careersPageDocumentSchema);
