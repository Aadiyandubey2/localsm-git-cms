const contactService = require('../services/contact.service');

const createContact = async (req, res) => {
	const contact = await contactService.createContact(req.body);

	res.status(201).json({
		success: true,
		message: 'Contact created successfully',
		data: contact,
	});
};

const getContacts = async (req, res) => {
	const contacts = await contactService.getAllContacts();

	res.status(200).json({
		success: true,
		data: contacts,
	});
};

const getContactById = async (req, res) => {
	const contact = await contactService.getContactById(req.params.id);

	res.status(200).json({
		success: true,
		data: contact,
	});
};

const updateContact = async (req, res) => {
	const contact = await contactService.updateContact(req.params.id, req.body);

	res.status(200).json({
		success: true,
		message: 'Contact updated successfully',
		data: contact,
	});
};

const deleteContact = async (req, res) => {
	await contactService.deleteContact(req.params.id);

	res.status(200).json({
		success: true,
		message: 'Contact deleted successfully',
	});
};

module.exports = {
	createContact,
	getContacts,
	getContactById,
	updateContact,
	deleteContact,
};
