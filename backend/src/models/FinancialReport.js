const mongoose = require('../utils/mongoose-mock');

const financialReportSchema = new mongoose.Schema(
	{
		period: {
			type: String,
			required: true,
			trim: true,
		},
		revenue: {
			type: String,
			required: true,
		},
		growth: {
			type: String,
			required: true,
		},
		profit: {
			type: String,
			required: true,
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

module.exports = mongoose.models.FinancialReport || mongoose.model('FinancialReport', financialReportSchema);
