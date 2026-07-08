const mongoose = require('../utils/mongoose-mock');

const seoSchema = new mongoose.Schema(
	{
		siteTitle: {
			type: String,
			default: '',
			trim: true,
		},
		metaDescription: {
			type: String,
			default: '',
			trim: true,
		},
		keywords: {
			type: [String],
			default: [],
		},
		openGraphTitle: {
			type: String,
			default: '',
			trim: true,
		},
		openGraphDescription: {
			type: String,
			default: '',
			trim: true,
		},
		openGraphImage: {
			type: String,
			default: '',
		},
		canonicalUrl: {
			type: String,
			default: '',
			trim: true,
		},
		favicon: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.models.SEO || mongoose.model('SEO', seoSchema);
