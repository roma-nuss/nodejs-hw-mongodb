// src/routes/contactsRoutes.js
import express from 'express';
import {
  getContacts,
  getContactById,
} from '../controllers/contactsController.js';

const router = express.Router();

// Обработчик для получения всех контактов
router.get('/', getContacts);

// Обработчик для получения контакта по ID
router.get('/:id', getContactById);

export default router;
