// src/controllers/contactsController.js
import Contact from '../models/contactModel.js';

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find(); // Получаем все контакты
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ message: 'No contacts found' });
    }
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error retrieving contacts' });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    res.status(500).json({ message: 'Error retrieving contact' });
  }
};
