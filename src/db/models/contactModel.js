//src/db/models/contactModel.js
import { model, Schema } from 'mongoose'; // Импортируем необходимые модули для работы с Mongoose

// Определяем схему для коллекции контактов
const contactsSchema = new Schema(
  {
    name: {
      type: String, // Поле для имени контакта
      required: true, // Обязательное поле
    },
    phoneNumber: {
      type: String, // Поле для номера телефона
      required: true, // Обязательное поле
    },
    email: {
      type: String, // Поле для email (необязательное)
    },
    isFavourite: {
      type: Boolean, // Поле для статуса избранного контакта
      default: false, // Значение по умолчанию - false (не избран)
    },
    contactType: {
      type: String, // Тип контакта (работа, дом, личный)
      enum: ['work', 'home', 'personal'], // Ограничиваем возможные значения
      required: true, // Обязательное поле
      default: 'personal', // Значение по умолчанию - 'personal'
    },
    userId: {
      type: Schema.Types.ObjectId, // Ссылка на объект пользователя, которому принадлежит контакт
      ref: 'users', // Ссылаемся на модель пользователей
      required: true, // Обязательное поле
    },
    photo: {
      type: String, // Поле для хранения URL фотографии контакта
    },
  },
  {
    timestamps: true, // Включаем автоматическое добавление полей createdAt и updatedAt
    versionKey: false, // Отключаем поле __v, которое используется для версий документа
  },
);

// Создаем модель для коллекции 'contacts' на основе схемы
export const contactsCollection = model('contacts', contactsSchema);
