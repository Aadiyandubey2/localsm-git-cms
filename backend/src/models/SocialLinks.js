const mongoose = require('../utils/mongoose-mock');

const socialLinksSchema = new mongoose.Schema(
	{
		instagram: {
			type: String,
			default: '',
			trim: true,
		},
		facebook: {
			type: String,
			default: '',
			trim: true,
		},
		linkedin: {
			type: String,
			default: '',
			trim: true,
		},
		twitter: {
			type: String,
			default: '',
			trim: true,
		},
		youtube: {
			type: String,
			default: '',
			trim: true,
		},
		whatsapp: {
			type: String,
			default: '',
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.models.SocialLinks || mongoose.model('SocialLinks', socialLinksSchema);
