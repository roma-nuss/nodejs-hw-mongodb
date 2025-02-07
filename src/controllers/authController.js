// src/controllers/authController.js
import { register } from '../services/authService.js';
import createError from 'http-errors';

// Функция для регистрации
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw createError(
        400,
        'Missing required fields: name, email, or password',
      );
    }

    const user = await register({ name, email, password });
    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Функция для авторизации пользователя (логин)
export const user = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createError(400, 'Missing email or password');
    }

    // Здесь можно добавить логику для поиска пользователя в базе данных и проверки пароля
    // Например, проверка по email и паролю (пока что заглушка)
    const user = { email }; // Предположим, что мы нашли пользователя с таким email
    res.status(200).json({
      status: 'success',
      message: 'User logged in successfully!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
