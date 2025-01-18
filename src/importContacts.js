// src/importContacts.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Contact from './models/contactModel.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    process.exit(1); // Завершаем процесс с ошибкой
  }
};

const importContacts = async () => {
  try {
    const contactsPath = path.join(__dirname, 'contacts.json');
    const contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf8'));
    console.log('Imported contacts:', contacts); // Логируем импорты

    await Contact.deleteMany(); // Очистить коллекцию перед импортом
    console.log('Existing contacts cleared.');

    await Contact.insertMany(contacts);
    console.log('Contacts imported successfully!');
  } catch (error) {
    console.error('Error importing contacts:', error);
  } finally {
    mongoose.disconnect();
  }
};

const runImport = async () => {
  await connectToMongo();
  await importContacts();
};

runImport();
