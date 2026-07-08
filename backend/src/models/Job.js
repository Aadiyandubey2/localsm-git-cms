const mongoose = require('../utils/mongoose-mock');

const jobSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		department: {
			type: String,
			required: true,
			trim: true,
		},
		location: {
			type: String,
			required: true,
			trim: true,
		},
		type: {
			type: String,
			required: true,
			default: 'Full-time',
		},
		description: {
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

module.exports = mongoose.models.Job || mongoose.model('Job', jobSchema);
