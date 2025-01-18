// src/routes/contactsRoutes.js
import express from 'express';
import {
  getContacts,
  getContactById,
} from '../controllers/contactsController.js'; // Импортируем контроллеры

const router = express.Router();

// Маршрут для получения всех контактов
router.get('/', getContacts);

// Маршрут для получения контакта по ID
router.get('/:id', getContactById);

export default router; // Экспортируем маршруты
