// src/server.js
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs, swaggerServe } from './middlewares/swaggerDocs.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cors());
  app.use(cookieParser());

  // Роут для статических файлов Swagger UI
  app.use('/api-docs', swaggerServe); // Swagger UI будет доступен по /api-docs

  // Роут для Swagger документации
  app.use('/api-docs', swaggerDocs()); // Здесь будет отображаться документация

  app.use(router);

  // Роут для загрузок
  app.use('/uploads', express.static(UPLOAD_DIR));

  // Обработка 404
  app.use('*', notFoundHandler);

  // Обработчик ошибок
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
