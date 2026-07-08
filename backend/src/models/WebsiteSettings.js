const mongoose = require('mongoose');

const websiteSettingsSchema = new mongoose.Schema(
	{
		siteName: {
			type: String,
			required: true,
			trim: true,
		},
		tagline: {
			type: String,
			default: '',
			trim: true,
		},
		description: {
			type: String,
			default: '',
			trim: true,
		},
		email: {
			type: String,
			default: '',
			trim: true,
		},
		phone: {
			type: String,
			default: '',
			trim: true,
		},
		address: {
			type: String,
			default: '',
			trim: true,
		},
		socialLinks: {
			type: Array,
			default: [],
		},
		seo: {
			title: {
				type: String,
				default: '',
			},
			description: {
				type: String,
				default: '',
			},
			keywords: {
				type: [String],
				default: [],
			},
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

module.exports =
	mongoose.models.WebsiteSettings || mongoose.model('WebsiteSettings', websiteSettingsSchema);
