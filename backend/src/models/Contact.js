const mongoose = require('../utils/mongoose-mock');

const contactSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		phone: {
			type: String,
			default: '',
			trim: true,
		},
		subject: {
			type: String,
			default: '',
			trim: true,
		},
		message: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ['new', 'read', 'replied', 'archived'],
			default: 'new',
		},
		isRead: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
