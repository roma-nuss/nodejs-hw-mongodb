import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/userModel.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Проверяем наличие заголовка Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization header is missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    // Проверяем наличие токена
    if (!token) {
      throw createHttpError(401, 'Authorization token is missing');
    }

    // Верифицируем токен
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Проверяем, существует ли пользователь
    const user = await User.findById(payload.id);
    if (!user) {
      throw createHttpError(401, 'User not found or unauthorized');
    }

    // Добавляем данные пользователя в запрос
    req.user = user;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(createHttpError(401, 'Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(createHttpError(401, 'Token has expired'));
    } else {
      next(error);
    }
  }
};

export default authenticate;
