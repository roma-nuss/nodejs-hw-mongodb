// src/controllers/contactsController.js
import Contact from '../models/contactModel.js';
import createError from 'http-errors';

export const getContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json({
    status: 200,
    message: 'Contacts retrieved successfully',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Contact retrieved successfully',
    data: contact,
  });
};

export const addContact = async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json({
    status: 201,
    message: 'Contact created successfully',
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const updates = req.body;

  const updatedContact = await Contact.findByIdAndUpdate(contactId, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedContact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Contact updated successfully',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;

  const deletedContact = await Contact.findByIdAndDelete(contactId);

  if (!deletedContact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Contact deleted successfully',
    data: deletedContact,
  });
};
