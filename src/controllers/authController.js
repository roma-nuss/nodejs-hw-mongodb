//src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import cookieParser from 'cookie-parser'; // Подключаем cookie-parser
import Session from '../models/sessionModel.js';
import User from '../models/userModel.js';
import { generateTokens } from '../services/authService.js';

// Middleware для cookie-parser
export const initMiddleware = (app) => {
  app.use(cookieParser()); // Это будет нужно добавить в файл server.js
};

// Регистрация пользователя
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Проверка на существующий email
    if (await User.findOne({ email })) {
      throw createError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateTokens(newUser._id);

    // Создаем сессию с токенами
    await Session.create({
      userId: newUser._id,
      accessToken,
      accessTokenValidUntil: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 час
      refreshToken,
      refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
    });

    // Устанавливаем refreshToken в куки
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Включаем только в продакшн
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      accessToken,
    });
  } catch (error) {
    console.error(error); // Логирование ошибки
    next(error);
  }
};

// Логин пользователя
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createError(401, 'Invalid email or password');
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    // Создаем сессию с токенами
    await Session.create({
      userId: user._id,
      accessToken,
      accessTokenValidUntil: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 час
      refreshToken,
      refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
    });

    // Устанавливаем refreshToken в куки
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Включаем только в продакшн
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: { accessToken },
    });
  } catch (error) {
    console.error(error); // Логирование ошибки
    next(error);
  }
};

// Обновление токенов
export const refreshToken = async (req, res, next) => {
  try {
    // Получаем refreshToken из куки через cookie-parser
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw createError(400, 'Refresh token is required');
    }

    // Находим сессию по refreshToken
    const session = await Session.findOne({ refreshToken });
    if (!session || session.refreshTokenValidUntil < new Date()) {
      throw createError(401, 'Invalid or expired refresh token');
    }

    // Находим пользователя по ID из сессии
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

    // Обновление сессии с новым accessToken
    session.accessToken = newAccessToken;
    session.accessTokenValidUntil = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 час
    await session.save();

    // Возврат нового accessToken
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed the session!',
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    console.error(error); // Логирование ошибки
    next(error);
  }
};

// Логаут пользователя
export const logoutUser = async (req, res, next) => {
  try {
    // Получаем refreshToken из куки через cookie-parser
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw createError(401, 'Refresh token is required');
    }

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createError(401, 'Invalid refresh token');
    }

    await Session.deleteOne({ refreshToken });

    // Удаляем refreshToken из куки
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(204).send();
  } catch (error) {
    console.error(error); // Логирование ошибки
    next(error);
  }
};
