const path = require('path');
const Module = require('module');

// Force Vercel static tracer to bundle the mock mongoose
const mockMongoose = require('../src/utils/mongoose-mock');

const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'mongoose') {
    return mockMongoose;
  }
  return originalRequire.apply(this, arguments);
};

const app = require('../src/app');
const connectDB = require('../src/config/db');

module.exports = async (req, res) => {
  // Block write operations in read-only Vercel environment (except login and contact forms)
  if (process.env.VERCEL && !process.env.GITHUB_TOKEN && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
    const isLogin = req.url.includes('/auth/login');
    const isContact = req.url.includes('/contact') && req.method === 'POST';
    if (!isLogin && !isContact) {
      return res.status(403).json({
        success: false,
        message: 'This website runs on a Git-based CMS. To enable live database updates in production, please configure GITHUB_TOKEN and GITHUB_REPO environment variables in your Vercel Dashboard.'
      });
    }
  }

  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Failed to connect to database in Vercel function:', error);
    res.status(500).json({ success: false, message: 'Database connection failed: ' + error.message });
  }
};
