const mongoose = require('../utils/mongoose-mock');

const footerLinkSchema = new mongoose.Schema(
	{
		label: {
			type: String,
			required: true,
			trim: true,
		},
		href: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ _id: false }
);

const footerSchema = new mongoose.Schema(
	{
		description: {
			type: String,
			default: '',
			trim: true,
		},
		footerLogo: {
			type: String,
			default: '',
		},
		quickLinks: {
			type: [footerLinkSchema],
			default: [],
		},
		copyright: {
			type: String,
			default: '',
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.models.Footer || mongoose.model('Footer', footerSchema);
