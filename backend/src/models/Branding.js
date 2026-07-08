const mongoose = require('mongoose');

const brandingSchema = new mongoose.Schema(
	{
		siteName: {
			type: String,
			required: true,
			trim: true,
		},
		logo: {
			type: String,
			default: '',
		},
		favicon: {
			type: String,
			default: '',
		},
		primaryColor: {
			type: String,
			default: '',
		},
		secondaryColor: {
			type: String,
			default: '',
		},
		accentColor: {
			type: String,
			default: '',
		},
		fontFamily: {
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

module.exports = mongoose.models.Branding || mongoose.model('Branding', brandingSchema);
