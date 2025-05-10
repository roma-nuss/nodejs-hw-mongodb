// src/middlewares/validateBody.js
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false }); // Подробные ошибки
    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Validation error',
        errors: error.details.map((err) => ({
          message: err.message,
          path: err.path.join('.'),
        })),
      });
    }
    next();
  };
};
