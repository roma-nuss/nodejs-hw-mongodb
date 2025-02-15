//src/db/models/sessionModel.js
import { model, Schema } from 'mongoose'; // Импортируем необходимые модули для работы с Mongoose

// Определяем схему для коллекции сессий пользователей
const sessionsSchema = new Schema(
  {
    userId: {
      type: String, // Ссылка на идентификатор пользователя, которому принадлежит сессия
      required: true, // Обязательное поле
    },
    accessToken: {
      type: String, // Доступный токен (JWT), который используется для авторизации
      required: true, // Обязательное поле
    },
    refreshToken: {
      type: String, // Токен обновления (refresh token), который используется для получения нового access token
      required: true, // Обязательное поле
    },
    accessTokenValidUntil: {
      type: Date, // Время истечения срока действия access token
      required: true, // Обязательное поле
    },
    refreshTokenValidUntil: {
      type: Date, // Время истечения срока действия refresh token
      required: true, // Обязательное поле
    },
  },
  {
    timestamps: true, // Включаем автоматическое добавление полей createdAt и updatedAt
    versionKey: false, // Отключаем поле __v, которое используется для версий документа
  },
);

// Создаем модель для коллекции 'sessions' на основе схемы
export const SessionsCollection = model('sessions', sessionsSchema);
