// src/utils/ctrlWrapper.js

export const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      // Логирование ошибки в режиме разработки
      if (process.env.NODE_ENV !== 'production') {
        console.error('Controller error:', error);
      }

      // Установка статуса ошибки по умолчанию, если он отсутствует
      if (!error.status) {
        error.status = 500;
        error.message = 'Internal server error';
      }

      next(error);
    }
  };
};
