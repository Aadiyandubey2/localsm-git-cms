const isProduction = process.env.NODE_ENV === 'production';

const timestamp = () => new Date().toISOString();

const formatMessage = (level, message, meta) => {
	const base = `[${timestamp()}] ${level.toUpperCase()}: ${message}`;

	if (meta === undefined) {
		return base;
	}

	return `${base} ${typeof meta === 'string' ? meta : JSON.stringify(meta)}`;
};

const logger = {
	info: (message, meta) => {
		console.info(formatMessage('info', message, meta));
	},
	warn: (message, meta) => {
		console.warn(formatMessage('warn', message, meta));
	},
	error: (message, meta) => {
		console.error(formatMessage('error', message, meta));
	},
	debug: (message, meta) => {
		if (!isProduction) {
			console.debug(formatMessage('debug', message, meta));
		}
	},
	http: (message, meta) => {
		if (!isProduction) {
			console.log(formatMessage('http', message, meta));
		}
	},
	log: (level, message, meta) => {
		const normalizedLevel = String(level || 'info').toLowerCase();

		if (normalizedLevel === 'error') return logger.error(message, meta);
		if (normalizedLevel === 'warn') return logger.warn(message, meta);
		if (normalizedLevel === 'debug') return logger.debug(message, meta);
		if (normalizedLevel === 'http') return logger.http(message, meta);

		return logger.info(message, meta);
	},
};

module.exports = logger;
