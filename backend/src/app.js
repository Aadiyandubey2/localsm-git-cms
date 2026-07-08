const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(
	helmet({
		contentSecurityPolicy: false,
		crossOriginResourcePolicy: { policy: 'cross-origin' },
	})
);
app.use(
	cors({
		origin: true,
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

app.get('/health', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'LocalSM backend is healthy',
		uptime: process.uptime(),
	});
});
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LocalSM Backend API is running 🚀",
  });
});
app.use(notFound);
app.use(errorHandler);

module.exports = app;
