const mongoose = require('../utils/mongoose-mock');

const officeSchema = new mongoose.Schema(
	{
		city: {
			type: String,
			required: true,
			trim: true,
		},
		address: {
			type: String,
			required: true,
			trim: true,
		},
		phone: {
			type: String,
			default: '',
		},
		sortOrder: {
			type: Number,
			default: 0,
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

module.exports = mongoose.models.Office || mongoose.model('Office', officeSchema);
