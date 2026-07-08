const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			select: false,
		},
		role: {
			type: String,
			enum: ['admin', 'superadmin'],
			default: 'admin',
		},
		avatar: {
			type: String,
			default: '',
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		refreshToken: {
			type: String,
			default: '',
			select: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
