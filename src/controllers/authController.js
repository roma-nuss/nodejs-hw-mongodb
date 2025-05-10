// src/controllers/authController.js

// Импорт константы для времени жизни куки
import { THIRTY_DAYS } from '../constants/constants.js';
// Импорт функций из сервиса для работы с пользователями
import {
  loginUser, // Логика для логина пользователя
  logoutUser, // Логика для логаута пользователя
  refreshUsersSession, // Логика для обновления сессии
  registerUser, // Логика для регистрации пользователя
  requestResetToken, // Логика для запроса сброса пароля
  resetPassword, // Логика для сброса пароля
} from '../services/authService.js';

// Контроллер для регистрации пользователя
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body); // Регистрируем пользователя через сервис
  res.status(201).json({
    status: 201, // Успешный ответ с кодом 201
    message: 'Successfully registered a user!', // Сообщение о регистрации
    data: user, // Данные зарегистрированного пользователя
  });
};

// Контроллер для логина пользователя
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body); // Логиним пользователя через сервис
  // Устанавливаем куки для refreshToken и sessionId с временем жизни 30 дней
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true, // Защищаем от доступа через JavaScript
    expires: new Date(Date.now() + THIRTY_DAYS), // Устанавливаем срок действия куки
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  // Возвращаем успешный ответ с accessToken
  res.json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: { accessToken: session.accessToken }, // Возвращаем токен доступа
  });
};

// Функция для установки куки сессии
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

// Контроллер для обновления сессии пользователя
export const refreshUserSessionController = async (req, res) => {
  // Обновляем сессию с помощью cookies
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  // Настроим новые куки для сессии
  setupSession(res, session);
  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken, // Возвращаем новый токен доступа
    },
  });
};

// Контроллер для выхода пользователя
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    // Если в cookies есть sessionId, выполняем логаут
    await logoutUser(req.cookies.sessionId);
  }
  // Очищаем куки
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send(); // Отправляем успешный ответ с кодом 204 (без содержания)
};

// Контроллер для запроса email для сброса пароля
export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email); // Запрашиваем токен сброса пароля через сервис

  res.json({
    message: 'Reset password email was successfully sent!', // Сообщение об успешной отправке email
    status: 200,
    data: {}, // Пустые данные
  });
};

// Контроллер для сброса пароля
export const resetPasswordController = async (req, res) => {
  // Выполняем сброс пароля через сервис
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!', // Сообщение о сбросе пароля
    status: 200,
    data: {}, // Пустые данные
  });
};
