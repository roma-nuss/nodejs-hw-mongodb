// src/index.js
import { connectToMongo } from './db/initMongoConnection.js'; // Импортируем функцию
import { setupServer } from './server.js';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  try {
    await connectToMongo(); // Вызываем connectToMongo
    setupServer();
  } catch (error) {
    console.error('Failed to start the application:', error.message);
    process.exit(1); // Завершаем процесс, если произошла ошибка
  }
})();
