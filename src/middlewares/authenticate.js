import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/userModel.js';

const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Проверяем наличие заголовка Authorization
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization header is missing or invalid');
    }

    // Извлекаем токен
    const token = authorization.split(' ')[1]; // Более безопасный способ извлечения токена

    // Проверяем валидность токена
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Проверяем существование пользователя
    const user = await User.findById(payload.id);
    if (!user) {
      throw createHttpError(401, 'User not found or unauthorized');
    }

    // Сохраняем информацию о пользователе в запросе
    req.user = user;
    next();
  } catch (error) {
    // Обработка ошибок токена
    if (error.name === 'JsonWebTokenError') {
      next(createHttpError(401, 'Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(createHttpError(401, 'Token has expired'));
    } else {
      next(error); // Пробрасываем остальные ошибки
    }
  }
};

export default authenticate;
