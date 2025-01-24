// src/controllers/contacts.js
import ctrlWrapper from '../utils/ctrlWrapper.js';
import Contact from '../models/contactModel.js';
import { createError } from 'http-errors';

// Получение всех контактов
export const getContacts = ctrlWrapper(async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json({
    status: 200,
    message:
      contacts.length > 0
        ? 'Successfully found contacts!'
        : 'No contacts found.',
    data: contacts,
  });
});

// Получение контакта по ID
export const getContactById = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
});

// Добавление нового контакта
export const addContact = ctrlWrapper(async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Missing required fields');
  }

  const newContact = await Contact.create({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
});
