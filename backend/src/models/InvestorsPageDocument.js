const mongoose = require('../utils/mongoose-mock');

const investorsPageDocumentSchema = new mongoose.Schema(
	{
		heroTitle: {
			type: String,
			default: 'Long-term value through discipline.',
		},
		heroDescription: {
			type: String,
			default: '',
		},
		stockSymbol: {
			type: String,
			default: 'LOCALS',
		},
		stockIsin: {
			type: String,
			default: 'INE000001010',
		},
		stockBasePrice: {
			type: Number,
			default: 246.65,
		},
		marketCap: {
			type: String,
			default: '₹78,450 Cr',
		},
		peRatio: {
			type: String,
			default: '68.4',
		},
		fiftyTwoWeekHigh: {
			type: String,
			default: '₹268.00',
		},
		fiftyTwoWeekLow: {
			type: String,
			default: '₹134.50',
		},
		ytdPerformance: {
			type: String,
			default: '+84.5%',
		},
		chartStartDate: {
			type: String,
			default: 'Feb 2025',
		},
		chartEndDate: {
			type: String,
			default: 'Feb 2026',
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

module.exports = mongoose.models.InvestorsPageDocument || mongoose.model('InvestorsPageDocument', investorsPageDocumentSchema);
