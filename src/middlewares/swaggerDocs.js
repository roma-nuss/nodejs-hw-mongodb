import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';

import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH, 'utf-8'));
    // Возвращаем middleware для Swagger UI
    return swaggerUI.setup(swaggerDoc);
  } catch {
    // Обработка ошибки загрузки документации
    return (req, res, next) => {
      next(createHttpError(500, "Can't load swagger docs"));
    };
  }
};

export const swaggerServe = swaggerUI.serve; // Экспортируем middleware serve отдельно
