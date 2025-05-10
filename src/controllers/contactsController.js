//src/controllers/contactsController.js

// Импортируем зависимости
import createHttpError from 'http-errors'; // Для создания HTTP ошибок с кодами
import {
  createContact, // Функция для создания контакта
  deleteContact, // Функция для удаления контакта
  getAllContacts, // Функция для получения всех контактов
  getContactById, // Функция для получения контакта по ID
  updateContact, // Функция для обновления контакта
} from '../services/contacts.js'; // Импортируем сервисы для работы с контактами
import { parsePaginationParams } from '../utils/parsePaginationParams.js'; // Функция для парсинга параметров пагинации
import { parseSortParams } from '../utils/parseSortParams.js'; // Функция для парсинга параметров сортировки
import { parseFilterParams } from '../utils/parseFilterParams.js'; // Функция для парсинга параметров фильтрации
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js'; // Функция для сохранения файлов в директорию
import { getEnvVar } from '../utils/getEnvVar.js'; // Функция для получения переменных окружения
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js'; // Функция для сохранения файлов на Cloudinary

// Контроллер для получения всех контактов с учетом пагинации, сортировки и фильтрации
export const getContactsController = async (req, res) => {
  // Парсим параметры пагинации из query строки
  const { page, perPage } = parsePaginationParams(req.query);
  // Парсим параметры сортировки из query строки
  const { sortOrder, sortBy } = parseSortParams(req.query);
  // Получаем ID пользователя из запроса
  const userId = req.user._id;
  // Парсим параметры фильтрации из query строки
  const filter = parseFilterParams(req.query);
  // Получаем все контакты с учетом переданных параметров
  const contacts = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    userId,
  });
  // Отправляем успешный ответ с найденными контактами
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// Контроллер для получения контакта по ID
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params; // Получаем ID контакта из параметров запроса
  const userId = req.user._id; // Получаем ID пользователя
  // Получаем контакт по ID и ID пользователя
  const contact = await getContactById(contactId, userId);

  // Если контакт не найден, генерируем ошибку 404
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  // Отправляем успешный ответ с найденным контактом
  res.json({
    status: 200,
    message: `Successfully found contact by id ${contactId}!`,
    data: contact,
  });
};

// Контроллер для создания нового контакта
export const createContactController = async (req, res) => {
  const { file, body } = req; // Получаем файл и данные тела запроса
  const contactData = { ...body, userId: req.user._id }; // Добавляем ID пользователя к данным контакта

  let photoUrl;

  // Проверка наличия файла перед сохранением
  if (file) {
    try {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(file); // Сохраняем в Cloudinary
      } else {
        photoUrl = await saveFileToUploadDir(file); // Сохраняем в локальную директорию
      }
    } catch {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to upload photo',
      });
    }
  }

  contactData.photo = photoUrl;

  try {
    const contact = await createContact(contactData);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch {
    res.status(400).json({
      status: 'error',
      message: 'Failed to create contact',
    });
  }
};

// Контроллер для обновления контакта (PATCH)
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params; // Получаем ID контакта из параметров запроса
  const userId = req.user._id; // Получаем ID пользователя
  const photo = req.file; // Получаем файл фотографии (если он есть)
  let photoUrl;

  // Если файл фотографии есть, сохраняем его в Cloudinary или локально
  if (photo) {
    try {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo); // Сохраняем в Cloudinary
      } else {
        photoUrl = await saveFileToUploadDir(photo); // Сохраняем в локальную директорию
      }
    } catch {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to upload photo',
      });
    }
  }

  // Обновляем контакт с новыми данными (и возможной фотографией)
  const result = await updateContact(contactId, userId, {
    ...req.body,
    photo: photoUrl, // Добавляем URL фотографии
  });

  // Если контакт не найден, генерируем ошибку 404
  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  // Отправляем успешный ответ с обновленным контактом
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};

// Контроллер для удаления контакта
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params; // Получаем ID контакта из параметров запроса
  const userId = req.user._id; // Получаем ID пользователя
  // Удаляем контакт по ID и ID пользователя
  const contact = await deleteContact(contactId, userId);

  // Если контакт не найден, генерируем ошибку 404
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  // Отправляем успешный ответ с кодом 204 (без содержания)
  res.status(204).send();
};
