export const errorHandler = (err, req, res, next) => {
  console.error('Error stack:', err.stack); // Логирует весь стек ошибки
  console.error('Error message:', err.message); // Логирует сообщение ошибки

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    },
  });
};
