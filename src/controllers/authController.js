import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import Session from '../models/sessionModel.js';
import User from '../models/userModel.js';
import { generateTokens } from '../services/authService.js';

// Регистрация пользователя
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Проверка существующего пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Генерация токенов
    const { accessToken, refreshToken } = generateTokens(newUser._id);

    // Создание сессии для хранения refreshToken
    const session = new Session({
      userId: newUser._id,
      refreshToken,
      refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
    });

    await session.save();

    // Логирование нового пользователя
    console.log('New User:', newUser);

    // Возвращаем информацию о пользователе, а также токены
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser, // Возвращаем данные о новом пользователе
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// Логин пользователя
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError(401, 'Invalid email or password');
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    // Создание сессии для хранения refreshToken
    const session = new Session({
      userId: user._id,
      refreshToken,
      refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
    });

    await session.save();

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// Обновление токенов
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError(400, 'Refresh token is required');
    }

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createError(401, 'Invalid or expired refresh token');
    }

    // Проверка на срок действия refresh token
    if (session.refreshTokenValidUntil < new Date()) {
      throw createError(401, 'Refresh token expired');
    }

    const user = await User.findById(session.userId);
    if (!user) {
      throw createError(401, 'User not found');
    }

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '1h' },
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

// Логаут пользователя
export const logoutUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw createError(401, 'Authorization header is missing or invalid');
    }

    const token = authorization.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    await Session.deleteOne({ userId: decoded.id });

    res.status(204).send(); // 204 статус для успешного логаута
  } catch (error) {
    next(error);
  }
};
