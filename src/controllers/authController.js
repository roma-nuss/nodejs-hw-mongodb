// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';
import createHttpError from 'http-errors';

// Регистрация пользователя
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw createHttpError(400, 'Name, email, and password are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isActive: true, // Добавляем пользователя как активного по умолчанию
    });

    res.status(201).json({
      status: 201,
      message: 'User created successfully',
      data: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(createHttpError(400, error.message));
    } else {
      next(error);
    }
  }
};

// Логин пользователя
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createHttpError(400, 'Email and password are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw createHttpError(401, 'User account is not active'); // Проверка активности аккаунта
    }

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

    const accessTokenValidUntil = moment().add(15, 'minutes').toDate();
    const refreshTokenValidUntil = moment().add(7, 'days').toDate();

    const session = await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('sessionId', session._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

// Обновление токена
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token is missing');
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const session = await Session.findOne({
      userId: payload.id,
      refreshToken,
    });

    if (!session) {
      throw createHttpError(401, 'Invalid session or refresh token');
    }

    const accessToken = jwt.sign(
      { id: payload.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' },
    );

    res.status(200).json({
      status: 200,
      message: 'Token refreshed successfully',
      data: { accessToken },
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(createHttpError(401, 'Refresh token expired'));
    } else {
      next(error);
    }
  }
};

// Выход пользователя
export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (!sessionId) {
      throw createHttpError(401, 'Session ID is missing');
    }

    const session = await Session.findByIdAndDelete(sessionId);
    if (!session) {
      throw createHttpError(401, 'Invalid session');
    }

    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(204).send(); // Ответ без тела
  } catch (error) {
    next(error);
  }
};
