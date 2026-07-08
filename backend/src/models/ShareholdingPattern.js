const mongoose = require('../utils/mongoose-mock');

const shareholdingPatternSchema = new mongoose.Schema(
	{
		category: {
			type: String,
			required: true,
			trim: true,
		},
		percentage: {
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

module.exports = mongoose.models.ShareholdingPattern || mongoose.model('ShareholdingPattern', shareholdingPatternSchema);
