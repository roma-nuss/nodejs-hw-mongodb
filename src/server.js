// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import contactsRouter from './routes/contactsRoutes.js';
import authRoutes from './routes/auth.js';

export function setupServer() {
  const logger = pino({ transport: { target: 'pino-pretty' } });
  const app = express();

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
    logger.error(err);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  });

  return app;
}
