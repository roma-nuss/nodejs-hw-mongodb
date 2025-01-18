import express from 'express';
import {
  getContacts,
  getContactById,
} from '../controllers/contactsController.js';

const router = express.Router();

// Роут для отримання всіх контактів
router.get('/', getContacts);

// Роут для отримання контакту за ID
router.get('/:contactId', getContactById);

export default router;
