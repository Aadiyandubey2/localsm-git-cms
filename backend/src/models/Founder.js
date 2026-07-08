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
