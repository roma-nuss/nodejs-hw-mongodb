// src/middlewares/authenticate.js
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/userModel.js';

const authenticate = async (req, res, next) => {
  try {
    console.log('Cookies:', req.cookies); // Логирование всех кукис

    // Получаем refreshToken из куки
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      console.error('Refresh token is missing or invalid');
      throw createError(401, 'Refresh token is required');
    }

    // Проверяем и декодируем refreshToken
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_ACCESS_SECRET);
      console.log('Token payload:', payload); // Для отладки
    } catch (error) {
      const errorMessage =
        error instanceof jwt.TokenExpiredError
          ? 'Token has expired'
          : error instanceof jwt.JsonWebTokenError
            ? 'Invalid token'
            : 'Unexpected JWT error';
      console.error(errorMessage, error.message);
      throw createError(401, errorMessage); // Обработка различных типов ошибок
    }

    // Находим пользователя по ID из токена
    const user = await User.findById(payload.id);
    if (!user) {
      console.error('User not found in the database');
      throw createError(404, 'User not found');
    }

    if (!user.isActive) {
      console.error('User account is not active');
      throw createError(403, 'User account is not active'); // Статус 403 - доступ запрещен
    }

    // Сохраняем пользователя в запросе для дальнейшей работы
    req.user = user;
    console.log('Authenticated user:', user); // Для отладки

    next(); // Переходим к следующему middleware
  } catch (error) {
    console.error('Authentication Error:', error.message); // Логируем общую ошибку
    next(error); // Передаем ошибку в обработчик
  }
};

export default authenticate;
