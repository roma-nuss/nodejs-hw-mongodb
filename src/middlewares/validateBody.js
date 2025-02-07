//src/middlewares/validateBody.js
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false }); // Включаем подробное сообщение об ошибках
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((err) => err.message).join(', ') });
    }
    next();
  };
};
