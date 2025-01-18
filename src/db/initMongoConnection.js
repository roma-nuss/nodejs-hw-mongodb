import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Contact from '../models/contactModel.js'; // Путь к модели контактов
import dotenv from 'dotenv';

dotenv.config();

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

// Подключение к MongoDB
export const connectToMongo = async () => {
  // Добавляем export
  const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Импорт контактов из JSON файла
const importContacts = async () => {
  // Получаем путь к текущей директории и строим путь относительно нее
  const contactsPath = path.resolve('contacts.json');
  console.log('Contacts path:', contactsPath); // Выведите путь для проверки

  const contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf8'));

  console.log('Imported contacts:', contacts); // Выведите контакты перед импортом

  try {
    // Очистить коллекцию перед импортом
    await Contact.deleteMany();
    console.log('Existing contacts cleared.');

    // Импортировать контакты
    await Contact.insertMany(contacts);
    console.log('Contacts imported successfully!');
  } catch (error) {
    console.error('Error importing contacts:', error);
  } finally {
    mongoose.disconnect();
  }
};

// Запуск импорта данных
const runImport = async () => {
  await connectToMongo();
  await importContacts();
};

runImport();
