import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import Session from '../models/sessionModel.js';
import User from '../models/userModel.js';
import { generateTokens } from '../services/authService.js'; // Убедитесь, что эта функция генерирует оба токена

// Регистрация пользователя
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Проверка существующего пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, 'Email in use');
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Генерация токенов
    const { accessToken, refreshToken } = generateTokens(newUser._id);

    // Устанавливаем время действия accessToken (1 час)
    const accessTokenValidUntil = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 час

    // Создание сессии для хранения accessToken и refreshToken
    const session = new Session({
      userId: newUser._id,
      accessToken,
      accessTokenValidUntil, // Обязательное поле
      refreshToken,
      refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
    });

    await session.save();

    // Ответ с информацией о пользователе и токенами
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
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

    // Поиск пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(401, 'Invalid email or password');
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError(401, 'Invalid email or password');
    }

    // Генерация токенов
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Создание сессии для хранения accessToken и refreshToken
    const session = new Session({
      userId: user._id,
      accessToken,
      accessTokenValidUntil: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 час
      refreshToken,
      refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
    });

    await session.save();

    // Устанавливаем refreshToken в cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    });

    // Ответ с информацией о пользователе и токенами
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

// Обновление токенов
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createError(400, 'Refresh token is required');
    }

    // Поиск сессии по refreshToken
    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createError(401, 'Invalid or expired refresh token');
    }

    // Проверка на срок действия refreshToken
    if (session.refreshTokenValidUntil < new Date()) {
      throw createError(401, 'Refresh token expired');
    }

    const user = await User.findById(session.userId);
    if (!user) {
      throw createError(401, 'User not found');
    }

    // Генерация нового accessToken
    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '1h' },
    );

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};

// Логаут пользователя
export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createError(401, 'Refresh token is required');
    }

    // Поиск сессии по refreshToken
    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createError(401, 'Invalid refresh token');
    }

    // Удаление сессии из базы данных
    await Session.deleteOne({ refreshToken });

    // Очистка cookies
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // Ответ клиенту, подтверждающий успешный логаут
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
