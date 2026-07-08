const mongoose = require('../utils/mongoose-mock');

const founderSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		title: {
			type: String,
			default: '',
			trim: true,
		},
		message: {
			type: String,
			default: '',
			trim: true,
		},
		signatureImage: {
			type: String,
			default: '',
		},
		portraitImage: {
			type: String,
			default: '',
		},
		quote: {
			type: String,
			default: '',
			trim: true,
		},
		letterDate: {
			type: String,
			default: '6 FEBRUARY 2026',
		},
		readTime: {
			type: String,
			default: '6 MINS',
		},
		letterTitle: {
			type: String,
			default: '',
		},
		introduction: {
			type: String,
			default: '',
		},
		calloutQuote: {
			type: String,
			default: '',
		},
		middleText: {
			type: String,
			default: '',
		},
		pillars: [
			{
				numberLabel: String,
				title: String,
				description: String,
			}
		],
		conclusion: {
			type: String,
			default: '',
		},
		signOffLabel: {
			type: String,
			default: 'Sincerely,',
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

module.exports = mongoose.models.Founder || mongoose.model('Founder', founderSchema);
