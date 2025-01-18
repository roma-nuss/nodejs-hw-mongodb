import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Contact from '../models/contactModel.js'; // Путь к модели контактов
import dotenv from 'dotenv';

dotenv.config();

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

// Подключение к MongoDB
export const connectToMongo = async () => {
  const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Завершаем процесс с ошибкой
  }
};

// Импорт контактов из JSON файла
const importContacts = async () => {
  const contactsPath = path.resolve('contacts.json'); // Путь к JSON файлу
  console.log('Contacts path:', contactsPath); // Логируем путь к файлу

  try {
    const contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf8')); // Чтение данных из файла
    console.log('Imported contacts:', contacts); // Логируем контакты перед импортом

    // Очистить коллекцию перед импортом
    await Contact.deleteMany();
    console.log('Existing contacts cleared.');

    // Импортировать контакты
    await Contact.insertMany(contacts);
    console.log('Contacts imported successfully!');
  } catch (error) {
    console.error('Error importing contacts:', error);
  } finally {
    mongoose.disconnect(); // Закрытие соединения с MongoDB
  }
};

// Функция для запуска процесса подключения и импорта
const runImport = async () => {
  await connectToMongo(); // Подключаемся к базе данных
  await importContacts(); // Импортируем контакты
};

runImport(); // Запуск
