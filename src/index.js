import dotenv from 'dotenv';
import { connectToMongo } from './db/initMongoConnection.js'; // Импортируем функцию для подключения
import { setupServer } from './server.js'; // Импортируем функцию для настройки сервера

dotenv.config(); // Загружаем переменные окружения из .env файла

// Асинхронная функция для запуска приложения
(async () => {
  try {
    // Подключаемся к базе данных MongoDB
    await connectToMongo();

    // Настроим и запустим сервер
    setupServer();
  } catch (error) {
    // Логируем ошибку, если что-то пошло не так
    console.error('Failed to start the application:', error.message);
    process.exit(1); // Завершаем процесс с ошибкой
  }
})();
