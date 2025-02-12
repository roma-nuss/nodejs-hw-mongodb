import express from 'express';
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

// Защита маршрутов
router.use(authenticate);

// Роуты для работы с контактами
router.get('/', ctrlWrapper(getContacts)); // Получение всех контактов для авторизованного пользователя
router.get('/:contactId', isValidId, ctrlWrapper(getContactById)); // Получение контакта по ID
router.post('/', validateBody(contactSchema), ctrlWrapper(addContact)); // Создание нового контакта
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact),
); // Обновление контакта
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact)); // Удаление контакта

export default router;
