//src/middlewares/isValidId.js
import mongoose from 'mongoose';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};
