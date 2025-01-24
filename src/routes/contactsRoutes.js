import express from 'express';
import {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
} from '../controllers/contactsController.js';

const router = express.Router();

// Роуты для работы с контактами
router.get('/', getContacts);
router.get('/:contactId', getContactById);
router.post('/', addContact);
router.patch('/:contactId', updateContact); // Обновление контакта
router.delete('/:contactId', deleteContact); // Удаление контакта

export default router;
