// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import { connectToMongo } from './db/initMongoConnection.js'; // Импортируем подключение к базе данных
import contactsRoutes from './routes/contactsRoutes.js'; // Импортируем маршруты

dotenv.config(); // Загружаем переменные окружения

const app = express();

// Подключаем маршруты для контактов
app.use('/api/contacts', contactsRoutes);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  try {
    await connectToMongo(); // Подключаемся к MongoDB
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error('Failed to start the application:', error.message);
    process.exit(1); // Завершаем процесс, если произошла ошибка
  }
});
