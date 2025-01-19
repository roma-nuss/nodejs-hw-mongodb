// src/routes/contactsRoutes.js
import express from 'express';
import {
  getContacts,
  getContactById,
  addContact,
} from '../controllers/contactsController.js';

const router = express.Router();

// Получить все контакты
router.get('/', getContacts);

// Получить контакт по ID
router.get('/:id', getContactById);

// Добавить новый контакт
router.post('/', addContact);

export default router;
