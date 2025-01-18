// src/models/contactModel.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: false },
    isFavourite: { type: Boolean, required: true },
    contactType: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  {
    timestamps: false, // Отключаем автоматическое создание полей createdAt и updatedAt
  },
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
