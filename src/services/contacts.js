import Contact from '../models/contactModel.js';

// Функция для получения всех контактов
export const findAllContacts = async () => {
  try {
    const contacts = await Contact.find(); // Получаем все контакты
    return contacts;
  } catch (error) {
    throw new Error('Error retrieving contacts: ' + error.message);
  }
};

// Функция для получения контакта по ID
export const findContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId); // Ищем контакт по ID
    return contact;
  } catch (error) {
    throw new Error('Error retrieving contact: ' + error.message);
  }
};
