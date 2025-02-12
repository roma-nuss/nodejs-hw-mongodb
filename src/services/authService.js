import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Session from '../models/sessionModel.js'; // Импорт модели сессии
import createError from 'http-errors';

// Регистрация пользователя
export const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

// Генерация токенов
export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '1h',
  });

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '7d',
    },
  );

  return { accessToken, refreshToken };
};

// Логаут пользователя
export const logoutUser = async (userId) => {
  try {
    // Удаляем сессию пользователя по userId
    await Session.deleteOne({ userId });
  } catch (error) {
    console.error('Error during logout:', error); // Логируем ошибку
    throw createError(500, 'Failed to logout user');
  }
};
