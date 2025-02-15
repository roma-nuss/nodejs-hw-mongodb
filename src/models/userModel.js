// src/models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/.+@.+\..+/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    isActive: {
      type: Boolean,
      default: true, // Устанавливаем значение поля isActive как true по умолчанию
    },
  },
  { timestamps: true, versionKey: false }, // Отключаем поле _v
);

export const User = mongoose.model('User', userSchema); // Именованный экспорт
