// src/controllers/contactsController.js
import Contact from '../models/contactModel.js'; // Импорт модели Contact

// Функция для получения контакта по ID
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

// Функция для получения всех контактов
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find(); // Получаем все контакты из базы данных
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ message: 'No contacts found' });
    }

    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error in getContacts:', error);
    res.status(500).json({ message: 'Error retrieving contacts' });
  }
};
