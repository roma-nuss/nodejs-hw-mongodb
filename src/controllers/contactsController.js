// src/controllers/contactsController.js
import Contact from '../models/contactModel.js'; // Импортируем модель контактов

// Функция для получения всех контактов
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find(); // Получаем все контакты
    res.status(200).json(contacts); // Отправляем ответ с контактами
  } catch (error) {
    console.error('Error in getContacts:', error);
    res.status(500).json({ message: 'Error retrieving contacts' }); // Ошибка сервера
  }
};

// Функция для получения контакта по ID
export const getContactById = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' }); // Если контакт не найден
    }

    res.status(200).json(contact); // Отправляем контакт
  } catch (error) {
    console.error('Error in getContactById:', error);
    res.status(500).json({ message: 'Error retrieving contact' }); // Ошибка сервера
  }
};
