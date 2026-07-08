const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
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
		logo: {
			type: String,
			default: '',
		},
		coverImage: {
			type: String,
			default: '',
		},
		buttonText: {
			type: String,
			default: '',
			trim: true,
		},
		buttonUrl: {
			type: String,
			default: '',
			trim: true,
		},
		order: {
			type: Number,
			default: 0,
		},
		active: {
			type: Boolean,
			default: true,
		},
		slug: {
			type: String,
			unique: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

businessSchema.pre('save', function () {
	if (this.isModified('title') || !this.slug) {
		this.slug = this.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)+/g, '');
	}
});

module.exports = mongoose.models.Business || mongoose.model('Business', businessSchema);
