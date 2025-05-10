// src/constants/index.js

// Импорт модуля path для работы с путями файловой системы
import path from 'node:path';

// Экспорт объекта SMTP с ключами для конфигурации SMTP-сервера
export const SMTP = {
  SMTP_HOST: 'SMTP_HOST', // Хост SMTP-сервера
  SMTP_PORT: 'SMTP_PORT', // Порт SMTP-сервера
  SMTP_USER: 'SMTP_USER', // Пользователь для SMTP-сервера
  SMTP_PASSWORD: 'SMTP_PASSWORD', // Пароль для пользователя SMTP-сервера
  SMTP_FROM: 'SMTP_FROM', // Адрес отправителя для SMTP
  JWT_SECRET: 'JWT_SECRET', // Секрет для подписи JWT-токенов
};

// Путь к директории с шаблонами для писем
export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

// Путь к временной директории для загрузки файлов
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');

// Путь к директории для окончательных загруженных файлов
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Экспорт объекта Cloudinary с ключами для конфигурации API Cloudinary
export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUDINARY_CLOUD_NAME',
  API_KEY: 'CLOUDINARY_API_KEY',
  API_SECRET: 'CLOUDINARY_API_SECRET',
};
