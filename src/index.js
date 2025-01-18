// src/index.js
import { connectToMongo } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  try {
    await connectToMongo();
    setupServer();
  } catch (error) {
    console.error('Failed to start the application:', error.message);
    process.exit(1); // Завершаем процесс, если произошла ошибка
  }
})();
