import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Добавлен импорт для работы с переменными окружения

dotenv.config(); // Загружаем переменные окружения

import contactsRouter from './routes/contactsRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Подключение к базе данных
const connectDB = async () => {
  try {
    const dbUri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

    console.log('Connecting to MongoDB with URI:', dbUri); // Логируем URI подключения для отладки
    await mongoose.connect(dbUri); // Используем собранную строку для подключения
    console.log('Connected to the database');
  } catch (error) {
    console.error('Database connection error:', error); // Логируем ошибку подключения
    process.exit(1); // Если ошибка при подключении, сервер не запускается
  }
};

export function setupServer() {
  const logger = pino({ transport: { target: 'pino-pretty' } });
  const app = express();

  // Подключение к базе данных
  connectDB();

  app.use(cors());
  app.use(pinoHttp({ logger }));
  app.use(express.json());

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRoutes);

  // Обробка 404
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Обробка помилок
  app.use((err, req, res, next) => {
    logger.error(err.stack); // Логируем стек ошибки
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Показывать стек только в режиме разработки
    });
  });

  return app;
}
