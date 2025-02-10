// src/middlewares/authenticate.js
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/userModel.js';

export const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Проверяем наличие заголовка Authorization
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw createError(401, 'Authorization header is missing or invalid');
    }

    // Извлекаем токен
    const token = authorization.replace('Bearer ', '');

    // Проверяем валидность токена
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw createError(401, 'Token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw createError(401, 'Invalid token');
      }
      throw error;
    }

    // Проверяем существование пользователя
    const user = await User.findById(payload.id);
    if (!user) {
      throw createError(401, 'User not found');
    }

    // Сохраняем информацию о пользователе в запросе
    req.user = user;
    next();
  } catch (error) {
    next(error); // Передаем ошибку в обработчик
  }
};
