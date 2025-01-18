import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import contactsRoutes from './routes/contactsRoutes.js';

export function setupServer() {
  const logger = pino({ transport: { target: 'pino-pretty' } });
  const app = express();

  // Включаем CORS
  app.use(cors());

  // Логирование запросов
  app.use(pinoHttp({ logger }));

  // Обработка JSON для body запросов
  app.use(express.json());

  // Подключаем маршруты
  app.use('/api/contacts', contactsRoutes);

  // Обработчик ошибок для неизвестных маршрутов
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Глобальная обработка ошибок
  app.use((err, req, res, next) => {
    logger.error(err); // Логируем ошибку

    // Проверка типа ошибки
    if (err instanceof SyntaxError) {
      res.status(400).json({ message: 'Invalid JSON format' });
    } else {
      res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
      });
    }
  });

  // Запуск сервера
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}
