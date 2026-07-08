const mongoose = require('mongoose');

const navItemSchema = new mongoose.Schema(
	{
		label: {
			type: String,
			required: true,
			trim: true,
		},
		href: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ _id: false }
);

const navigationSchema = new mongoose.Schema(
	{
		logo: {
			type: String,
			default: '',
		},
		menuItems: {
			type: [navItemSchema],
			default: [],
		},
		ctaLabel: {
			type: String,
			default: '',
			trim: true,
		},
		ctaHref: {
			type: String,
			default: '',
			trim: true,
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

module.exports = mongoose.models.Navigation || mongoose.model('Navigation', navigationSchema);
