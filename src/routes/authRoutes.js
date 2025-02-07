// src/routes/authRoutes.js
import express from 'express';
import { registerUser, user } from '../controllers/authController.js';

const router = express.Router();

// Роут регистрации
router.post('/register', registerUser);

// Роут авторизации
router.post('/login', user);

export default router;
