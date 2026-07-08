const mongoose = require('../utils/mongoose-mock');

const serviceSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			default: '',
			trim: true,
		},
		image: {
			type: String,
			default: '',
		},
		order: {
			type: Number,
			default: 0,
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.models.Service || mongoose.model('Service', serviceSchema);
