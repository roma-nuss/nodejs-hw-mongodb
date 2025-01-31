// src/controllers/contactsController.js
import Contact from '../models/contactModel.js';
import createError from 'http-errors';
import Joi from 'joi';

// Схемы валидации с использованием Joi
const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('personal', 'business').required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  phoneNumber: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('personal', 'business').optional(),
});

export const getContacts = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    isFavourite,
    contactType,
  } = req.query;

  const filter = {};
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';
  if (contactType) filter.contactType = contactType;

  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const skip = (page - 1) * perPage;

  const [contacts, totalItems] = await Promise.all([
    Contact.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(Number(perPage)),
    Contact.countDocuments(filter),
  ]);

  res.status(200).json({
    status: 200,
    message: 'Contacts retrieved successfully',
    data: {
      data: contacts,
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      hasPreviousPage: page > 1,
      hasNextPage: skip + Number(perPage) < totalItems,
    },
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
  const { error } = contactSchema.validate(req.body);
  if (error) throw createError(400, error.details[0].message);

  const newContact = await Contact.create(req.body);
  res.status(201).json({
    status: 201,
    message: 'Contact created successfully',
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { error } = updateContactSchema.validate(req.body);
  if (error) throw createError(400, error.details[0].message);

  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
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
