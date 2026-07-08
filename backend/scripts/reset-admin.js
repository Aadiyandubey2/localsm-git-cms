const path = require('path');
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'mongoose') {
    return originalRequire.call(this, path.join(__dirname, '../src/utils/mongoose-mock'));
  }
  return originalRequire.apply(this, arguments);
};

require('dotenv').config();

const bcrypt = require('bcrypt');
const connectDB = require('../src/config/db');
const Admin = require('../src/models/Admin');
const seedAdmin = require('../src/utils/seedAdmin');

const email = (process.env.ADMIN_EMAIL || seedAdmin.defaults.email).toLowerCase().trim();
const password = process.env.ADMIN_PASSWORD || seedAdmin.defaults.password;

const resetAdmin = async () => {
	try {
		await connectDB();

		const hashedPassword = await bcrypt.hash(password, 10);
		const existing = await Admin.findOne({ email });

		if (existing) {
			existing.password = hashedPassword;
			existing.isActive = true;
			await existing.save();
			console.log(`✅ Reset password for ${email}`);
		} else {
			await seedAdmin({ email, password });
			console.log(`✅ Created admin account for ${email}`);
		}

		console.log(`   Email: ${email}`);
		console.log(`   Password: ${password}`);

		process.exit(0);
	} catch (error) {
		console.error('❌ Failed to reset admin credentials:');
		console.error(error);
		process.exit(1);
	}
};

resetAdmin();
