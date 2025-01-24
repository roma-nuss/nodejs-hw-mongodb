import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import contactsRoutes from './routes/contactsRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

export function setupServer() {
  const logger = pino({ transport: { target: 'pino-pretty' } });
  const app = express();

  app.use(cors());
  app.use(pinoHttp({ logger }));
  app.use(express.json());

  app.use('/api/contacts', contactsRoutes);

  // Middleware для обработки несуществующих маршрутов
  app.use(notFoundHandler);

  // Middleware для централизованной обработки ошибок
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}
