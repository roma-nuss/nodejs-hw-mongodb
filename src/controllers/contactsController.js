// src/controllers/contactsController.js

import Contact from '../models/contactModel.js'; // Добавьте этот импорт

// Пример функции для получения контакта по ID
export const getContactById = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error('Error in getContactById:', error);
    res.status(500).json({ message: 'Error retrieving contact' });
  }
};

// Пример других экспортов, например:
export const getContacts = async (req, res) => {
  // код...
};
