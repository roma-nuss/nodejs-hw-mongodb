import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Contact from './models/contactModel.js';

// Настройка для работы с __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Подключение к MongoDB
const connectToMongo = async () => {
  try {
    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Завершить процесс с ошибкой
  }
};

// Импорт контактов в базу данных
const importContacts = async () => {
  try {
    const contactsPath = path.join(__dirname, 'contacts.json');
    const contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf8'));

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

// Запуск импорта
const runImport = async () => {
  await connectToMongo();
  await importContacts();
};

runImport();
