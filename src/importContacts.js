const mongoose = require('mongoose');
const fs = require('fs');
const Contact = require('./models/contact');
const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

const connectToMongo = async () => {
  const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Mongo connection successfully established!');
};

const importContacts = async () => {
  try {
    const contacts = JSON.parse(fs.readFileSync('./contacts.json', 'utf8'));

    // Перш ніж імпортувати, очищаємо колекцію
    await Contact.deleteMany();

    // Імпортуємо нові дані
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
