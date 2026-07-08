const mongoose = require('mongoose');

const companyInfoSchema = new mongoose.Schema(
	{
		companyName: {
			type: String,
			default: '',
			trim: true,
		},
		about: {
			type: String,
			default: '',
			trim: true,
		},
		registrationNumber: {
			type: String,
			default: '',
			trim: true,
		},
		gst: {
			type: String,
			default: '',
			trim: true,
		},
		email: {
			type: String,
			default: '',
			trim: true,
			lowercase: true,
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
		workingHours: {
			type: String,
			default: '',
			trim: true,
		},
		googleMapsUrl: {
			type: String,
			default: '',
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.models.CompanyInfo || mongoose.model('CompanyInfo', companyInfoSchema);
