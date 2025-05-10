// src/middlewares/errorHandler.js

export const errorHandler = (err, req, res, next) => {
  // Логирование ошибки с дополнительной информацией
  console.error('Error stack:', err.stack); // Логирует весь стек ошибки
  console.error('Error message:', err.message); // Логирует сообщение ошибки
  console.error('Request URL:', req.originalUrl); // Логирует URL, с которого поступил запрос
  console.error('Request Method:', req.method); // Логирует метод запроса

  // Понять, если ошибка связана с валидацией
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        message: 'Validation Error',
        details: err.errors, // Можно отправить детали ошибок валидации
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      },
    });
  }

  // Отправка общего сообщения об ошибке для прочих типов ошибок
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Скрывам стек ошибки в production
    },
  });
};
