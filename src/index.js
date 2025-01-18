import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Failed to start the application:', error.message);
    process.exit(1); // Завершуємо процес, якщо сталася критична помилка
  }
})();
