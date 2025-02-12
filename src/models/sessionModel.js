// src/models/sessionModel.js
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // ссылка на модель пользователя
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }, // добавление временных меток и отключение версии
);

// Экспорт модели сессии
export default mongoose.model('Session', sessionSchema);
