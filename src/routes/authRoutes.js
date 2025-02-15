// src/routes/authRoutes.js
import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { validateBody } from '../middlewares/validateBody.js';
import authenticate from '../middlewares/authenticate.js'; // Middleware для проверки токена
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser, // Обновленный контроллер для логаута
} from '../controllers/authController.js';
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
} from '../validators/authValidators.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { User } from '../models/userModel.js'; // Подключение модели пользователя
import createHttpError from 'http-errors';

const router = express.Router();

// Получаем значения из .env
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
  JWT_SECRET,
  APP_DOMAIN,
} = process.env;

// Создаем транспорт для отправки почты через Brevo
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

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
router.post('/logout', authenticate, ctrlWrapper(logoutUser)); // Использование обновленного контроллера

// Роут для отправки письма с токеном сброса пароля
router.post('/send-reset-email', async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(createHttpError(400, 'Email is required.'));
  }

  try {
    // Проверяем, существует ли пользователь с таким email
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(404, 'User not found!'));
    }

    // Создаем JWT для сброса пароля
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: '5m',
    });

    // Формируем ссылку для сброса пароля
    const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

    // Настройка письма
    const mailOptions = {
      from: SMTP_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    };

    // Отправляем письмо
    await transporter.sendMail(mailOptions);

    // Ответ на успешную отправку
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    return next(
      createHttpError(
        500,
        `Failed to send the email, please try again later. Error: ${error.message}`,
      ),
    );
  }
});

// Роут для сброса пароля
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  async (req, res, next) => {
    const { token, password } = req.body;

    try {
      // Проверка и декодирование токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Проверяем, существует ли пользователь с таким email
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return next(createHttpError(404, 'User not found!'));
      }

      // Обновляем пароль пользователя (не забывайте о хешировании пароля)
      user.password = password; // Нужно хешировать пароль перед сохранением
      await user.save();

      // Удаляем текущую сессию пользователя
      // (например, если вы используете сессии или токены, нужно очистить их)

      res.status(200).json({
        status: 200,
        message: 'Password has been successfully reset.',
        data: {},
      });
    } catch (err) {
      // Обработка ошибок токена
      if (
        err.name === 'JsonWebTokenError' ||
        err.name === 'TokenExpiredError'
      ) {
        return next(createHttpError(401, 'Token is expired or invalid.'));
      }
      next(err);
    }
  },
);

export default router;
