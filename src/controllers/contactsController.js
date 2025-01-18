// src/controllers/contactsController.js
import { findAllContacts, findContactById } from '../services/contacts.js';

// Получить все контакты
export const getContacts = async (req, res) => {
  try {
    const contacts = await findAllContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получить контакт по ID
export const getContactById = async (req, res) => {
  try {
    const contact = await findContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
