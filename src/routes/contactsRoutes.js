import express from 'express';
import {
  getContacts,
  getContactById,
} from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', getContacts);

router.get('/:id', getContactById);

export default router;
