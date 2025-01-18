import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import contactsRoutes from './routes/contactsRoutes.js';

export function setupServer() {
  const logger = pino({ transport: { target: 'pino-pretty' } });
  const app = express();

  app.use(cors());

  app.use(pinoHttp({ logger }));

  app.use(express.json());

  app.use('/api/contacts', contactsRoutes);

  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.use((err, req, res, next) => {
    logger.error(err);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}
