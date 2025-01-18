import express from 'express';
import dotenv from 'dotenv';
import { connectToMongo } from './db/initMongoConnection.js';
import contactsRoutes from './routes/contactsRoutes.js';
import pino from 'pino';
import pinoHttp from 'pino-http';

dotenv.config();

const app = express();
const logger = pino({ transport: { target: 'pino-pretty' } });

app.use(pinoHttp({ logger }));

app.use(express.json());

app.use('/api/contacts', contactsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  try {
    await connectToMongo();
    logger.info(`Server is running on port ${port}`);
  } catch (error) {
    logger.error('Failed to start the application:', error.message);
    process.exit(1);
  }
});
