const mongoose = require('../utils/mongoose-mock');

const boardMemberSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: String,
			required: true,
			trim: true,
		},
		bio: {
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

module.exports = mongoose.models.BoardMember || mongoose.model('BoardMember', boardMemberSchema);
