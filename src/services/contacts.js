import Contact from '../models/contactModel.js';

export const findAllContacts = async () => {
  try {
    console.log('Fetching all contacts...');
    const contacts = await Contact.find(); // Получаем все контакты из базы
    console.log('Contacts fetched successfully:', contacts);
    return contacts;
  } catch (error) {
    console.error('Error in findAllContacts:', error);
    throw new Error('Error retrieving contacts: ' + error.message);
  }
};
