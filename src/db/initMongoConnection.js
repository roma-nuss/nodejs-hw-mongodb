import mongoose from 'mongoose';

export async function initMongoConnection() {
  try {
    const mongoURI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;
    await mongoose.connect(mongoURI, {
      // Ніяких додаткових опцій більше не потрібно для Mongoose 6+
    });
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection failed', error);
    throw error; // Кидайте помилку, щоб сервер зупинився
  }
}
