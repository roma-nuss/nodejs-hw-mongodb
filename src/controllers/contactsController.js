// src/controllers/contactsController.js
import Contact from '../models/contactModel.js'; // Импорт модели контакта
import createError from 'http-errors'; // Удобный инструмент для обработки ошибок

// Получение всех контактов
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find(); // Получаем все контакты
    res.status(200).json({
      status: 200,
      message: 'Contacts retrieved successfully',
      data: contacts, // Отправляем данные
    });
  } catch (error) {
    next(error); // Передаем ошибку в обработчик ошибок
  }
};

// Получение контакта по ID
export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params; // Извлекаем contactId из параметров

    // Ищем контакт по ID
    const contact = await Contact.findById(contactId);

    if (!contact) throw createError(404, 'Contact not found'); // Если контакт не найден, выбрасываем ошибку

    res.status(200).json({
      status: 200,
      message: 'Contact retrieved successfully',
      data: contact, // Отправляем данные контакта
    });
  } catch (error) {
    next(error); // Передаем ошибку в обработчик ошибок
  }
};

// Создание нового контакта
export const addContact = async (req, res, next) => {
  try {
    const newContact = await Contact.create(req.body); // Создаем новый контакт

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: newContact, // Отправляем созданный контакт
    });
  } catch (error) {
    next(error); // Передаем ошибку в обработчик ошибок
  }
};

// Обновление контакта
export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params; // Извлекаем contactId из параметров
    const updates = req.body; // Получаем данные для обновления из тела запроса

    // Обновляем контакт по ID
    const updatedContact = await Contact.findByIdAndUpdate(contactId, updates, {
      new: true, // Вернуть обновленный объект
      runValidators: true, // Запустить валидацию при обновлении
    });

    if (!updatedContact) throw createError(404, 'Contact not found'); // Если контакт не найден, выбрасываем ошибку

    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully',
      data: updatedContact, // Отправляем обновленные данные контакта
    });
  } catch (error) {
    next(error); // Передаем ошибку в обработчик ошибок
  }
};

// Удаление контакта
export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params; // Извлекаем contactId из параметров

    // Удаляем контакт по ID
    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact) throw createError(404, 'Contact not found'); // Если контакт не найден, выбрасываем ошибку

    res.status(200).json({
      status: 200,
      message: 'Contact deleted successfully',
      data: deletedContact, // Отправляем удаленный контакт
    });
  } catch (error) {
    next(error); // Передаем ошибку в обработчик ошибок
  }
};
