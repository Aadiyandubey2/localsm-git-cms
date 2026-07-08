const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		subtitle: {
			type: String,
			default: '',
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
		ctaText: {
			type: String,
			default: '',
			trim: true,
		},
		ctaLink: {
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

module.exports = mongoose.models.Hero || mongoose.model('Hero', heroSchema);
