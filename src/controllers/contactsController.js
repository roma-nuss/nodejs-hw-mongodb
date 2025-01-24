import Contact from '../models/contactModel.js'; // Импорт модели контакта
import createError from 'http-errors'; // Удобный инструмент для обработки ошибок

// Получение всех контактов
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({
      status: 200,
      message: 'Contacts retrieved successfully',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// Получение контакта по ID
export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId);

    if (!contact) throw createError(404, 'Contact not found');

    res.status(200).json({
      status: 200,
      message: 'Contact retrieved successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Создание нового контакта
export const addContact = async (req, res, next) => {
  try {
    const newContact = await Contact.create(req.body);

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

// Обновление контакта
export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updates = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(contactId, updates, {
      new: true, // Вернуть обновленный объект
      runValidators: true, // Запустить валидацию
    });

    if (!updatedContact) throw createError(404, 'Contact not found');

    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

// Удаление контакта
export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact) throw createError(404, 'Contact not found');

    res.status(200).json({
      status: 200,
      message: 'Contact deleted successfully',
      data: deletedContact,
    });
  } catch (error) {
    next(error);
  }
};
