const mongoose = require('../utils/mongoose-mock');

const contactPageDocumentSchema = new mongoose.Schema(
	{
		heroTitle: {
			type: String,
			default: 'Responsible growth at scale.',
		},
		heroDescription: {
			type: String,
			default: '',
		},
		departmentalContacts: [
			{
				label: String,
				email: String,
				description: String,
			}
		],
		formTitle: {
			type: String,
			default: 'Send a Message',
		},
		formInstructions: {
			type: String,
			default: 'All fields are required.',
		},
		officeSectionTitle: {
			type: String,
			default: 'Our Offices',
		},
		officeSectionSubtitle: {
			type: String,
			default: 'Where we build the future of hyper-local commerce.',
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

module.exports = mongoose.models.ContactPageDocument || mongoose.model('ContactPageDocument', contactPageDocumentSchema);
