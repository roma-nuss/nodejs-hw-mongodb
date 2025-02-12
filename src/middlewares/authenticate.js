import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/userModel.js';

const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Проверяем наличие заголовка Authorization
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw createError(401, 'Unauthorized');
    }

    // Извлекаем токен
    const token = authorization.split(' ')[1];

    // Проверяем валидность токена
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw createError(401, 'Unauthorized'); // Или 'Token has expired' для отладки
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw createError(401, 'Unauthorized'); // Или 'Invalid token' для отладки
      }
      console.error('Unexpected JWT error:', error.message);
      throw createError(500, 'Internal server error');
    }

    // Проверяем существование пользователя
    const user = await User.findById(payload.id);
    if (!user || !user.isActive) {
      throw createError(401, 'Unauthorized');
    }

    // Сохраняем информацию о пользователе в запросе
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error.message); // Для отладки
    next(error); // Передаем ошибку в обработчик
  }
};

export default authenticate;
