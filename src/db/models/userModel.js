//src/db/models/userModel.js
import { Schema, model } from 'mongoose'; // Импортируем необходимые модули для работы с Mongoose

// Определяем схему для коллекции пользователей
const usersSchema = new Schema(
  {
    name: {
      type: String, // Имя пользователя
      required: true, // Обязательное поле
    },
    email: {
      type: String, // Электронная почта пользователя
      required: true, // Обязательное поле
      unique: true, // Почта должна быть уникальной для каждого пользователя
    },
    password: {
      type: String, // Пароль пользователя
      required: true, // Обязательное поле
    },
  },
  {
    timestamps: true, // Включаем автоматическое добавление полей createdAt и updatedAt
    versionKey: false, // Отключаем поле __v, которое используется для версий документа
  },
);

// Метод toJSON, который вызывается при преобразовании документа в JSON
usersSchema.methods.toJSON = function () {
  const obj = this.toObject(); // Преобразуем объект пользователя в обычный объект
  delete obj.password; // Удаляем поле пароля из объекта, чтобы не передавать его в ответе
  return obj; // Возвращаем объект без пароля
};

// Создаем модель для коллекции 'users' на основе схемы
export const UsersCollection = model('users', usersSchema);
