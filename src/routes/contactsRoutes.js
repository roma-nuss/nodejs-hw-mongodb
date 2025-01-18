import express from 'express';
import { getContacts } from '../controllers/contactsController.js'; // Убедитесь, что это правильно экспортируется

const router = express.Router();

// Путь для получения всех контактов
router.get('/', getContacts);

export default router;
