// src/models/contactModel.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?\d{10,15}$/, 'Invalid phone number format'],
    },
    email: {
      type: String,
      match: [/.+@.+\..+/, 'Invalid email format'],
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'], // Ограничение на work, home, personal
      required: [true, 'Contact type is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Указываем связь с моделью пользователя
      required: [true, 'User ID is required'],
    },
    photo: {
      type: String, // Новое поле для хранения ссылки на фото
      default: '', // Если фото не загружено, оставляем пустую строку
    },
  },
  { timestamps: true, versionKey: false }, // Отключаем поле _v
);

export default mongoose.model('Contact', contactSchema);
