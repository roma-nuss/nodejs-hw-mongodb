import express from 'express';
import dotenv from 'dotenv';
import { connectToMongo } from './db/initMongoConnection.js';
import contactsRoutes from './routes/contactsRoutes.js';

dotenv.config();

const app = express();
app.use(express.json()); // Поддержка JSON в body запросов

// Подключаем маршруты для контактов (без '/api')
app.use('/contacts', contactsRoutes);

// Обработка некорректных маршрутов
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Not Found',
    data: null,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  try {
    await connectToMongo();
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error('Failed to start the application:', error.message);
    process.exit(1);
  }
});
