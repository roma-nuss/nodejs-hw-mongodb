import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import contactsRouter from './routes/contactsRoutes.js';
import authRoutes from './routes/authRoutes.js'; // Подключаем маршруты для аутентификации

export function setupServer() {
  const logger = pino({ transport: { target: 'pino-pretty' } });
  const app = express();

  app.use(cors());
  app.use(pinoHttp({ logger }));
  app.use(express.json());

  app.use('/contacts', contactsRouter); // Маршруты для контактов
  app.use('/auth', authRoutes); // Маршруты для аутентификации

  // Обработка 404
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Обработка ошибок
  app.use((err, req, res, next) => {
    logger.error(err);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  });

  return app;
}
