// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import { connectToMongo } from './db/initMongoConnection.js'; // Подключаем базу данных
import contactsRoutes from './routes/contactsRoutes.js'; // Подключаем маршруты для контактов
import pino from 'pino';
import pinoHttp from 'pino-http';

dotenv.config(); // Загружаем переменные окружения

const app = express();
const logger = pino({ transport: { target: 'pino-pretty' } });

// Логирование запросов с помощью pino
app.use(pinoHttp({ logger }));

// Разрешаем обработку JSON данных в теле запроса
app.use(express.json());

// Подключаем маршруты для контактов
app.use('/api/contacts', contactsRoutes);

// Обработчик для неизвестных маршрутов (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Обработка глобальных ошибок
app.use((err, req, res, next) => {
  logger.error(err); // Логируем ошибку
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Запуск сервера
const port = process.env.PORT || 3000;

app.listen(port, async () => {
  try {
    // Подключаемся к MongoDB
    await connectToMongo();
    logger.info(`Server is running on port ${port}`);
  } catch (error) {
    logger.error('Failed to start the application:', error.message);
    process.exit(1); // Завершаем процесс, если произошла ошибка
  }
});
