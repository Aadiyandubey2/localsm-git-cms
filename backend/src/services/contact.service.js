const mongoose = require('../utils/mongoose-mock');
const Contact = require('../models/Contact');

const createError = (statusCode, message) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
};

const assertValidId = (id) => {
	if (!mongoose.isValidObjectId(id)) {
		throw createError(400, 'Invalid contact id');
	}
};

const createContact = async (data) => Contact.create(data);

const getAllContacts = async () => Contact.find().sort({ createdAt: -1 });

const getContactById = async (id) => {
	assertValidId(id);

	const contact = await Contact.findById(id);

	if (!contact) {
		throw createError(404, 'Contact not found');
	}

	return contact;
};

const updateContact = async (id, data) => {
	assertValidId(id);

	const contact = await Contact.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});

	if (!contact) {
		throw createError(404, 'Contact not found');
	}

	return contact;
};

const deleteContact = async (id) => {
	assertValidId(id);

	const contact = await Contact.findByIdAndDelete(id);

	if (!contact) {
		throw createError(404, 'Contact not found');
	}

	return contact;
};

module.exports = {
	createContact,
	getAllContacts,
	getContactById,
	updateContact,
	deleteContact,
};
