import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import contactsRoutes from './routes/contactsRoutes.js';

export function setupServer() {
  const logger = pino({ transport: { target: 'pino-pretty' } });
  const app = express();

  // Вмикаємо CORS
  app.use(cors());

  // Логування запитів
  app.use(pinoHttp({ logger }));

  // Додаємо парсинг JSON для body запитів
  app.use(express.json());

  // Підключаємо маршрути
  app.use('/api/contacts', contactsRoutes);

  // Обробка помилок для невідомих маршрутів
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Глобальна обробка помилок
  app.use((err, req, res, next) => {
    logger.error(err);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  });

  // Запуск сервера
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}
