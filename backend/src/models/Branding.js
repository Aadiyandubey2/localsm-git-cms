const mongoose = require('../utils/mongoose-mock');

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
			default: 'Berkshire Swash',
		},
		wordmarkText: {
			type: String,
			default: 'LocalSM',
		},
		wordmarkHighlightIndex: {
			type: Number,
			default: 5,
		},
		wordmarkHighlightColor: {
			type: String,
			default: '#f4b000',
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
