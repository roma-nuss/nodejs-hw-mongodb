import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';
import createHttpError from 'http-errors';

// Логин пользователя
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Проверяем, существует ли пользователь
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'Invalid email or password');
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, 'Invalid email or password');
    }

    // Создаем access и refresh токены
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' },
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' },
    );

    // Создаем сессию
    const session = await Session.create({
      userId: user._id,
      refreshToken,
    });

    // Устанавливаем refresh токен и ID сессии в куки
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
    res.cookie('sessionId', session._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Возвращаем успешный ответ
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error); // передаем фактическую ошибку
  }
};

// Обновление токена (refresh token)
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token is missing');
    }

    // Проверяем валидность refresh токена
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Проверяем существование сессии
    const session = await Session.findOne({ userId: payload.id, refreshToken });
    if (!session) {
      throw createHttpError(401, 'Invalid session or refresh token');
    }

    // Создаем новый access токен
    const accessToken = jwt.sign(
      { id: payload.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' },
    );

    // Возвращаем новый access токен
    res.status(200).json({
      status: 200,
      message: 'Token refreshed successfully',
      data: { accessToken },
    });
  } catch (error) {
    next(error); // исправляем: передаем фактическую ошибку
  }
};

// Выход пользователя
export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (!sessionId) {
      throw createHttpError(401, 'Session ID is missing');
    }

    // Удаляем сессию
    const session = await Session.findByIdAndDelete(sessionId);
    if (!session) {
      throw createHttpError(401, 'Invalid session');
    }

    // Очищаем куки
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(200).json({
      status: 200,
      message: 'User successfully logged out!',
    });
  } catch (error) {
    next(error); // передаем фактическую ошибку
  }
};

// Регистрация пользователя
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'Email is already in use');
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      status: 201,
      message: 'User created successfully',
      data: { user },
    });
  } catch (error) {
    next(error); // передаем фактическую ошибку
  }
};
