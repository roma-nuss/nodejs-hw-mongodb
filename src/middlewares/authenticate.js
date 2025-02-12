// src/middlewares/authenticate.js
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/userModel.js';

const authenticate = async (req, res, next) => {
  try {
    console.log('Authorization Header:', req.headers.authorization); // Логирование заголовка

    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.error('Authorization header is missing or invalid');
      throw createError(401, 'Authorization header is missing or invalid');
    }

    const token = authorization.split(' ')[1];
    console.log('Extracted Token:', token); // Для отладки

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      console.log('Token payload:', payload); // Для отладки
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.error('Token has expired');
        throw createError(401, 'Token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        console.error('Invalid token');
        throw createError(401, 'Invalid token');
      }
      console.error('Unexpected JWT error:', error.message);
      throw createError(500, 'Internal server error');
    }

    const user = await User.findById(payload.id);
    if (!user) {
      console.error('User not found in the database');
      throw createError(401, 'User not found');
    }

    if (!user.isActive) {
      console.error('User account is not active');
      throw createError(401, 'User account is not active');
    }

    req.user = user;
    console.log('Authenticated user:', user); // Для отладки

    next();
  } catch (error) {
    console.error('Authentication Error:', error.message); // Логируем общую ошибку
    next(error); // Передаем ошибку в обработчик
  }
};

export default authenticate;
