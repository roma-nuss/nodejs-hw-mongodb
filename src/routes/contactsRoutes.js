// src/routes/contactsRoutes.js
import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  contactSchema,
  updateContactSchema,
} from '../validators/contactValidators.js';
import {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
} from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import authenticate from '../middlewares/authenticate.js'; // Исправлен импорт на корректный middleware

const router = express.Router();

// Настройка multer для загрузки файлов
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Настройка Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Защита маршрутов
router.use(authenticate);

// Роуты для работы с контактами
router.get('/', ctrlWrapper(getContacts)); // Получение всех контактов для авторизованного пользователя
router.get('/:contactId', isValidId, ctrlWrapper(getContactById)); // Получение контакта по ID

// Роут для создания нового контакта с фото
router.post(
  '/',
  upload.single('photo'), // Фото будет передаваться через поле 'photo'
  validateBody(contactSchema),
  ctrlWrapper(addContact), // Контроллер для создания контакта
);

// Роут для обновления контакта с возможностью загрузки нового фото
router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'), // Фото будет передаваться через поле 'photo'
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact), // Контроллер для обновления контакта
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact)); // Удаление контакта

export default router;
