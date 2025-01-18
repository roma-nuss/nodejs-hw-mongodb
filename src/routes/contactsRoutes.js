// src/routes/contactsRoutes.js

import { Router } from 'express';
import {
  getContacts,
  getContactById,
} from '../controllers/contactsController.js';

const router = Router();

router.get('/', getContacts); // Получить все контакты
router.get('/:id', getContactById); // Получить контакт по ID

export default router;
