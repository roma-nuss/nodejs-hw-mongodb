import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js'; // Middleware для проверки токена
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} from '../controllers/authController.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

// Роут для регистрации
router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerUser),
);

// Роут для логина
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginUser));

// Роут для обновления access токена
router.post('/refresh', ctrlWrapper(refreshToken));

// Роут для логаута
router.post('/logout', authenticate, ctrlWrapper(logoutUser));

export default router;
